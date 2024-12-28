import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '1', 10);
    const limit = parseInt(url.searchParams.get('limit') || '10', 10);
    const category = url.searchParams.get('category');
    const price = url.searchParams.get('price');
    const rating = url.searchParams.get('rating');

    const filters: any = {};

    if (category) {
      filters.category = category;
    }

    if (price) {
      filters.price = parseFloat(price);
    }

    if (rating) {
      filters.reviews = {
        some: {
          rating: parseInt(rating, 10),
        },
      };
    }

    const products = await prisma.product.findMany({
      where: filters,
      skip: (page - 1) * limit,
      take: limit,
      select: {
        id: true,
        name: true,
        description: true,
        price: true,
        imageUrl: true,
        ingredients: true,
        origin: true,
        tastingNotes: true,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Products fetched successfully',
        data: products,
      },
      { status: 200 },
    );
  } catch (error: any) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 },
    );
  }
}