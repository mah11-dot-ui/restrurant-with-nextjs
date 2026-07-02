import { NextResponse } from 'next/server';
import { connectDB } from '@/services/mongodb';
import { Category } from '@/app/api/models/Category';
import { MenuItem } from '@/app/api/models/MenuItem';
import { HTTP_STATUS } from '@/constants';

export async function POST() {
  try {
    await connectDB();

    const existingCategories = await Category.countDocuments();
    if (existingCategories > 0) {
      return NextResponse.json({
        success: true,
        message: 'Database already seeded',
      });
    }

    const categories = await Category.insertMany([
      { name: 'Appetizers', slug: 'appetizers', description: 'Start your meal with these delicious bites', order: 1 },
      { name: 'Main Course', slug: 'main-course', description: 'Hearty and satisfying main dishes', order: 2 },
      { name: 'Pasta', slug: 'pasta', description: 'Authentic Italian pasta dishes', order: 3 },
      { name: 'Seafood', slug: 'seafood', description: 'Fresh catches from the ocean', order: 4 },
      { name: 'Desserts', slug: 'desserts', description: 'Sweet endings to your meal', order: 5 },
      { name: 'Beverages', slug: 'beverages', description: 'Refreshing drinks and more', order: 6 },
    ]);

    const [appetizers, mainCourse, pasta] = categories;

    await MenuItem.insertMany([
      {
        name: 'Bruschetta',
        slug: 'bruschetta',
        description: 'Toasted bread topped with fresh tomatoes, basil, and mozzarella',
        price: 9.99,
        images: ['https://images.unsplash.com/photo-1572695157366-5e585ab2b69f?w=600'],
        category: appetizers._id,
        tags: ['vegetarian', 'italian'],
        preparationTime: 10,
        ingredients: ['Bread', 'Tomatoes', 'Basil', 'Mozzarella', 'Olive Oil'],
        rating: 4.5,
        totalReviews: 42,
      },
      {
        name: 'Calamari',
        slug: 'calamari',
        description: 'Crispy fried squid served with marinara sauce',
        price: 11.99,
        images: ['https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=600'],
        category: appetizers._id,
        tags: ['seafood', 'fried'],
        preparationTime: 15,
        ingredients: ['Squid', 'Flour', 'Lemon', 'Marinara Sauce'],
        rating: 4.3,
        totalReviews: 28,
      },
      {
        name: 'Grilled Salmon',
        slug: 'grilled-salmon',
        description: 'Atlantic salmon fillet with lemon butter sauce and seasonal vegetables',
        price: 24.99,
        discountPrice: 22.99,
        images: ['https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=600'],
        category: mainCourse._id,
        tags: ['seafood', 'healthy', 'popular'],
        preparationTime: 25,
        ingredients: ['Salmon', 'Lemon', 'Butter', 'Garlic', 'Asparagus'],
        rating: 4.8,
        totalReviews: 156,
        isFeatured: true,
      },
      {
        name: 'Beef Steak',
        slug: 'beef-steak',
        description: 'Prime cut ribeye with truffle mashed potatoes and red wine reduction',
        price: 32.99,
        images: ['https://images.unsplash.com/photo-1600891964092-4316c288032e?w=600'],
        category: mainCourse._id,
        tags: ['premium', 'popular'],
        preparationTime: 30,
        ingredients: ['Ribeye Steak', 'Truffle Oil', 'Potatoes', 'Red Wine', 'Rosemary'],
        rating: 4.9,
        totalReviews: 203,
        isFeatured: true,
      },
      {
        name: 'Chicken Alfredo',
        slug: 'chicken-alfredo',
        description: 'Fettuccine pasta with creamy alfredo sauce and grilled chicken',
        price: 16.99,
        images: ['https://images.unsplash.com/photo-1645112411341-6c4fd023714a?w=600'],
        category: pasta._id,
        tags: ['italian', 'popular'],
        preparationTime: 20,
        ingredients: ['Fettuccine', 'Chicken', 'Cream', 'Parmesan', 'Garlic'],
        rating: 4.6,
        totalReviews: 89,
        isFeatured: true,
      },
      {
        name: 'Pasta Carbonara',
        slug: 'pasta-carbonara',
        description: 'Classic Italian carbonara with pancetta, egg, and parmesan',
        price: 18.99,
        images: ['https://images.unsplash.com/photo-1612874742237-6526221588e3?w=600'],
        category: pasta._id,
        tags: ['italian', 'classic'],
        preparationTime: 20,
        ingredients: ['Spaghetti', 'Pancetta', 'Eggs', 'Parmesan', 'Black Pepper'],
        rating: 4.7,
        totalReviews: 134,
      },
    ]);

    return NextResponse.json({
      success: true,
      message: 'Database seeded successfully',
    });
  } catch {
    return NextResponse.json(
      { success: false, error: 'Failed to seed database' },
      { status: HTTP_STATUS.INTERNAL_SERVER_ERROR }
    );
  }
}
