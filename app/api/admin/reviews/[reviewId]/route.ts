import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAuthSession } from "@/lib/authOptions";

export async function PATCH(
  request: Request,
  { params }: { params: { reviewId: string } },
) {
  try {
    const session = await getAuthSession();

    if (!session || session.user.role !== 'admin') {
      return NextResponse.json(
        { success: false, message: 'Unauthorized access' },
        { status: 403 },
      );
    }

    const reviewId = parseInt(params.reviewId, 10);
    if (isNaN(reviewId)) {
      return NextResponse.json(
        { success: false, message: 'Invalid review ID' },
        { status: 400 },
      );
    }

    const body: any = await request.json();
    const status: string = String(body.status);

    const review = await prisma.review.findUnique({
      where: { id: reviewId },
    });

    if (!review) {
      return NextResponse.json(
        { success: false, message: 'Review not found' },
        { status: 404 },
      );
    }

    await prisma.review.update({
      where: { id: reviewId },
      data: { status },
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Review status updated successfully',
        data: { reviewId, status },
      },
      { status: 200 },
    );
  } catch (error: any) {
    console.error('Error updating review status:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error', data: error },
      { status: 500 },
    );
  }
}