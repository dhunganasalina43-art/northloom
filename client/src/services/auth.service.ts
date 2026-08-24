import api from "@/lib/api";
import { IApiResponse, IUser } from "@/types";

export const registerRequest = async (payload: {
  full_name: string;
  email: string;
  password: string;
  phone?: string;
}) => {
  const res = await api.post<IApiResponse<IUser>>("/auth/register", payload);
  return res.data;
};

export const loginRequest = async (payload: { email: string; password: string }) => {
  const res = await api.post<IApiResponse<{ user: IUser; access_token: string }>>(
    "/auth/login",
    payload,
  );
  return res.data;
};

export const logoutRequest = async () => {
  const res = await api.post<IApiResponse<null>>("/auth/logout");
  return res.data;
};

export const getMeRequest = async () => {
  const res = await api.get<IApiResponse<IUser>>("/auth/me");
  return res.data;
};
