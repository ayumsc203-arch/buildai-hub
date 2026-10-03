import mongoose, { Schema, Document } from 'mongoose';

export interface ISubmission extends Document {
  toolName: string;
  websiteUrl: string;
  tagline: string;
  description: string;
  categoryId: string;
  pricing: 'Free' | 'Freemium' | 'Paid' | 'Free Trial';
  features: string[];
  logoUrl?: string;
  screenshots?: string[];
  technologies?: string[];
  tags?: string[];
  submittedBy?: string;
  contactEmail: string;
  status: 'pending' | 'approved' | 'rejected';
  rejectionReason?: string;
  createdAt: Date;
  updatedAt: Date;
}

const SubmissionSchema = new Schema<ISubmission>(
  {
    toolName: { type: String, required: true, trim: true },
    websiteUrl: { type: String, required: true, trim: true },
    tagline: { type: String, default: '' },
    description: { type: String, required: true },
    categoryId: { type: String, required: true },
    pricing: { type: String, enum: ['Free', 'Freemium', 'Paid', 'Free Trial'], default: 'Freemium' },
    features: [{ type: String }],
    logoUrl: { type: String, default: '' },
    screenshots: [{ type: String }],
    technologies: [{ type: String }],
    tags: [{ type: String }],
    submittedBy: { type: String, default: '' },
    contactEmail: { type: String, required: true },
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
    rejectionReason: { type: String, default: '' },
  },
  { timestamps: true }
);

export const Submission = mongoose.models.Submission || mongoose.model<ISubmission>('Submission', SubmissionSchema);
