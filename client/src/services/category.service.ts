import api from "@/lib/api";
import { IApiResponse, ICategory } from "@/types";

export const getCategories = async () => {
  const res = await api.get<IApiResponse<ICategory[]>>("/categories");
  return res.data;
};

export const createCategory = async (formData: FormData) => {
  const res = await api.post<IApiResponse<ICategory>>("/categories", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

export const updateCategory = async (id: string, formData: FormData) => {
  const res = await api.put<IApiResponse<ICategory>>(`/categories/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

export const deleteCategory = async (id: string) => {
  const res = await api.delete<IApiResponse<null>>(`/categories/${id}`);
  return res.data;
};
