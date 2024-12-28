"use client";

import React, { useEffect, useState } from "react";
import api from "@/lib/api";
import { toast } from "sonner";
import { isAxiosError } from "axios";
import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { LoaderCircle, Check, X, Trash } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Review = {
  reviewId: number;
  productId: number;
  userId: number;
  rating: number;
  comment: string;
  status: string;
};

const ReviewManagement: React.FC = () => {
  const { data: session } = useSession();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedReviewId, setSelectedReviewId] = useState<number | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const searchParams = useSearchParams();

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const res = await api.get("/api/admin/reviews");
      setReviews(res.data.data);
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

  const updateReviewStatus = async (reviewId: number, status: string) => {
    try {
      const res = await api.patch(`/api/admin/reviews/${reviewId}`, { status });
      if (res.data.success) {
        toast.success(res.data.message);
        fetchReviews();
      }
    } catch (error) {
      if (isAxiosError(error)) {
        toast.error(error.response?.data.message ?? "Something went wrong");
      } else {
        console.error(error);
      }
    }
  };

  const deleteReview = async (reviewId: number) => {
    try {
      const res = await api.delete(`/api/admin/reviews/${reviewId}`);
      if (res.data.success) {
        toast.success(res.data.message);
        fetchReviews();
      }
    } catch (error) {
      if (isAxiosError(error)) {
        toast.error(error.response?.data.message ?? "Something went wrong");
      } else {
        console.error(error);
      }
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const filteredReviews = reviews?.filter((review) => {
    if (filterStatus === "all") return true;
    return review.status === filterStatus;
  });

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-6">Review Management</h2>
      <div className="flex justify-between items-center mb-4">
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
      </div>
      {loading ? (
        <LoaderCircle className="animate-spin mx-auto" />
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Product ID</TableHead>
              <TableHead>User ID</TableHead>
              <TableHead>Rating</TableHead>
              <TableHead>Comment</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredReviews?.map((review) => (
              <TableRow key={review.reviewId}>
                <TableCell>{review.reviewId}</TableCell>
                <TableCell>{review.productId}</TableCell>
                <TableCell>{review.userId}</TableCell>
                <TableCell>{review.rating}</TableCell>
                <TableCell>{review.comment}</TableCell>
                <TableCell>{review.status}</TableCell>
                <TableCell>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() =>
                      updateReviewStatus(review.reviewId, "approved")
                    }
                  >
                    <Check className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() =>
                      updateReviewStatus(review.reviewId, "rejected")
                    }
                  >
                    <X className="h-4 w-4" />
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setSelectedReviewId(review.reviewId)}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          Are you sure you want to delete this review?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => {
                            if (selectedReviewId !== null) {
                              deleteReview(selectedReviewId);
                              setSelectedReviewId(null);
                            }
                          }}
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
};

export default ReviewManagement;