import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

type CartUpdateRequestBody = {
  productId: number;
  quantity: number;
};

export async function POST(
  request: Request,
  { params }: { params: { userId: string } },
) {
  try {
    const userId = parseInt(params.userId, 10);
    if (isNaN(userId)) {
      return NextResponse.json(
        { success: false, message: 'Invalid user ID' },
        { status: 400 },
      );
    }

    const body: CartUpdateRequestBody = await request.json();
    const productId = parseInt(body.productId.toString(), 10);
    const quantity = parseInt(body.quantity.toString(), 10);

    if (isNaN(productId) || isNaN(quantity) || quantity < 0) {
      return NextResponse.json(
        { success: false, message: 'Invalid product ID or quantity' },
        { status: 400 },
      );
    }

    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return NextResponse.json(
        { success: false, message: 'Product not found' },
        { status: 404 },
      );
    }

    const cartItem = await prisma.cartItem.findUnique({
      where: {
        userId_productId: { userId, productId },
      },
    });

    if (cartItem) {
      await prisma.cartItem.update({
        where: { id: cartItem.id },
        data: { quantity },
      });
    } else {
      await prisma.cartItem.create({
        data: { userId, productId, quantity },
      });
    }

    const updatedCart = await prisma.cartItem.findMany({
      where: { userId },
      include: { product: true },
    });

    const totalAmount = updatedCart.reduce(
      (acc, item) => acc + item.quantity * item.product.price,
      0,
    );

    return NextResponse.json(
      {
        success: true,
        message: 'Cart updated successfully',
        data: { productId, quantity, totalAmount },
      },
      { status: 200 },
    );
  } catch (error: any) {
    console.error('Error updating cart:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 },
    );
  }
}