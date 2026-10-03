import { Router, Response } from 'express';
import { Favorite } from '../models/Favorite';
import { Tool } from '../models/Tool';
import { AnalyticsEvent } from '../models/AnalyticsEvent';
import { authenticate, AuthenticatedRequest } from '../middleware/auth';

const router = Router();

// GET /api/favorites
router.get('/', authenticate, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized.' });
      return;
    }

    const favorites = await Favorite.find({ userId: req.user.id });
    const toolIds = favorites.map((f) => f.toolId);

    // Fetch matching tools
    const tools = await Tool.find({ id: { $in: toolIds } });

    res.json({
      toolIds,
      tools,
    });
  } catch (error: any) {
    console.error('Error fetching favorites:', error);
    res.status(500).json({ error: 'Failed to fetch favorites.' });
  }
});

// POST /api/favorites/toggle
router.post('/toggle', authenticate, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized.' });
      return;
    }

    const { toolId } = req.body;
    if (!toolId) {
      res.status(400).json({ error: 'Tool ID is required.' });
      return;
    }

    const tool = await Tool.findOne({ $or: [{ id: toolId }, { slug: toolId }] });
    if (!tool) {
      res.status(404).json({ error: 'Tool not found.' });
      return;
    }

    const existing = await Favorite.findOne({
      userId: req.user.id,
      toolId: tool.id,
    });

    let isFavorited = false;
    if (existing) {
      await Favorite.deleteOne({ _id: existing._id });
      tool.favoritesCount = Math.max(0, (tool.favoritesCount || 0) - 1);
      await tool.save();
      isFavorited = false;
    } else {
      await Favorite.create({
        userId: req.user.id,
        toolId: tool.id,
      });
      tool.favoritesCount = (tool.favoritesCount || 0) + 1;
      await tool.save();
      isFavorited = true;

      // Track favorite event
      AnalyticsEvent.create({
        eventType: 'favorite',
        toolId: tool.id,
        toolName: tool.name,
        categoryId: tool.categoryId,
        userId: req.user.id,
        ipAddress: req.ip || '',
        userAgent: req.headers['user-agent'] || '',
      }).catch(() => {});
    }

    res.json({
      isFavorited,
      favoritesCount: tool.favoritesCount,
      message: isFavorited ? 'Added to favorites.' : 'Removed from favorites.',
    });
  } catch (error: any) {
    console.error('Error toggling favorite:', error);
    res.status(500).json({ error: 'Failed to toggle favorite.' });
  }
});

export default router;
