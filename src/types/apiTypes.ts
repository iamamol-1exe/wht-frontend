export interface ApiErrorResponse {
  message?: string;
  error?: string;
}

export interface ApiError {
  response?: {
    data?: ApiErrorResponse;
  };
  message?: string;
}
