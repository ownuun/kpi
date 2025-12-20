import axios, { AxiosInstance, AxiosError } from 'axios';
import { ClientConfig, ApiError } from './types';

/**
 * Base REST API Client for n8n
 */
export class N8nClient {
  private axiosInstance: AxiosInstance;
  private config: ClientConfig;

  constructor(config: ClientConfig) {
    this.config = {
      timeout: 30000,
      retryAttempts: 3,
      retryDelay: 1000,
      ...config
    };

    this.axiosInstance = axios.create({
      baseURL: this.config.baseUrl,
      timeout: this.config.timeout,
      headers: {
        'X-N8N-API-KEY': this.config.apiKey,
        'Content-Type': 'application/json'
      }
    });

    // Add interceptors for error handling and retries
    this.setupInterceptors();
  }

  /**
   * Setup axios interceptors for error handling
   */
  private setupInterceptors(): void {
    this.axiosInstance.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        const config = error.config;

        if (!config) {
          return Promise.reject(this.handleError(error));
        }

        config.retryCount = config.retryCount || 0;

        // Retry on specific error codes
        if (
          (error.response?.status === 429 || error.response?.status === 503) &&
          config.retryCount < (this.config.retryAttempts || 3)
        ) {
          config.retryCount++;
          const delay = (this.config.retryDelay || 1000) * config.retryCount;
          await new Promise((resolve) => setTimeout(resolve, delay));
          return this.axiosInstance(config);
        }

        return Promise.reject(this.handleError(error));
      }
    );
  }

  /**
   * Handle API errors
   */
  private handleError(error: AxiosError): ApiError {
    if (error.response) {
      return new ApiError(
        error.response.status,
        error.response.statusText,
        error.response.data
      );
    } else if (error.request) {
      return new ApiError(0, 'No response from server', error.request);
    } else {
      return new ApiError(0, error.message);
    }
  }

  /**
   * GET request
   */
  async get<T = any>(url: string, config?: any): Promise<T> {
    try {
      const response = await this.axiosInstance.get<T>(url, config);
      return response.data;
    } catch (error) {
      throw this.handleError(error as AxiosError);
    }
  }

  /**
   * POST request
   */
  async post<T = any>(url: string, data?: any, config?: any): Promise<T> {
    try {
      const response = await this.axiosInstance.post<T>(url, data, config);
      return response.data;
    } catch (error) {
      throw this.handleError(error as AxiosError);
    }
  }

  /**
   * PUT request
   */
  async put<T = any>(url: string, data?: any, config?: any): Promise<T> {
    try {
      const response = await this.axiosInstance.put<T>(url, data, config);
      return response.data;
    } catch (error) {
      throw this.handleError(error as AxiosError);
    }
  }

  /**
   * DELETE request
   */
  async delete<T = any>(url: string, config?: any): Promise<T> {
    try {
      const response = await this.axiosInstance.delete<T>(url, config);
      return response.data;
    } catch (error) {
      throw this.handleError(error as AxiosError);
    }
  }

  /**
   * PATCH request
   */
  async patch<T = any>(url: string, data?: any, config?: any): Promise<T> {
    try {
      const response = await this.axiosInstance.patch<T>(url, data, config);
      return response.data;
    } catch (error) {
      throw this.handleError(error as AxiosError);
    }
  }

  /**
   * Get the axios instance for custom requests
   */
  getAxiosInstance(): AxiosInstance {
    return this.axiosInstance;
  }

  /**
   * Get current configuration
   */
  getConfig(): ClientConfig {
    return this.config;
  }

  /**
   * Update configuration
   */
  updateConfig(newConfig: Partial<ClientConfig>): void {
    this.config = {
      ...this.config,
      ...newConfig
    };

    this.axiosInstance.defaults.baseURL = this.config.baseUrl;
    this.axiosInstance.defaults.timeout = this.config.timeout;
    this.axiosInstance.defaults.headers['X-N8N-API-KEY'] = this.config.apiKey;
  }
}
