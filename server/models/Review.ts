import mongoose, { Schema, Document } from 'mongoose';

export interface IReview extends Document {
  toolId: string;
  userId: string;
  authorName: string;
  authorRole: string;
  rating: number;
  comment: string;
  avatarBg: string;
  createdAt: Date;
  updatedAt: Date;
}

const ReviewSchema = new Schema<IReview>(
  {
    toolId: { type: String, required: true, index: true },
    userId: { type: String, required: true, index: true },
    authorName: { type: String, required: true },
    authorRole: { type: String, default: 'Builder' },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true },
    avatarBg: { type: String, default: 'bg-indigo-600' },
  },
  { timestamps: true }
);

// Prevent duplicate reviews from the same user for the same tool
ReviewSchema.index({ toolId: 1, userId: 1 }, { unique: true });

export const Review = mongoose.models.Review || mongoose.model<IReview>('Review', ReviewSchema);
