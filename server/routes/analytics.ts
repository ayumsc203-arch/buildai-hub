import { Router, Request, Response } from 'express';
import { AnalyticsEvent } from '../models/AnalyticsEvent';
import { Tool } from '../models/Tool';
import { authenticate, requireAdmin, AuthenticatedRequest } from '../middleware/auth';

const router = Router();

// POST /api/analytics/event (Public endpoint to track user interactions)
router.post('/event', async (req: Request, res: Response): Promise<void> => {
  try {
    const { eventType, toolId, toolName, categoryId, searchQuery } = req.body;

    if (!eventType) {
      res.status(400).json({ error: 'eventType is required.' });
      return;
    }

    await AnalyticsEvent.create({
      eventType,
      toolId: toolId || '',
      toolName: toolName || '',
      categoryId: categoryId || '',
      searchQuery: searchQuery || '',
      ipAddress: req.ip || '',
      userAgent: req.headers['user-agent'] || '',
    });

    res.status(201).json({ success: true });
  } catch (error: any) {
    console.error('Error logging analytics event:', error);
    res.status(500).json({ error: 'Failed to record event.' });
  }
});

// GET /api/analytics/summary (Admin only: aggregated metrics for dashboard charts)
router.get('/summary', authenticate, requireAdmin, async (_req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    // Top 5 viewed tools
    const topViewed = await Tool.find({ status: 'approved' })
      .sort({ viewsCount: -1 })
      .limit(5)
      .select('name slug viewsCount clicksCount favoritesCount rating');

    // Top 5 clicked tools
    const topClicked = await Tool.find({ status: 'approved' })
      .sort({ clicksCount: -1 })
      .limit(5)
      .select('name slug viewsCount clicksCount websiteUrl');

    // Top searches
    const topSearches = await AnalyticsEvent.aggregate([
      { $match: { eventType: 'search', searchQuery: { $ne: '' } } },
      { $group: { _id: '$searchQuery', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 8 },
    ]);

    // Daily activity counts (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const activityByDay = await AnalyticsEvent.aggregate([
      { $match: { createdAt: { $gte: sevenDaysAgo } } },
      {
        $group: {
          _id: {
            day: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
            type: '$eventType',
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { '_id.day': 1 } },
    ]);

    res.json({
      topViewed,
      topClicked,
      topSearches: topSearches.map((s) => ({ query: s._id, count: s.count })),
      activityByDay,
    });
  } catch (error: any) {
    console.error('Error compiling analytics summary:', error);
    res.status(500).json({ error: 'Failed to retrieve analytics summary.' });
  }
});

export default router;
