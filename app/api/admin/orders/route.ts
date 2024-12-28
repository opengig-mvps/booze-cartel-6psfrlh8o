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
    const status = url.searchParams.get('status');
    const date = url.searchParams.get('date');
    const customer = url.searchParams.get('customer');

    const orders = await prisma.order.findMany({
      where: {
        status: status || undefined,
        orderDate: date ? new Date(date) : undefined,
        user: {
          name: customer ? { contains: customer } : undefined,
        },
      },
      include: {
        user: {
          select: {
            name: true,
          },
        },
        orderItems: {
          select: {
            productId: true,
            quantity: true,
            product: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });

    const orderData = orders.map((order: any) => ({
      orderId: order.id,
      customerName: order.user.name,
      items: order.orderItems.map((item: any) => ({
        productId: item.productId,
        name: item.product.name,
        quantity: item.quantity,
      })),
      totalAmount: order.totalAmount,
      orderDate: order.orderDate.toISOString(),
      status: order.status,
    }));

    return NextResponse.json(
      {
        success: true,
        message: 'Orders fetched successfully',
        data: orderData,
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