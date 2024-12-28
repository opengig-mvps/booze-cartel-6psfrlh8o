import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { razorpayCheckout } from '@/modules/razorpay';
import { sendEmail } from '@/lib/email-service';

type PaymentRequestBody = {
  orderId: string;
  paymentId: string;
  signature: string;
};

export async function POST(request: Request) {
  try {
    const body: PaymentRequestBody = await request.json();
    const { orderId, paymentId, signature } = body;

    const isValid = razorpayCheckout.verifyPayment({
      orderId,
      paymentId,
      signature,
    });

    if (!isValid) {
      return NextResponse.json(
        { success: false, message: 'Invalid payment verification' },
        { status: 400 },
      );
    }

    const orderIdInt = parseInt(orderId, 10);

    const order = await prisma.order.update({
      where: { id: orderIdInt },
      data: { status: 'confirmed' },
      include: { user: true },
    });

    if (order.user) {
      await sendEmail({
        to: order.user.email,
        template: {
          subject: 'Order Confirmation',
          html: `<h1>Your order ${orderId} has been confirmed!</h1>`,
          text: `Your order ${orderId} has been confirmed!`,
        },
      });
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Payment verified successfully',
        data: { orderId, paymentId },
      },
      { status: 200 },
    );
  } catch (error: any) {
    console.error('Error verifying payment:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 },
    );
  }
}