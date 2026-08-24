import api from "@/lib/api";
import { IApiResponse, IProduct } from "@/types";

export type ProductQuery = {
  q?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: "price_asc" | "price_desc" | "newest" | "rating";
  page?: number;
  limit?: number;
};

export const getProducts = async (query: ProductQuery = {}) => {
  const res = await api.get<IApiResponse<IProduct[]>>("/products", { params: query });
  return res.data;
};

export const getFeaturedProducts = async () => {
  const res = await api.get<IApiResponse<IProduct[]>>("/products/featured");
  return res.data;
};

export const getProductById = async (id: string) => {
  const res = await api.get<IApiResponse<IProduct>>(`/products/${id}`);
  return res.data;
};

export const createProduct = async (formData: FormData) => {
  const res = await api.post<IApiResponse<IProduct>>("/products", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

export const updateProduct = async (id: string, formData: FormData) => {
  const res = await api.put<IApiResponse<IProduct>>(`/products/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

export const deleteProduct = async (id: string) => {
  const res = await api.delete<IApiResponse<null>>(`/products/${id}`);
  return res.data;
};
