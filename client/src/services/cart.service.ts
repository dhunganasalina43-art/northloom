import api from "@/lib/api";
import { IApiResponse, ICart } from "@/types";

export const getCart = async () => {
  const res = await api.get<IApiResponse<ICart>>("/cart");
  return res.data;
};

export const addCartItem = async (product_id: string, quantity = 1) => {
  const res = await api.post<IApiResponse<ICart>>("/cart/items", { product_id, quantity });
  return res.data;
};

export const updateCartItem = async (itemId: string, quantity: number) => {
  const res = await api.patch<IApiResponse<ICart>>(`/cart/items/${itemId}`, { quantity });
  return res.data;
};

export const removeCartItem = async (itemId: string) => {
  const res = await api.delete<IApiResponse<ICart>>(`/cart/items/${itemId}`);
  return res.data;
};
