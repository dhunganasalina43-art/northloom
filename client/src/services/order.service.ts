import api from "@/lib/api";
import { IApiResponse, IOrder } from "@/types";

export const createOrder = async (payload: {
  shipping_address: {
    full_name: string;
    line1: string;
    city: string;
    state: string;
    postal_code: string;
    country: string;
    phone: string;
  };
  payment_method: "cod" | "card";
}) => {
  const res = await api.post<IApiResponse<IOrder>>("/orders", payload);
  return res.data;
};

export const getOrders = async (params: { page?: number; status?: string } = {}) => {
  const res = await api.get<IApiResponse<IOrder[]>>("/orders", { params });
  return res.data;
};

export const getOrderById = async (id: string) => {
  const res = await api.get<IApiResponse<IOrder>>(`/orders/${id}`);
  return res.data;
};

export const updateOrderStatus = async (id: string, status: string) => {
  const res = await api.patch<IApiResponse<IOrder>>(`/orders/${id}/status`, { status });
  return res.data;
};
