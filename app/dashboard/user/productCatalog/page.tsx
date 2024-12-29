"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "sonner";
import { isAxiosError } from "axios";
import { useSession } from "next-auth/react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

const ProductCatalog: React.FC = () => {
  const { data: session } = useSession();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [category, setCategory] = useState<string>("");
  const [priceRange, setPriceRange] = useState<string>("");
  const [rating, setRating] = useState<string>("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await axios.get("/api/products", {
          params: {
            page: currentPage,
            category,
            price: priceRange,
            rating,
          },
        });
        if (response.data.success) {
          setProducts(response.data.data);
          setTotalPages(Math.ceil(response.data.data.length / 10)); // Assuming 10 products per page
        }
      } catch (error: any) {
        if (isAxiosError(error)) {
          toast.error(error.response?.data.message ?? "Something went wrong");
        } else {
          console.error(error);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [currentPage, category, priceRange, rating]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Product Catalog</h1>
      <div className="flex gap-4 mb-6">
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All</SelectItem>
            <SelectItem value="whiskey">Whiskey</SelectItem>
            <SelectItem value="vodka">Vodka</SelectItem>
            <SelectItem value="rum">Rum</SelectItem>
          </SelectContent>
        </Select>

        <Select value={priceRange} onValueChange={setPriceRange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by Price" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All</SelectItem>
            <SelectItem value="0-50">$0 - $50</SelectItem>
            <SelectItem value="50-100">$50 - $100</SelectItem>
            <SelectItem value="100-200">$100 - $200</SelectItem>
          </SelectContent>
        </Select>

        <Select value={rating} onValueChange={setRating}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by Rating" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All</SelectItem>
            <SelectItem value="4">4 Stars & Up</SelectItem>
            <SelectItem value="3">3 Stars & Up</SelectItem>
            <SelectItem value="2">2 Stars & Up</SelectItem>
          </SelectContent>
        </Select>

        <Input
          type="text"
          placeholder="Search..."
          className="flex-1"
          onChange={(e: any) => console.log(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="flex justify-center items-center">
          Loading...
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {products?.map((product) => (
            <Card key={product?.id}>
              <CardHeader>
                <CardTitle>{product?.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <img
                  src={product?.imageUrl}
                  alt={product?.name}
                  className="w-full h-48 object-cover rounded-t-lg"
                  loading="lazy"
                />
                <p className="text-2xl font-bold">${product?.price.toFixed(2)}</p>
                <p className="text-sm text-muted-foreground mt-2">
                  {product?.description}
                </p>
              </CardContent>
              <CardFooter>
                <Button className="w-full">Add to Cart</Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href="#"
              onClick={() => handlePageChange(currentPage - 1)}
            />
          </PaginationItem>
          {[...Array(totalPages)].map((_, index) => (
            <PaginationItem key={index}>
              <PaginationLink
                href="#"
                onClick={() => handlePageChange(index + 1)}
              >
                {index + 1}
              </PaginationLink>
            </PaginationItem>
          ))}
          <PaginationItem>
            <PaginationNext
              href="#"
              onClick={() => handlePageChange(currentPage + 1)}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
};

export default ProductCatalog;
