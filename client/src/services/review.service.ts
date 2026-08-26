import api from "@/lib/api";
import { IApiResponse, IReview } from "@/types";

export const getProductReviews = async (productId: string) => {
  const res = await api.get<IApiResponse<IReview[]>>(`/reviews/product/${productId}`);
  return res.data;
};

export const createReview = async (productId: string, rating: number, comment: string) => {
  const res = await api.post<IApiResponse<IReview>>(`/reviews/product/${productId}`, {
    rating,
    comment,
  });
  return res.data;
};

export const deleteReview = async (id: string) => {
  const res = await api.delete<IApiResponse<null>>(`/reviews/${id}`);
  return res.data;
};
