import { Router, Response } from 'express';
import { Submission } from '../models/Submission';
import { Tool } from '../models/Tool';
import { Category } from '../models/Category';
import { authenticate, optionalAuth, requireAdmin, AuthenticatedRequest } from '../middleware/auth';
import { savePersistentTool, savePersistentSubmission } from '../storage';

const router = Router();

// POST /api/submissions (Submit a new tool -> Stores in DB, publishes to directory, persists to disk)
router.post('/', optionalAuth, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const {
      toolName,
      websiteUrl,
      tagline,
      description,
      categoryId,
      pricing = 'Freemium',
      pricingStartingAt,
      features = [],
      logoUrl,
      screenshots = [],
      technologies = [],
      tags = [],
      contactEmail,
    } = req.body;

    if (!toolName || !websiteUrl || !description || !categoryId || !contactEmail) {
      res.status(400).json({
        error: 'Tool name, website URL, description, category, and contact email are required.',
      });
      return;
    }

    // 1. Create Submission Record
    const submission = await Submission.create({
      toolName: toolName.trim(),
      websiteUrl: websiteUrl.trim(),
      tagline: tagline ? tagline.trim() : '',
      description: description.trim(),
      categoryId,
      pricing,
      features: Array.isArray(features) ? features : [],
      logoUrl: logoUrl || '',
      screenshots: Array.isArray(screenshots) ? screenshots : [],
      technologies: Array.isArray(technologies) ? technologies : [],
      tags: Array.isArray(tags) ? tags : [],
      submittedBy: req.user ? req.user.id : '',
      contactEmail: contactEmail.trim().toLowerCase(),
      status: 'approved',
    });

    // 2. Create or Update Live Tool in Database
    const baseSlug = toolName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '') || `tool-${Date.now()}`;
    
    // Check if slug already exists; if so, create a unique slug
    let slug = baseSlug;
    const existingSlug = await Tool.findOne({ slug });
    if (existingSlug) {
      slug = `${baseSlug}-${Date.now().toString().slice(-4)}`;
    }
    const id = slug;

    const category = await Category.findOne({ id: categoryId });
    const categoryName = category ? category.name : 'AI Tools';

    const defaultScreenshots = logoUrl
      ? [{ url: logoUrl, caption: `${toolName.trim()} Interface` }]
      : [
          {
            url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
            caption: `${toolName.trim()} Dashboard`,
          },
        ];

    const createdTool = await Tool.create({
      id,
      name: toolName.trim(),
      slug,
      tagline: tagline ? tagline.trim() : description.slice(0, 90) + '...',
      creator: req.user?.name || 'Community Submitter',
      creatorBio: `Submitted by verified builder (${contactEmail}).`,
      description: description.trim(),
      categoryId,
      categoryName,
      pricing,
      pricingStartingAt: pricingStartingAt || (pricing === 'Free' ? '$0' : '$19/mo'),
      rating: 5.0,
      reviewCount: 1,
      websiteUrl: websiteUrl.trim(),
      featured: false,
      trending: true,
      launchYear: new Date().getFullYear(),
      status: 'approved',
      tags: tags && tags.length > 0 ? tags : ['AI', categoryName, 'New'],
      features:
        features && features.length > 0
          ? features
          : ['AI-Powered Generation', 'Modern Web Engine', 'Instant Deployment'],
      featureTags: ['AI Generation', 'No-code'],
      platforms: ['Web'],
      technologies: technologies && technologies.length > 0 ? technologies : ['Web', 'Cloud API'],
      screenshots:
        screenshots && screenshots.length > 0
          ? screenshots.map((url: string) => ({ url, caption: toolName }))
          : defaultScreenshots,
      pros: ['Innovative AI architecture', 'Modern developer experience', 'Quick onboarding'],
      cons: ['Newly launched platform'],
      targetAudience: ['Developers', 'Designers', 'Founders', 'Creators'],
      logoGradient: 'from-blue-500 via-indigo-500 to-purple-600',
      comparisonSpecs: {
        priceStartingAt: pricingStartingAt || (pricing === 'Free' ? '$0' : '$19/mo'),
        freePlanAvailable: pricing === 'Free' || pricing === 'Freemium',
        hasAiGeneration: true,
        hasDatabase: false,
        hasAuth: false,
        hasCodeExport: true,
        hasApi: true,
        hostingIncluded: true,
        bestFor: tagline || description.slice(0, 80),
      },
      viewsCount: 1,
      clicksCount: 0,
      favoritesCount: 0,
    });

    if (category) {
      category.toolCount += 1;
      await category.save();
    }

    // 3. Persist to disk so data is never lost across server restarts
    savePersistentTool(createdTool);
    savePersistentSubmission(submission);

    res.status(201).json({
      message: 'Thanks! Your tool submission has been approved and published to the directory.',
      submission,
      tool: createdTool,
    });
  } catch (error: any) {
    console.error('Error submitting tool:', error);
    res.status(500).json({ error: 'Failed to submit tool for review.' });
  }
});

// GET /api/submissions/my (Get logged-in user's submitted tools)
router.get('/my', authenticate, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized.' });
      return;
    }

    const submissions = await Submission.find({
      $or: [{ submittedBy: req.user.id }, { contactEmail: req.user.email }],
    }).sort({ createdAt: -1 });

    res.json({ submissions });
  } catch (error: any) {
    console.error('Error fetching user submissions:', error);
    res.status(500).json({ error: 'Failed to fetch your submissions.' });
  }
});

// GET /api/submissions (Admin: list all submissions)
router.get('/', authenticate, requireAdmin, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { status } = req.query;
    const filter: any = {};
    if (status && status !== 'all') {
      filter.status = status;
    }

    const submissions = await Submission.find(filter).sort({ createdAt: -1 });
    res.json({ submissions });
  } catch (error: any) {
    console.error('Error fetching submissions for admin:', error);
    res.status(500).json({ error: 'Failed to fetch submissions.' });
  }
});

// PATCH /api/submissions/:id/approve (Admin approves submission & auto-creates Tool)
router.patch('/:id/approve', authenticate, requireAdmin, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const submission = await Submission.findById(req.params.id);
    if (!submission) {
      res.status(404).json({ error: 'Submission not found.' });
      return;
    }

    submission.status = 'approved';
    await submission.save();

    // Create or approve corresponding Tool
    const slug = submission.toolName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const id = slug;

    const existingTool = await Tool.findOne({ $or: [{ id }, { slug }] });
    let createdTool;

    const category = await Category.findOne({ id: submission.categoryId });
    const categoryName = category ? category.name : 'AI Tools';

    if (!existingTool) {
      createdTool = await Tool.create({
        id,
        name: submission.toolName,
        slug,
        tagline: submission.tagline || submission.description.slice(0, 80) + '...',
        description: submission.description,
        categoryId: submission.categoryId,
        categoryName,
        pricing: submission.pricing,
        websiteUrl: submission.websiteUrl,
        featured: false,
        trending: true,
        status: 'approved',
        tags: submission.tags && submission.tags.length > 0 ? submission.tags : ['AI', categoryName],
        features: submission.features && submission.features.length > 0 ? submission.features : ['AI-Powered Generation'],
        featureTags: ['AI Generation'],
        platforms: ['Web'],
        technologies: submission.technologies && submission.technologies.length > 0 ? submission.technologies : ['Web'],
        screenshots: submission.screenshots?.map((url) => ({ url, caption: submission.toolName })) || [],
        pros: ['Innovative AI capabilities', 'Modern user interface'],
        cons: ['Continuous feature development in progress'],
        targetAudience: ['Developers', 'Designers', 'Founders'],
        logoGradient: 'from-blue-500 via-indigo-500 to-purple-600',
        comparisonSpecs: {
          priceStartingAt: submission.pricing === 'Free' ? '$0' : '$19/mo',
          freePlanAvailable: submission.pricing === 'Free' || submission.pricing === 'Freemium',
          hasAiGeneration: true,
          hasDatabase: false,
          hasAuth: false,
          hasCodeExport: true,
          hasApi: true,
          hostingIncluded: true,
          bestFor: 'Modern builders and creators',
        },
      });

      if (category) {
        category.toolCount += 1;
        await category.save();
      }
    } else {
      existingTool.status = 'approved';
      await existingTool.save();
      createdTool = existingTool;
    }

    // Persist to disk
    savePersistentTool(createdTool);
    savePersistentSubmission(submission);

    res.json({
      message: 'Submission approved and tool published to directory.',
      submission,
      tool: createdTool,
    });
  } catch (error: any) {
    console.error('Error approving submission:', error);
    res.status(500).json({ error: 'Failed to approve submission.' });
  }
});

// PATCH /api/submissions/:id/reject (Admin rejects submission)
router.patch('/:id/reject', authenticate, requireAdmin, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { reason } = req.body;
    const submission = await Submission.findById(req.params.id);
    if (!submission) {
      res.status(404).json({ error: 'Submission not found.' });
      return;
    }

    submission.status = 'rejected';
    if (reason) submission.rejectionReason = reason;
    await submission.save();

    savePersistentSubmission(submission);

    res.json({
      message: 'Submission rejected.',
      submission,
    });
  } catch (error: any) {
    console.error('Error rejecting submission:', error);
    res.status(500).json({ error: 'Failed to reject submission.' });
  }
});

export default router;
