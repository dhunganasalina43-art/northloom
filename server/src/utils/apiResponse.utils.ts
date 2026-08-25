import { Response } from "express";

type TMeta = {
  total_count: number;
  total_pages: number;
  current_page: number;
  next_page: number | null;
  prev_page: number | null;
};

type TResponsePayload<T> = {
  message: string;
  data?: T;
  statusCode: number;
  meta?: TMeta;
};

/**
 * Sends every successful response in one consistent JSON shape so the
 * frontend can rely on { success, status, message, data, meta } always
 * being present.
 */
export const sendResponse = <T>(res: Response, payload: TResponsePayload<T>) => {
  res.status(payload.statusCode).json({
    success: true,
    status: "success",
    message: payload.message,
    data: payload.data ?? null,
    ...(payload.meta ? { meta: payload.meta } : {}),
  });
};
