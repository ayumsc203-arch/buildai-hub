import mongoose, { Schema, Document } from 'mongoose';

export interface ITool extends Document {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  creator?: string;
  creatorBio?: string;
  description: string;
  categoryId: string;
  categoryName: string;
  pricing: 'Free' | 'Freemium' | 'Paid' | 'Free Trial';
  pricingStartingAt?: string;
  rating: number;
  reviewCount: number;
  websiteUrl: string;
  featured: boolean;
  trending: boolean;
  launchYear: number;
  status: 'pending' | 'approved' | 'rejected';
  tags: string[];
  features: string[];
  featureTags: string[];
  platforms: string[];
  technologies: string[];
  screenshots: { url: string; caption: string }[];
  pros: string[];
  cons: string[];
  targetAudience: string[];
  logoGradient: string;
  exportOptions?: string[];
  comparisonSpecs: {
    priceStartingAt: string;
    freePlanAvailable: boolean;
    hasAiGeneration: boolean;
    hasDatabase: boolean;
    hasAuth: boolean;
    hasCodeExport: boolean;
    hasApi: boolean;
    hostingIncluded: boolean;
    bestFor: string;
  };
  viewsCount: number;
  clicksCount: number;
  favoritesCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const ToolSchema = new Schema<ITool>(
  {
    id: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, index: true, lowercase: true, trim: true },
    tagline: { type: String, required: true },
    creator: { type: String, default: '' },
    creatorBio: { type: String, default: '' },
    description: { type: String, required: true },
    categoryId: { type: String, required: true, index: true },
    categoryName: { type: String, required: true },
    pricing: { type: String, enum: ['Free', 'Freemium', 'Paid', 'Free Trial'], default: 'Freemium' },
    pricingStartingAt: { type: String, default: '' },
    rating: { type: Number, default: 5.0, min: 0, max: 5 },
    reviewCount: { type: Number, default: 0 },
    websiteUrl: { type: String, required: true },
    featured: { type: Boolean, default: false },
    trending: { type: Boolean, default: false },
    launchYear: { type: Number, default: new Date().getFullYear() },
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'approved' },
    tags: [{ type: String }],
    features: [{ type: String }],
    featureTags: [{ type: String }],
    platforms: [{ type: String }],
    technologies: [{ type: String }],
    screenshots: [
      {
        url: { type: String },
        caption: { type: String },
      },
    ],
    pros: [{ type: String }],
    cons: [{ type: String }],
    targetAudience: [{ type: String }],
    logoGradient: { type: String, default: 'from-indigo-500 via-purple-500 to-cyan-500' },
    exportOptions: [{ type: String }],
    comparisonSpecs: {
      priceStartingAt: { type: String, default: '$0' },
      freePlanAvailable: { type: Boolean, default: true },
      hasAiGeneration: { type: Boolean, default: true },
      hasDatabase: { type: Boolean, default: false },
      hasAuth: { type: Boolean, default: false },
      hasCodeExport: { type: Boolean, default: true },
      hasApi: { type: Boolean, default: true },
      hostingIncluded: { type: Boolean, default: true },
      bestFor: { type: String, default: 'Developers & Founders' },
    },
    viewsCount: { type: Number, default: 0 },
    clicksCount: { type: Number, default: 0 },
    favoritesCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// Indexes for high-performance search queries
ToolSchema.index({ name: 'text', description: 'text', tagline: 'text', tags: 'text' });

export const Tool = mongoose.models.Tool || mongoose.model<ITool>('Tool', ToolSchema);
