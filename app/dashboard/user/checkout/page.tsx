"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { isAxiosError } from "axios";
import api from "@/lib/api";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LoaderCircleIcon } from "lucide-react";

// Import Razorpay from the correct package
import Razorpay from "razorpay"; 

const CheckoutPage = () => {
  const { data: session } = useSession();
  const [cart, setCart] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!session) return;
    const fetchCart = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/api/users/${session?.user.id}/cart`);
        setCart(res.data.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchCart();
  }, [session]);

  const handlePayment = async () => {
    if (!cart) return;
    try {
      setLoading(true);
      const orderPayload = {
        amount: cart?.totalPrice,
        receipt: `receipt_${new Date().getTime()}`,
        notes: { userId: session?.user.id },
      };
      const orderRes = await api.post("/api/payments/razorpay/create-order", orderPayload);
      const { orderId, amount, currency } = orderRes.data.data;

      const options: any = {
        key: "YOUR_RAZORPAY_KEY", // Replace with your Razorpay key
        amount: amount.toString(),
        currency: currency,
        name: "Your Company Name",
        description: "Order Payment",
        order_id: orderId,
        handler: async function (response: any) {
          try {
            const verifyPayload = {
              orderId: response.razorpay_order_id,
              paymentId: response.razorpay_payment_id,
              signature: response.razorpay_signature,
            };
            const verifyRes = await api.post("/api/payments/razorpay/verify", verifyPayload);
            if (verifyRes.data.success) {
              toast.success("Payment successful! Order confirmed.");
            }
          } catch (error) {
            toast.error("Payment verification failed.");
          }
        },
        prefill: {
          name: session?.user.name,
          email: session?.user.email,
        },
        theme: {
          color: "#3399cc",
        },
      };

      const rzp1 = new Razorpay(options);
      rzp1.open();
    } catch (error) {
      if (isAxiosError(error)) {
        toast.error(error.response?.data.message ?? "Something went wrong");
      } else {
        console.error(error);
        toast.error("An unexpected error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  if (!cart) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>
      <Card>
        <CardHeader>
          <CardTitle>Order Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {cart?.items?.map((item: any) => (
            <div key={item?.productId} className="flex items-center py-4 gap-4">
              <div className="flex-1">
                <h3 className="font-semibold">{item?.name}</h3>
                <p className="text-sm text-gray-500">${item?.price.toFixed(2)}</p>
                <p className="text-sm text-gray-500">Quantity: {item?.quantity}</p>
              </div>
              <div className="text-right">
                <p className="font-semibold">${(item?.price * item?.quantity).toFixed(2)}</p>
              </div>
            </div>
          ))}
          <div className="flex justify-between font-semibold">
            <span>Total</span>
            <span>${cart?.totalPrice?.toFixed(2)}</span>
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full" onClick={handlePayment} disabled={loading}>
            {loading ? (
              <>
                <LoaderCircleIcon className="w-4 h-4 mr-2 animate-spin" />
                Processing Payment...
              </>
            ) : (
              "Pay Now"
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default CheckoutPage;