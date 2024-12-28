import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAuthSession } from '@/lib/authOptions';

type UpdateOrderRequestBody = {
  status: string;
};

export async function PATCH(
  request: Request,
  { params }: { params: { orderId: string } },
) {
  try {
    const session = await getAuthSession();
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 403 },
      );
    }

    const orderId = parseInt(params.orderId, 10);
    if (isNaN(orderId)) {
      return NextResponse.json(
        { success: false, message: 'Invalid order ID' },
        { status: 400 },
      );
    }

    const body: UpdateOrderRequestBody = await request.json();
    const { status } = body;

    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: { status },
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Order status updated successfully',
        data: { orderId, status },
      },
      { status: 200 },
    );
  } catch (error: any) {
    console.error('Error updating order status:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error', data: error },
      { status: 500 },
    );
  }
}