/**
 * Custom error class thrown anywhere in the app to signal an expected,
 * "operational" failure (bad input, not found, unauthorized, etc).
 * Caught by the global error handler middleware and turned into a
 * consistent JSON error response.
 */
class ApiError extends Error {
  statusCode: number;
  status: "fail" | "error";
  success: false;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.status = statusCode >= 400 && statusCode < 500 ? "fail" : "error";
    this.success = false;
    Error.captureStackTrace(this, ApiError);
  }
}

export default ApiError;
