"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { isAxiosError } from "axios";
import { LoaderCircleIcon, Search, Download } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableHead,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DateTimePicker } from "@/components/ui/date-picker";
import api from "@/lib/api";

const OrderManagement: React.FC = () => {
  const { data: session } = useSession();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedDates, setSelectedDates] = useState<{
    start: Date | undefined;
    end: Date | undefined;
  }>({ start: undefined, end: undefined });

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const res = await api.get("/api/admin/orders");
        setOrders(res.data?.data ?? []);
      } catch (error) {
        if (isAxiosError(error)) {
          toast.error(error.response?.data?.message ?? "Something went wrong");
        } else {
          console.error(error);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [session]);

  const handleExport = (format: string) => {
    // Logic to export data in CSV or PDF format
    toast.success(`Exporting orders as ${format}`);
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Order Management</h2>
      <div className="flex items-center space-x-4 mb-6">
        <Input
          type="text"
          placeholder="Search by customer or order ID"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Button variant="outline" onClick={() => {}}>
          <Search className="mr-2 h-4 w-4" />
          Search
        </Button>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="shipped">Shipped</SelectItem>
            <SelectItem value="delivered">Delivered</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
        <DateTimePicker
          date={selectedDates.start}
          setDate={(date: any) =>
            setSelectedDates({ ...selectedDates, start: date })
          }
        />
        <DateTimePicker
          date={selectedDates.end}
          setDate={(date: any) =>
            setSelectedDates({ ...selectedDates, end: date })
          }
        />
        <Button variant="outline" onClick={() => handleExport("CSV")}>
          <Download className="mr-2 h-4 w-4" />
          Export CSV
        </Button>
        <Button variant="outline" onClick={() => handleExport("PDF")}>
          <Download className="mr-2 h-4 w-4" />
          Export PDF
        </Button>
      </div>
      {loading ? (
        <LoaderCircleIcon className="animate-spin mx-auto" />
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Total Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders?.map((order) => (
              <TableRow key={order?.orderId}>
                <TableCell>{order?.orderId}</TableCell>
                <TableCell>{order?.customerName}</TableCell>
                <TableCell>{order?.status}</TableCell>
                <TableCell>{new Date(order?.orderDate).toLocaleDateString()}</TableCell>
                <TableCell>${order?.totalAmount.toFixed(2)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
};

export default OrderManagement;