import mongoose, { Schema, Document } from 'mongoose';

export interface MenuItemDocument extends Document {
  name: string;
  slug: string;
  description: string;
  price: number;
  discountPrice?: number;
  images: string[];
  category: mongoose.Types.ObjectId;
  tags: string[];
  isAvailable: boolean;
  isFeatured: boolean;
  preparationTime: number;
  ingredients: string[];
  nutritionalInfo?: {
    calories?: number;
    protein?: number;
    carbs?: number;
    fat?: number;
  };
  rating: number;
  totalReviews: number;
  createdAt: Date;
  updatedAt: Date;
}

const MenuItemSchema = new Schema<MenuItemDocument>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    description: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    discountPrice: { type: Number, min: 0 },
    images: [{ type: String }],
    category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
    tags: [{ type: String }],
    isAvailable: { type: Boolean, default: true },
    isFeatured: { type: Boolean, default: false },
    preparationTime: { type: Number, default: 15 },
    ingredients: [{ type: String }],
    nutritionalInfo: {
      calories: { type: Number },
      protein: { type: Number },
      carbs: { type: Number },
      fat: { type: Number },
    },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    totalReviews: { type: Number, default: 0 },
  },
  { timestamps: true }
);

MenuItemSchema.index({ slug: 1 });
MenuItemSchema.index({ category: 1 });
MenuItemSchema.index({ isAvailable: 1, isFeatured: 1 });
MenuItemSchema.index({ tags: 1 });
MenuItemSchema.index({ name: 'text', description: 'text' });

export const MenuItem =
  mongoose.models.MenuItem || mongoose.model<MenuItemDocument>('MenuItem', MenuItemSchema);
