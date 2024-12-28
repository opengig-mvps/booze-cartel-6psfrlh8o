import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function DELETE(
  request: Request,
  { params }: { params: { userId: string; productId: string } },
) {
  try {
    const userId = parseInt(params.userId, 10);
    const productId = parseInt(params.productId, 10);

    if (isNaN(userId) || isNaN(productId)) {
      return NextResponse.json(
        { success: false, message: 'Invalid user ID or product ID' },
        { status: 400 },
      );
    }

    const cartItem = await prisma.cartItem.findFirst({
      where: { userId, productId },
    });

    if (!cartItem) {
      return NextResponse.json(
        { success: false, message: 'Product not found in cart' },
        { status: 404 },
      );
    }

    await prisma.cartItem.delete({
      where: { id: cartItem.id },
    });

    const updatedCartItems = await prisma.cartItem.findMany({
      where: { userId },
      include: { product: true },
    });

    const updatedTotal = updatedCartItems.reduce((total: number, item: any) => {
      return total + item.quantity * item.product.price;
    }, 0);

    return NextResponse.json(
      {
        success: true,
        message: 'Product removed from cart successfully',
        data: { productId },
      },
      { status: 200 },
    );
  } catch (error: any) {
    console.error('Error removing product from cart:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error', data: error },
      { status: 500 },
    );
  }
}