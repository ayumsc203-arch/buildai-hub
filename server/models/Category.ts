import mongoose, { Schema, Document } from 'mongoose';

export interface ICategory extends Document {
  id: string;
  name: string;
  slug: string;
  description: string;
  toolCount: number;
  iconName: string;
  accentGradient: string;
}

const CategorySchema = new Schema<ICategory>(
  {
    id: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true, index: true, lowercase: true },
    description: { type: String, required: true },
    toolCount: { type: Number, default: 0 },
    iconName: { type: String, default: 'Layers' },
    accentGradient: { type: String, default: 'from-indigo-500 to-cyan-500' },
  },
  { timestamps: true }
);

export const Category = mongoose.models.Category || mongoose.model<ICategory>('Category', CategorySchema);
