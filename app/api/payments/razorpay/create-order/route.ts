import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { razorpayCheckout } from '@/modules/razorpay';

type CreateOrderRequestBody = {
  amount: number;
  receipt: string;
  notes: Record<string, string>;
};

export async function POST(request: Request) {
  try {
    const body: CreateOrderRequestBody = await request.json();
    const { amount, receipt, notes } = body;

    if (!amount || !receipt) {
      return NextResponse.json(
        { success: false, message: 'Amount and receipt are required' },
        { status: 400 }
      );
    }

    const order = await razorpayCheckout.createOrder({
      amount,
      receipt,
      notes,
    });

    const newOrder = await prisma.order.create({
      data: {
        totalAmount: amount,
        status: 'CREATED',
        userId: 1,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Order created successfully',
        data: {
          orderId: order.id,
          amount: order.amount,
          currency: order.currency,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}