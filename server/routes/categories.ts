import { Router, Request, Response } from 'express';
import { Category } from '../models/Category';
import { Tool } from '../models/Tool';
import { authenticate, requireAdmin, AuthenticatedRequest } from '../middleware/auth';

const router = Router();

// GET /api/categories
router.get('/', async (_req: Request, res: Response): Promise<void> => {
  try {
    const categories = await Category.find().sort({ toolCount: -1, name: 1 });

    // Ensure live toolCounts are up-to-date
    const counts = await Tool.aggregate([
      { $match: { status: 'approved' } },
      { $group: { _id: '$categoryId', count: { $sum: 1 } } },
    ]);
    const countMap = new Map<string, number>();
    counts.forEach((c) => countMap.set(c._id, c.count));

    const enrichedCategories = categories.map((cat) => {
      const liveCount = countMap.get(cat.id);
      return {
        ...cat.toObject(),
        toolCount: liveCount !== undefined ? liveCount : cat.toolCount,
      };
    });

    res.json({ categories: enrichedCategories });
  } catch (error: any) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ error: 'Failed to fetch categories.' });
  }
});

// GET /api/categories/:slug
router.get('/:slug', async (req: Request, res: Response): Promise<void> => {
  try {
    const { slug } = req.params;
    const category = await Category.findOne({
      $or: [{ slug: slug.toLowerCase() }, { id: slug.toLowerCase() }],
    });

    if (!category) {
      res.status(404).json({ error: 'Category not found.' });
      return;
    }

    const liveCount = await Tool.countDocuments({ categoryId: category.id, status: 'approved' });

    res.json({
      category: {
        ...category.toObject(),
        toolCount: liveCount,
      },
    });
  } catch (error: any) {
    console.error('Error fetching category:', error);
    res.status(500).json({ error: 'Failed to fetch category.' });
  }
});

// POST /api/categories (Admin only)
router.post('/', authenticate, requireAdmin, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { name, slug, description, iconName, accentGradient } = req.body;

    if (!name || !description) {
      res.status(400).json({ error: 'Name and description are required.' });
      return;
    }

    const cleanSlug = slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const id = cleanSlug;

    const existing = await Category.findOne({ $or: [{ id }, { slug: cleanSlug }] });
    if (existing) {
      res.status(409).json({ error: 'A category with this name or slug already exists.' });
      return;
    }

    const category = await Category.create({
      id,
      name,
      slug: cleanSlug,
      description,
      iconName: iconName || 'Layers',
      accentGradient: accentGradient || 'from-indigo-500 to-cyan-500',
      toolCount: 0,
    });

    res.status(201).json({ message: 'Category created successfully.', category });
  } catch (error: any) {
    console.error('Error creating category:', error);
    res.status(500).json({ error: 'Failed to create category.' });
  }
});

// PUT /api/categories/:id (Admin only)
router.put('/:id', authenticate, requireAdmin, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const category = await Category.findOne({ $or: [{ id }, { _id: id }] });
    if (!category) {
      res.status(404).json({ error: 'Category not found.' });
      return;
    }

    Object.assign(category, updates);
    await category.save();

    res.json({ message: 'Category updated successfully.', category });
  } catch (error: any) {
    console.error('Error updating category:', error);
    res.status(500).json({ error: 'Failed to update category.' });
  }
});

// DELETE /api/categories/:id (Admin only)
router.delete('/:id', authenticate, requireAdmin, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const category = await Category.findOneAndDelete({ $or: [{ id }, { _id: id }] });

    if (!category) {
      res.status(404).json({ error: 'Category not found.' });
      return;
    }

    res.json({ message: 'Category deleted successfully.' });
  } catch (error: any) {
    console.error('Error deleting category:', error);
    res.status(500).json({ error: 'Failed to delete category.' });
  }
});

export default router;
