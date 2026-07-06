export interface ApiResponseMeta {
  page?: number;
  limit?: number;
  total?: number;
  totalPages?: number;
}

export interface SuccessResponse<T = unknown> {
  success: true;
  message: string;
  data: T;
  meta?: ApiResponseMeta;
}

export interface ErrorResponse {
  success: false;
  message: string;
  error: {
    code: string;
    details?: unknown;
  };
}

export const successResponse = <T>(
  data: T,
  message = "Operation completed successfully",
  meta?: ApiResponseMeta
): SuccessResponse<T> => ({
  success: true,
  message,
  data,
  ...(meta ? { meta } : {}),
});

export const errorResponse = (
  message: string,
  code = "INTERNAL_ERROR",
  details?: unknown
): ErrorResponse => ({
  success: false,
  message,
  error: { code, details },
});
