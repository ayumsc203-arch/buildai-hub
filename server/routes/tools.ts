import { Router, Request, Response } from 'express';
import { Tool } from '../models/Tool';
import { Category } from '../models/Category';
import { AnalyticsEvent } from '../models/AnalyticsEvent';
import { authenticate, requireAdmin, AuthenticatedRequest } from '../middleware/auth';
import { savePersistentTool, removePersistentTool } from '../storage';

const router = Router();

// Calculate trending score dynamically:
// score = (views * 1) + (clicks * 3) + (favorites * 5) + (reviews * 4) + (rating * 20)
function calculateTrendingScore(tool: any): number {
  const views = tool.viewsCount || 0;
  const clicks = tool.clicksCount || 0;
  const favorites = tool.favoritesCount || 0;
  const reviews = tool.reviewCount || 0;
  const rating = tool.rating || 0;
  return views * 1 + clicks * 3 + favorites * 5 + reviews * 4 + rating * 20;
}

// GET /api/tools
router.get('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      q,
      category,
      pricing,
      platform,
      tech,
      minRating,
      featured,
      trending,
      sort = 'trending',
      status = 'approved',
      limit,
      page = 1,
    } = req.query;

    const filter: any = {};

    // Filter by status (default to approved for public queries)
    if (status !== 'all') {
      filter.status = status;
    }

    // Category filter (slug or id)
    if (category && category !== 'all') {
      filter.categoryId = category;
    }

    // Pricing filter
    if (pricing && pricing !== 'all') {
      filter.pricing = pricing;
    }

    // Rating filter
    if (minRating) {
      const min = parseFloat(minRating as string);
      if (!isNaN(min)) {
        filter.rating = { $gte: min };
      }
    }

    // Platform filter
    if (platform && platform !== 'all') {
      filter.platforms = platform;
    }

    // Technology filter
    if (tech && tech !== 'all') {
      filter.technologies = tech;
    }

    // Featured filter
    if (featured === 'true') {
      filter.featured = true;
    }

    // Trending filter
    if (trending === 'true') {
      filter.trending = true;
    }

    // Text search filter
    if (q && typeof q === 'string' && q.trim()) {
      const term = q.trim();
      const regex = new RegExp(term, 'i');
      filter.$or = [
        { name: regex },
        { description: regex },
        { tagline: regex },
        { tags: regex },
        { features: regex },
        { featureTags: regex },
        { technologies: regex },
      ];

      // Track search analytics asynchronously
      AnalyticsEvent.create({
        eventType: 'search',
        searchQuery: term,
        ipAddress: req.ip || '',
        userAgent: req.headers['user-agent'] || '',
      }).catch(() => {});
    }

    let query = Tool.find(filter);

    // Sorting
    switch (sort) {
      case 'rating':
        query = query.sort({ rating: -1, reviewCount: -1 });
        break;
      case 'newest':
        query = query.sort({ createdAt: -1 });
        break;
      case 'name':
        query = query.sort({ name: 1 });
        break;
      case 'reviews':
        query = query.sort({ reviewCount: -1 });
        break;
      case 'trending':
      default:
        // Featured and trending first, then reviewCount & rating
        query = query.sort({ trending: -1, featured: -1, rating: -1, reviewCount: -1 });
        break;
    }

    // Pagination
    const pageNum = parseInt(page as string, 10) || 1;
    const limitNum = limit ? parseInt(limit as string, 10) : 0;

    const total = await Tool.countDocuments(filter);

    if (limitNum > 0) {
      query = query.skip((pageNum - 1) * limitNum).limit(limitNum);
    }

    let toolsList = await query.exec();

    // If dynamic trending sort requested, enrich with score
    if (sort === 'trending') {
      toolsList = toolsList.sort((a, b) => calculateTrendingScore(b) - calculateTrendingScore(a));
    }

    res.json({
      tools: toolsList,
      total,
      page: pageNum,
      totalPages: limitNum > 0 ? Math.ceil(total / limitNum) : 1,
    });
  } catch (error: any) {
    console.error('Error fetching tools:', error);
    res.status(500).json({ error: 'Failed to fetch tools.' });
  }
});

// GET /api/tools/:slugOrId
router.get('/:slugOrId', async (req: Request, res: Response): Promise<void> => {
  try {
    const { slugOrId } = req.params;

    const tool = await Tool.findOne({
      $or: [{ slug: slugOrId.toLowerCase() }, { id: slugOrId }],
    });

    if (!tool) {
      res.status(404).json({ error: 'Tool not found.' });
      return;
    }

    // Increment views count asynchronously
    tool.viewsCount = (tool.viewsCount || 0) + 1;
    await tool.save();

    // Log analytics view event
    AnalyticsEvent.create({
      eventType: 'tool_view',
      toolId: tool.id,
      toolName: tool.name,
      categoryId: tool.categoryId,
      ipAddress: req.ip || '',
      userAgent: req.headers['user-agent'] || '',
    }).catch(() => {});

    res.json({ tool });
  } catch (error: any) {
    console.error('Error fetching tool details:', error);
    res.status(500).json({ error: 'Failed to fetch tool details.' });
  }
});

// POST /api/tools/:slugOrId/click (External website outbound click)
router.post('/:slugOrId/click', async (req: Request, res: Response): Promise<void> => {
  try {
    const { slugOrId } = req.params;

    const tool = await Tool.findOne({
      $or: [{ slug: slugOrId.toLowerCase() }, { id: slugOrId }],
    });

    if (!tool) {
      res.status(404).json({ error: 'Tool not found.' });
      return;
    }

    tool.clicksCount = (tool.clicksCount || 0) + 1;
    await tool.save();

    AnalyticsEvent.create({
      eventType: 'tool_click',
      toolId: tool.id,
      toolName: tool.name,
      categoryId: tool.categoryId,
      ipAddress: req.ip || '',
      userAgent: req.headers['user-agent'] || '',
    }).catch(() => {});

    res.json({ message: 'Click recorded.', clicksCount: tool.clicksCount });
  } catch (error: any) {
    console.error('Error recording tool click:', error);
    res.status(500).json({ error: 'Failed to record click.' });
  }
});

// POST /api/tools (Admin only: create new tool)
router.post('/', authenticate, requireAdmin, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const data = req.body;

    if (!data.name || !data.categoryId || !data.websiteUrl) {
      res.status(400).json({ error: 'Name, category, and website URL are required.' });
      return;
    }

    const slug = data.slug || data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const id = data.id || slug;

    // Check duplicate
    const existing = await Tool.findOne({ $or: [{ id }, { slug }] });
    if (existing) {
      res.status(409).json({ error: 'A tool with this name or slug already exists.' });
      return;
    }

    // Fetch category name
    const cat = await Category.findOne({ id: data.categoryId });
    const categoryName = cat ? cat.name : data.categoryName || 'AI Tools';

    const tool = await Tool.create({
      ...data,
      id,
      slug,
      categoryName,
      status: data.status || 'approved',
    });

    // Update category toolCount
    if (cat) {
      cat.toolCount += 1;
      await cat.save();
    }

    savePersistentTool(tool);

    res.status(201).json({ message: 'Tool created successfully.', tool });
  } catch (error: any) {
    console.error('Error creating tool:', error);
    res.status(500).json({ error: 'Failed to create tool.' });
  }
});

// PUT /api/tools/:id (Admin only: update tool)
router.put('/:id', authenticate, requireAdmin, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const tool = await Tool.findOne({ $or: [{ id }, { _id: id }] });
    if (!tool) {
      res.status(404).json({ error: 'Tool not found.' });
      return;
    }

    // Apply updates
    Object.assign(tool, updates);
    await tool.save();

    savePersistentTool(tool);

    res.json({ message: 'Tool updated successfully.', tool });
  } catch (error: any) {
    console.error('Error updating tool:', error);
    res.status(500).json({ error: 'Failed to update tool.' });
  }
});

// DELETE /api/tools/:id (Admin only: delete tool)
router.delete('/:id', authenticate, requireAdmin, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const tool = await Tool.findOneAndDelete({ $or: [{ id }, { _id: id }] });
    if (!tool) {
      res.status(404).json({ error: 'Tool not found.' });
      return;
    }

    // Update category count
    await Category.updateOne({ id: tool.categoryId }, { $inc: { toolCount: -1 } });

    removePersistentTool(tool.id);
    if (tool.slug) removePersistentTool(tool.slug);

    res.json({ message: 'Tool removed successfully.' });
  } catch (error: any) {
    console.error('Error deleting tool:', error);
    res.status(500).json({ error: 'Failed to delete tool.' });
  }
});

export default router;
