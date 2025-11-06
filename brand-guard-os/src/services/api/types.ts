/**
 * API Request/Response Types
 *
 * This file defines the common types used across all API services.
 * TODO: Expand these types as real API integration requirements become clear.
 */

export interface ApiResponse<T> {
  data: T;
  status: number;
  message?: string;
}

export interface ApiError {
  message: string;
  code: string;
  status: number;
  details?: Record<string, unknown>;
}

export interface PaginationParams {
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    currentPage: number;
    pageSize: number;
    totalPages: number;
    totalItems: number;
  };
}

export interface FilterParams {
  [key: string]: string | number | boolean | undefined;
}
