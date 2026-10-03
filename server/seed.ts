import bcrypt from 'bcryptjs';
import { connectDB } from './db';
import { User } from './models/User';
import { Tool } from './models/Tool';
import { Category } from './models/Category';
import { Review } from './models/Review';
import { Submission } from './models/Submission';
import { Favorite } from './models/Favorite';
import { categories as initialCategories } from '../src/data/categories';
import { tools as initialTools } from '../src/data/tools';
import { loadPersistentTools, loadPersistentSubmissions } from './storage';

export async function seedDatabase(force: boolean = false): Promise<void> {
  await connectDB();

  const userCount = await User.countDocuments();
  if (!force && userCount > 0) {
    console.log('[Seed] Database already contains records. Ensuring persistent disk tools are synced...');
    const persistentTools = loadPersistentTools();
    for (const pTool of persistentTools) {
      const existing = await Tool.findOne({ $or: [{ id: pTool.id }, { slug: pTool.slug }] });
      if (!existing) {
        await Tool.create(pTool);
        await Category.updateOne({ id: pTool.categoryId }, { $inc: { toolCount: 1 } });
        console.log(`[Seed] Synced persistent tool: ${pTool.name}`);
      }
    }
    return;
  }

  console.log('[Seed] Seeding database with initial platform data...');

  if (force) {
    await Promise.all([
      User.deleteMany({}),
      Tool.deleteMany({}),
      Category.deleteMany({}),
      Review.deleteMany({}),
      Submission.deleteMany({}),
      Favorite.deleteMany({}),
    ]);
    console.log('[Seed] Existing collections cleared.');
  }

  // 1. Seed Users (Admin & Demo User)
  const salt = await bcrypt.genSalt(10);
  const adminPasswordHash = await bcrypt.hash('admin1234', salt);
  const userPasswordHash = await bcrypt.hash('user1234', salt);

  const admin = await User.create({
    name: 'Admin Chief',
    email: 'admin@buildaihub.io',
    passwordHash: adminPasswordHash,
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    bio: 'Lead Platform Director & AI Engineering Architect at BuildAI Hub.',
  });

  const demoUser = await User.create({
    name: 'Sarah Jenkins',
    email: 'user@buildaihub.io',
    passwordHash: userPasswordHash,
    role: 'user',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
    bio: 'Full-stack software developer building AI micro-SaaS and intelligent workflow agents.',
  });

  console.log('[Seed] Created default users: admin@buildaihub.io and user@buildaihub.io');

  // 2. Seed Categories
  for (const cat of initialCategories) {
    await Category.create({
      id: cat.id,
      name: cat.name,
      slug: cat.slug,
      description: cat.description,
      toolCount: cat.toolCount,
      iconName: cat.iconName,
      accentGradient: cat.accentGradient,
    });
  }
  console.log(`[Seed] Created ${initialCategories.length} categories.`);

  // 3. Seed Tools
  for (const tool of initialTools) {
    await Tool.create({
      id: tool.id,
      name: tool.name,
      slug: tool.slug,
      tagline: tool.tagline,
      creator: tool.creator || '',
      creatorBio: tool.creatorBio || '',
      description: tool.description,
      categoryId: tool.categoryId,
      categoryName: tool.categoryName,
      pricing: tool.pricing,
      pricingStartingAt: tool.pricingStartingAt || '',
      rating: tool.rating,
      reviewCount: tool.reviewCount,
      websiteUrl: tool.websiteUrl,
      featured: tool.featured,
      trending: tool.trending,
      launchYear: tool.launchYear,
      status: 'approved',
      tags: tool.tags,
      features: tool.features,
      featureTags: tool.featureTags,
      platforms: tool.platforms,
      technologies: tool.technologies,
      screenshots: tool.screenshots,
      pros: tool.pros,
      cons: tool.cons,
      targetAudience: tool.targetAudience,
      logoGradient: tool.logoGradient,
      exportOptions: tool.exportOptions || [],
      comparisonSpecs: tool.comparisonSpecs,
      viewsCount: Math.floor(Math.random() * 800) + 120,
      clicksCount: Math.floor(Math.random() * 300) + 45,
      favoritesCount: Math.floor(Math.random() * 150) + 18,
    });
  }
  console.log(`[Seed] Created ${initialTools.length} tools.`);

  // 4. Seed Reviews for Lovable and Bolt.new
  await Review.create({
    toolId: 'lovable',
    userId: demoUser._id.toString(),
    authorName: 'Sarah Jenkins',
    authorRole: 'Senior Frontend Architect',
    rating: 5,
    comment: 'Lovable has fundamentally transformed our prototyping sprint. Generating clean TypeScript and connected Supabase backends in minutes is unreal.',
    avatarBg: 'bg-emerald-500',
  });

  await Review.create({
    toolId: 'bolt-new',
    userId: admin._id.toString(),
    authorName: 'Alex Mercer',
    authorRole: 'DevOps Lead',
    rating: 5,
    comment: 'In-browser WebContainers make testing full-stack Node.js environments instantaneous without installing anything locally. Remarkable engineering.',
    avatarBg: 'bg-indigo-600',
  });

  // 5. Seed Favorites for Demo User
  await Favorite.create({
    userId: demoUser._id.toString(),
    toolId: 'lovable',
  });
  await Favorite.create({
    userId: demoUser._id.toString(),
    toolId: 'v0-dev',
  });
  await Favorite.create({
    userId: demoUser._id.toString(),
    toolId: 'cursor',
  });

  // 6. Seed Sample Submissions (1 pending, 1 approved)
  await Submission.create({
    toolName: 'SuperAgent AI',
    websiteUrl: 'https://superagent.example.com',
    tagline: 'Autonomous AI browser worker for repetitive web operations',
    description: 'An open-source agent framework that executes multi-step workflows on any dynamic website.',
    categoryId: 'automation',
    pricing: 'Freemium',
    features: ['Headless Chromium engine', 'Natural language instruction', 'Webhook notifications'],
    submittedBy: demoUser._id.toString(),
    contactEmail: 'builder@superagent.example.com',
    status: 'pending',
  });

  // 7. Restore any tools saved to disk across server restarts
  const persistentTools = loadPersistentTools();
  for (const pTool of persistentTools) {
    const existing = await Tool.findOne({ $or: [{ id: pTool.id }, { slug: pTool.slug }] });
    if (!existing) {
      await Tool.create(pTool);
      await Category.updateOne({ id: pTool.categoryId }, { $inc: { toolCount: 1 } });
      console.log(`[Seed] Restored persistent tool from disk: ${pTool.name}`);
    }
  }

  // 8. Restore any submissions saved to disk
  const persistentSubmissions = loadPersistentSubmissions();
  for (const pSub of persistentSubmissions) {
    const existing = await Submission.findOne({ toolName: pSub.toolName, websiteUrl: pSub.websiteUrl });
    if (!existing) {
      await Submission.create(pSub);
      console.log(`[Seed] Restored persistent submission from disk: ${pSub.toolName}`);
    }
  }

  console.log('[Seed] Database initialization finished successfully.');
}

// Direct execution entrypoint
if (process.argv[1]?.endsWith('seed.ts')) {
  seedDatabase(true)
    .then(() => {
      console.log('[Seed] Seed script finished.');
      process.exit(0);
    })
    .catch((err) => {
      console.error('[Seed] Error during seeding:', err);
      process.exit(1);
    });
}
