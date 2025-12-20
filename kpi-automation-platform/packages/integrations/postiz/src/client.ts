import axios, { AxiosInstance, AxiosError, AxiosRequestConfig } from 'axios';
import { PostizConfig, PostizError, ApiResponse } from './types';

/**
 * Postiz HTTP Client
 */
export class PostizClient {
  private client: AxiosInstance;
  private config: Required<PostizConfig>;

  constructor(config: PostizConfig) {
    this.config = {
      apiKey: config.apiKey,
      baseUrl: config.baseUrl || 'https://api.postiz.com/v1',
      timeout: config.timeout || 30000,
      retryAttempts: config.retryAttempts || 3,
      retryDelay: config.retryDelay || 1000
    };

    this.client = axios.create({
      baseURL: this.config.baseUrl,
      timeout: this.config.timeout,
      headers: {
        'Authorization': `Bearer ${this.config.apiKey}`,
        'Content-Type': 'application/json',
        'User-Agent': 'KPI-Automation-Platform/1.0'
      }
    });

    this.setupInterceptors();
  }

  /**
   * Setup request and response interceptors
   */
  private setupInterceptors(): void {
    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        // Add request timestamp
        config.headers['X-Request-Time'] = new Date().toISOString();
        return config;
      },
      (error) => {
        return Promise.reject(this.handleError(error));
      }
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response) => {
        return response;
      },
      async (error: AxiosError) => {
        return Promise.reject(this.handleError(error));
      }
    );
  }

  /**
   * Handle errors and convert to PostizError
   */
  private handleError(error: any): PostizError {
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;
      return new PostizError(
        data?.error?.message || data?.message || 'API request failed',
        data?.error?.code || `HTTP_${status}`,
        status,
        data?.error?.details || data
      );
    } else if (error.request) {
      // Request made but no response received
      return new PostizError(
        'No response received from server',
        'NO_RESPONSE',
        undefined,
        error.request
      );
    } else {
      // Error in request setup
      return new PostizError(
        error.message || 'Request setup failed',
        'REQUEST_ERROR',
        undefined,
        error
      );
    }
  }

  /**
   * Make GET request with retry logic
   */
  async get<T>(
    path: string,
    params?: Record<string, any>,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    return this.request<T>('GET', path, undefined, params, config);
  }

  /**
   * Make POST request with retry logic
   */
  async post<T>(
    path: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    return this.request<T>('POST', path, data, undefined, config);
  }

  /**
   * Make PUT request with retry logic
   */
  async put<T>(
    path: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    return this.request<T>('PUT', path, data, undefined, config);
  }

  /**
   * Make DELETE request with retry logic
   */
  async delete<T>(
    path: string,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    return this.request<T>('DELETE', path, undefined, undefined, config);
  }

  /**
   * Make PATCH request with retry logic
   */
  async patch<T>(
    path: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    return this.request<T>('PATCH', path, data, undefined, config);
  }

  /**
   * Generic request method with retry logic
   */
  private async request<T>(
    method: string,
    path: string,
    data?: any,
    params?: Record<string, any>,
    config?: AxiosRequestConfig,
    attempt: number = 1
  ): Promise<ApiResponse<T>> {
    try {
      const response = await this.client.request<ApiResponse<T>>({
        method,
        url: path,
        data,
        params,
        ...config
      });

      return response.data;
    } catch (error: any) {
      // Retry logic for specific errors
      if (this.shouldRetry(error) && attempt < this.config.retryAttempts) {
        await this.delay(this.config.retryDelay * attempt);
        return this.request<T>(method, path, data, params, config, attempt + 1);
      }

      throw error;
    }
  }

  /**
   * Determine if request should be retried
   */
  private shouldRetry(error: PostizError): boolean {
    // Retry on network errors or 5xx server errors
    if (!error.statusCode) {
      return true;
    }

    // Retry on specific status codes
    const retryableCodes = [408, 429, 500, 502, 503, 504];
    return retryableCodes.includes(error.statusCode);
  }

  /**
   * Delay helper for retry logic
   */
  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * Upload file with multipart/form-data
   */
  async uploadFile<T>(
    path: string,
    file: Buffer | File,
    filename: string,
    additionalFields?: Record<string, any>
  ): Promise<ApiResponse<T>> {
    const formData = new FormData();

    if (file instanceof Buffer) {
      formData.append('file', new Blob([file]), filename);
    } else {
      formData.append('file', file, filename);
    }

    // Add additional fields
    if (additionalFields) {
      Object.entries(additionalFields).forEach(([key, value]) => {
        formData.append(key, typeof value === 'object' ? JSON.stringify(value) : value);
      });
    }

    const response = await this.client.post<ApiResponse<T>>(path, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });

    return response.data;
  }

  /**
   * Stream download helper
   */
  async download(url: string): Promise<Buffer> {
    const response = await this.client.get(url, {
      responseType: 'arraybuffer'
    });

    return Buffer.from(response.data);
  }

  /**
   * Get client configuration
   */
  getConfig(): Required<PostizConfig> {
    return { ...this.config };
  }

  /**
   * Update API key
   */
  setApiKey(apiKey: string): void {
    this.config.apiKey = apiKey;
    this.client.defaults.headers.common['Authorization'] = `Bearer ${apiKey}`;
  }

  /**
   * Health check
   */
  async healthCheck(): Promise<boolean> {
    try {
      await this.get('/health');
      return true;
    } catch (error) {
      return false;
    }
  }
}
