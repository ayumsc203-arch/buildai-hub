import { Router, Response } from 'express';
import { User } from '../models/User';
import { Tool } from '../models/Tool';
import { Category } from '../models/Category';
import { Review } from '../models/Review';
import { Submission } from '../models/Submission';
import { AnalyticsEvent } from '../models/AnalyticsEvent';
import { authenticate, requireAdmin, AuthenticatedRequest } from '../middleware/auth';

const router = Router();

// All routes require authentication and admin role
router.use(authenticate, requireAdmin);

// GET /api/admin/stats
router.get('/stats', async (_req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const [
      totalTools,
      pendingTools,
      totalCategories,
      totalUsers,
      totalReviews,
      pendingSubmissions,
      totalViewsAgg,
      totalClicksAgg,
    ] = await Promise.all([
      Tool.countDocuments({ status: 'approved' }),
      Tool.countDocuments({ status: 'pending' }),
      Category.countDocuments(),
      User.countDocuments(),
      Review.countDocuments(),
      Submission.countDocuments({ status: 'pending' }),
      Tool.aggregate([{ $group: { _id: null, total: { $sum: '$viewsCount' } } }]),
      Tool.aggregate([{ $group: { _id: null, total: { $sum: '$clicksCount' } } }]),
    ]);

    const totalViews = totalViewsAgg[0]?.total || 0;
    const totalClicks = totalClicksAgg[0]?.total || 0;

    res.json({
      stats: {
        totalTools,
        pendingTools,
        totalCategories,
        totalUsers,
        totalReviews,
        pendingSubmissions,
        totalViews,
        totalClicks,
      },
    });
  } catch (error: any) {
    console.error('Error calculating admin stats:', error);
    res.status(500).json({ error: 'Failed to retrieve admin stats.' });
  }
});

// GET /api/admin/users
router.get('/users', async (_req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const users = await User.find().select('-passwordHash').sort({ createdAt: -1 });
    res.json({ users });
  } catch (error: any) {
    console.error('Error fetching admin users:', error);
    res.status(500).json({ error: 'Failed to retrieve users.' });
  }
});

// PATCH /api/admin/users/:id/role
router.patch('/users/:id/role', async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { role } = req.body;
    if (!['user', 'admin'].includes(role)) {
      res.status(400).json({ error: 'Invalid role.' });
      return;
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      res.status(404).json({ error: 'User not found.' });
      return;
    }

    user.role = role;
    await user.save();

    res.json({ message: 'User role updated.', user });
  } catch (error: any) {
    console.error('Error updating user role:', error);
    res.status(500).json({ error: 'Failed to update user role.' });
  }
});

// DELETE /api/admin/users/:id
router.delete('/users/:id', async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (req.user?.id === req.params.id) {
      res.status(400).json({ error: 'Cannot delete your own admin account.' });
      return;
    }

    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted successfully.' });
  } catch (error: any) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: 'Failed to delete user.' });
  }
});

// GET /api/admin/reviews
router.get('/reviews', async (_req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const reviews = await Review.find().sort({ createdAt: -1 });
    res.json({ reviews });
  } catch (error: any) {
    console.error('Error fetching admin reviews:', error);
    res.status(500).json({ error: 'Failed to retrieve reviews.' });
  }
});

export default router;
