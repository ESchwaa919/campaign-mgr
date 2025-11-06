/**
 * API Client
 *
 * Base HTTP client for all API requests.
 * Currently returns mock data, but structured to easily integrate real APIs.
 *
 * TODO: When integrating real APIs:
 * 1. Add environment variables for API endpoints (VITE_SALESFORCE_API, VITE_CLARAVINE_API)
 * 2. Implement authentication (OAuth 2.0 for Salesforce, API keys for Claravine)
 * 3. Add request/response interceptors for auth tokens
 * 4. Implement retry logic with exponential backoff
 * 5. Add request timeout handling
 */

import { ApiResponse, ApiError } from './types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

// Simulated network delay for realistic UX
const MOCK_DELAY = 300;

class ApiClient {
  private async simulateNetworkDelay(): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, MOCK_DELAY));
  }

  async get<T>(endpoint: string, params?: Record<string, unknown>): Promise<ApiResponse<T>> {
    await this.simulateNetworkDelay();

    // TODO: Replace with real fetch call
    // const queryString = params ? '?' + new URLSearchParams(params as any).toString() : '';
    // const response = await fetch(`${API_BASE_URL}${endpoint}${queryString}`, {
    //   method: 'GET',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     'Authorization': `Bearer ${this.getAuthToken()}`,
    //   },
    // });
    // return response.json();

    throw new Error(`Mock API: GET ${endpoint} not implemented. Service should handle this.`);
  }

  async post<T>(endpoint: string, data: unknown): Promise<ApiResponse<T>> {
    await this.simulateNetworkDelay();

    // TODO: Replace with real fetch call
    // const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     'Authorization': `Bearer ${this.getAuthToken()}`,
    //   },
    //   body: JSON.stringify(data),
    // });
    // return response.json();

    console.log('Mock API POST:', endpoint, data);
    throw new Error(`Mock API: POST ${endpoint} not implemented. Service should handle this.`);
  }

  async put<T>(endpoint: string, data: unknown): Promise<ApiResponse<T>> {
    await this.simulateNetworkDelay();

    // TODO: Replace with real fetch call
    console.log('Mock API PUT:', endpoint, data);
    throw new Error(`Mock API: PUT ${endpoint} not implemented. Service should handle this.`);
  }

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    await this.simulateNetworkDelay();

    // TODO: Replace with real fetch call
    console.log('Mock API DELETE:', endpoint);
    throw new Error(`Mock API: DELETE ${endpoint} not implemented. Service should handle this.`);
  }

  // TODO: Implement authentication
  private getAuthToken(): string {
    // return localStorage.getItem('auth_token') || '';
    return '';
  }

  // TODO: Implement error handling
  handleError(error: unknown): ApiError {
    if (error instanceof Error) {
      return {
        message: error.message,
        code: 'UNKNOWN_ERROR',
        status: 500,
      };
    }
    return {
      message: 'An unknown error occurred',
      code: 'UNKNOWN_ERROR',
      status: 500,
    };
  }
}

export const apiClient = new ApiClient();
