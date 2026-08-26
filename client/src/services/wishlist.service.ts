import api from "@/lib/api";
import { IApiResponse, IWishlist } from "@/types";

export const getWishlist = async () => {
  const res = await api.get<IApiResponse<IWishlist>>("/wishlist");
  return res.data;
};

export const addToWishlist = async (productId: string) => {
  const res = await api.post<IApiResponse<IWishlist>>(`/wishlist/${productId}`);
  return res.data;
};

export const removeFromWishlist = async (productId: string) => {
  const res = await api.delete<IApiResponse<IWishlist>>(`/wishlist/${productId}`);
  return res.data;
};