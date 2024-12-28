import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAuthSession } from '@/lib/authOptions';

export async function GET(request: Request) {
  try {
    const session = await getAuthSession();

    if (!session || session.user.role !== 'admin') {
      return NextResponse.json(
        { success: false, message: 'Unauthorized access' },
        { status: 403 }
      );
    }

    const url = new URL(request.url);
    const status = url.searchParams.get('status') || undefined;
    const sortBy = url.searchParams.get('sortBy') || 'createdAt';
    const sortOrder = url.searchParams.get('sortOrder') || 'desc';
    const rating = url.searchParams.get('rating');
    const ratingInt = rating ? parseInt(rating, 10) : undefined;

    const reviews = await prisma.review.findMany({
      where: {
        ...(status && { status }),
        ...(ratingInt !== undefined && { rating: ratingInt }),
      },
      orderBy: {
        [sortBy]: sortOrder,
      },
      select: {
        id: true,
        productId: true,
        userId: true,
        rating: true,
        comment: true,
        status: true,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Reviews fetched successfully',
        data: reviews.map((review: any) => ({
          reviewId: review.id,
          productId: review.productId,
          userId: review.userId,
          rating: review.rating,
          comment: review.comment,
          status: review.status,
        })),
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: 'Internal server error', data: error },
      { status: 500 }
    );
  }
}