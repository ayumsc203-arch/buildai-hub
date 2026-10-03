import mongoose, { Schema, Document } from 'mongoose';

export interface IAnalyticsEvent extends Document {
  type: 'tool_view' | 'website_click' | 'search' | 'favorite' | 'category_view';
  targetId?: string;
  targetName?: string;
  query?: string;
  userId?: string;
  metadata?: Record<string, any>;
  createdAt: Date;
}

const AnalyticsEventSchema = new Schema<IAnalyticsEvent>(
  {
    type: {
      type: String,
      enum: ['tool_view', 'website_click', 'search', 'favorite', 'category_view'],
      required: true,
      index: true,
    },
    targetId: { type: String, default: '', index: true },
    targetName: { type: String, default: '' },
    query: { type: String, default: '', index: true },
    userId: { type: String, default: '' },
    metadata: { type: Schema.Types.Mixed, default: {} },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export const AnalyticsEvent =
  mongoose.models.AnalyticsEvent ||
  mongoose.model<IAnalyticsEvent>('AnalyticsEvent', AnalyticsEventSchema);
