import { Router, Request, Response } from 'express';
import { Review } from '../models/Review';
import { Tool } from '../models/Tool';
import { authenticate, AuthenticatedRequest } from '../middleware/auth';

const router = Router();

// GET /api/reviews/:toolId
router.get('/:toolId', async (req: Request, res: Response): Promise<void> => {
  try {
    const { toolId } = req.params;

    const reviews = await Review.find({ toolId }).sort({ createdAt: -1 });

    // Calculate rating distribution
    const distribution: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    let sum = 0;

    reviews.forEach((r) => {
      const rounded = Math.min(5, Math.max(1, Math.round(r.rating)));
      distribution[rounded] = (distribution[rounded] || 0) + 1;
      sum += r.rating;
    });

    const count = reviews.length;
    const average = count > 0 ? parseFloat((sum / count).toFixed(1)) : 0;

    res.json({
      reviews,
      count,
      average,
      distribution,
    });
  } catch (error: any) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({ error: 'Failed to fetch reviews.' });
  }
});

// POST /api/reviews
router.post('/', authenticate, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized. Please login to post a review.' });
      return;
    }

    const { toolId, rating, comment, authorRole } = req.body;

    if (!toolId || !rating || !comment) {
      res.status(400).json({ error: 'Tool ID, rating (1-5), and comment are required.' });
      return;
    }

    const numRating = Number(rating);
    if (isNaN(numRating) || numRating < 1 || numRating > 5) {
      res.status(400).json({ error: 'Rating must be an integer between 1 and 5.' });
      return;
    }

    // Verify tool exists
    const tool = await Tool.findOne({ $or: [{ id: toolId }, { slug: toolId }] });
    if (!tool) {
      res.status(404).json({ error: 'Tool not found.' });
      return;
    }

    // Duplicate review check: user can only submit 1 review per tool
    const existingReview = await Review.findOne({
      toolId: tool.id,
      userId: req.user.id,
    });

    if (existingReview) {
      res.status(409).json({
        error: 'You have already submitted a review for this tool. You can update your existing review instead.',
      });
      return;
    }

    const avatarColors = [
      'bg-indigo-600',
      'bg-cyan-600',
      'bg-violet-600',
      'bg-emerald-600',
      'bg-rose-600',
      'bg-amber-600',
    ];
    const randomBg = avatarColors[Math.floor(Math.random() * avatarColors.length)];

    const review = await Review.create({
      toolId: tool.id,
      userId: req.user.id,
      authorName: req.user.name,
      authorRole: authorRole || 'Verified Builder',
      rating: numRating,
      comment: comment.trim(),
      avatarBg: randomBg,
    });

    // Recalculate tool average rating & reviewCount
    const allToolReviews = await Review.find({ toolId: tool.id });
    const totalCount = allToolReviews.length;
    const totalRatingSum = allToolReviews.reduce((acc, curr) => acc + curr.rating, 0);
    const newAverage = parseFloat((totalRatingSum / totalCount).toFixed(1));

    tool.rating = newAverage;
    tool.reviewCount = totalCount;
    await tool.save();

    res.status(201).json({
      message: 'Review submitted successfully.',
      review,
      newRating: newAverage,
      newReviewCount: totalCount,
    });
  } catch (error: any) {
    console.error('Error submitting review:', error);
    if (error.code === 11000) {
      res.status(409).json({ error: 'You have already reviewed this tool.' });
      return;
    }
    res.status(500).json({ error: 'Failed to submit review.' });
  }
});

// DELETE /api/reviews/:id
router.delete('/:id', authenticate, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized.' });
      return;
    }

    const review = await Review.findById(req.params.id);
    if (!review) {
      res.status(404).json({ error: 'Review not found.' });
      return;
    }

    // Only review author or admin can delete
    if (review.userId !== req.user.id && req.user.role !== 'admin') {
      res.status(403).json({ error: 'Forbidden. You cannot delete this review.' });
      return;
    }

    const toolId = review.toolId;
    await Review.findByIdAndDelete(req.params.id);

    // Recalculate rating
    const remaining = await Review.find({ toolId });
    const count = remaining.length;
    const sum = remaining.reduce((acc, curr) => acc + curr.rating, 0);
    const newAverage = count > 0 ? parseFloat((sum / count).toFixed(1)) : 5.0;

    await Tool.updateOne({ id: toolId }, { rating: newAverage, reviewCount: count });

    res.json({ message: 'Review deleted successfully.' });
  } catch (error: any) {
    console.error('Error deleting review:', error);
    res.status(500).json({ error: 'Failed to delete review.' });
  }
});

export default router;
