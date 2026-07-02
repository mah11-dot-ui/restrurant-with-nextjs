import { BaseEntity } from './index';

export interface ICategory extends BaseEntity {
  name: string;
  slug: string;
  description?: string;
  image?: string;
  isActive: boolean;
  order: number;
}

export interface IMenuItem extends BaseEntity {
  name: string;
  slug: string;
  description: string;
  price: number;
  discountPrice?: number;
  images: string[];
  category: ICategory | string;
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
}

export interface IReview extends BaseEntity {
  user: string;
  menuItem: string;
  rating: number;
  comment: string;
}

export interface CartItem {
  menuItem: IMenuItem;
  quantity: number;
  notes?: string;
}
