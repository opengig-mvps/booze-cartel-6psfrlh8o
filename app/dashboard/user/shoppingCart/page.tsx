"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { isAxiosError } from "axios";
import { toast } from "sonner";
import api from "@/lib/api";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Trash2, LoaderCircleIcon } from "lucide-react";

const ShoppingCartPage = () => {
  const { data: session } = useSession();
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!session) return;

    const fetchCartItems = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/api/users/${session?.user.id}/cart`);
        if (response.data.success) {
          setCartItems(response.data.data.items);
          setTotalPrice(response.data.data.totalPrice);
        }
      } catch (error) {
        if (isAxiosError(error)) {
          toast.error(error.response?.data.message ?? "Something went wrong");
        } else {
          console.error(error);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCartItems();
  }, [session]);

  const updateQuantity = async (productId: number, quantity: number) => {
    try {
      const response = await api.patch(`/api/users/${session?.user.id}/cart`, {
        productId,
        quantity,
      });
      if (response.data.success) {
        toast.success("Cart updated successfully");
        setCartItems((prevItems) =>
          prevItems.map((item) =>
            item.productId === productId
              ? { ...item, quantity: response.data.data.quantity }
              : item
          )
        );
        setTotalPrice((prevTotal) => prevTotal + response.data.data.quantity);
      }
    } catch (error) {
      if (isAxiosError(error)) {
        toast.error(error.response?.data.message ?? "Something went wrong");
      } else {
        console.error(error);
      }
    }
  };

  const removeItem = async (productId: number) => {
    try {
      const response = await api.delete(
        `/api/users/${session?.user.id}/cart/${productId}`
      );
      if (response.data.success) {
        toast.success("Product removed from cart successfully");
        setCartItems((prevItems) =>
          prevItems.filter((item) => item.productId !== productId)
        );
        setTotalPrice((prevTotal) => prevTotal - response.data.data.quantity);
      }
    } catch (error) {
      if (isAxiosError(error)) {
        toast.error(error.response?.data.message ?? "Something went wrong");
      } else {
        console.error(error);
      }
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Cart Items</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {cartItems?.map((item) => (
                    <TableRow key={item?.productId}>
                      <TableCell>
                        <img
                          src={item?.imageUrl}
                          alt={item?.name}
                          className="w-16 h-16 object-cover rounded"
                        />
                        <p>{item?.name}</p>
                      </TableCell>
                      <TableCell>${item?.price.toFixed(2)}</TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          min="1"
                          value={item?.quantity}
                          onChange={(e: any) =>
                            updateQuantity(item?.productId, e.target.value)
                          }
                        />
                      </TableCell>
                      <TableCell>
                        ${(item?.price * item?.quantity).toFixed(2)}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeItem(item?.productId)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span>Total</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full" size="lg" disabled={loading}>
                {loading ? (
                  <LoaderCircleIcon className="animate-spin" />
                ) : (
                  "Checkout"
                )}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ShoppingCartPage;