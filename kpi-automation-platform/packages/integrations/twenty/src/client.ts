import { GraphQLClient, RequestOptions } from 'graphql-request';
import { TwentyConfig, TwentyError, GraphQLResponse } from './types';

/**
 * Twenty GraphQL Client
 */
export class TwentyClient {
  private client: GraphQLClient;
  private config: Required<TwentyConfig>;

  constructor(config: TwentyConfig) {
    this.config = {
      apiKey: config.apiKey,
      baseUrl: config.baseUrl || 'https://api.twenty.com/graphql',
      timeout: config.timeout || 30000,
      retryAttempts: config.retryAttempts || 3,
      retryDelay: config.retryDelay || 1000
    };

    this.client = new GraphQLClient(this.config.baseUrl, {
      headers: {
        'Authorization': `Bearer ${this.config.apiKey}`,
        'Content-Type': 'application/json',
        'User-Agent': 'KPI-Automation-Platform/1.0'
      },
      timeout: this.config.timeout
    });
  }

  /**
   * Execute GraphQL query with retry logic
   */
  async query<T = any>(
    query: string,
    variables?: Record<string, any>,
    attempt: number = 1
  ): Promise<T> {
    try {
      const data = await this.client.request<T>(query, variables);
      return data;
    } catch (error: any) {
      // Handle GraphQL errors
      if (error.response?.errors) {
        throw new TwentyError(
          error.response.errors[0]?.message || 'GraphQL query failed',
          'GRAPHQL_ERROR',
          error.response.status,
          error.response.errors
        );
      }

      // Retry logic for network errors
      if (this.shouldRetry(error) && attempt < this.config.retryAttempts) {
        await this.delay(this.config.retryDelay * attempt);
        return this.query<T>(query, variables, attempt + 1);
      }

      throw this.handleError(error);
    }
  }

  /**
   * Execute GraphQL mutation with retry logic
   */
  async mutate<T = any>(
    mutation: string,
    variables?: Record<string, any>,
    attempt: number = 1
  ): Promise<T> {
    try {
      const data = await this.client.request<T>(mutation, variables);
      return data;
    } catch (error: any) {
      // Handle GraphQL errors
      if (error.response?.errors) {
        throw new TwentyError(
          error.response.errors[0]?.message || 'GraphQL mutation failed',
          'GRAPHQL_ERROR',
          error.response.status,
          error.response.errors
        );
      }

      // Retry logic for network errors
      if (this.shouldRetry(error) && attempt < this.config.retryAttempts) {
        await this.delay(this.config.retryDelay * attempt);
        return this.mutate<T>(mutation, variables, attempt + 1);
      }

      throw this.handleError(error);
    }
  }

  /**
   * Execute raw GraphQL request
   */
  async rawRequest<T = any>(
    query: string,
    variables?: Record<string, any>
  ): Promise<GraphQLResponse<T>> {
    try {
      const response = await this.client.rawRequest<T>(query, variables);
      return {
        data: response.data,
        errors: response.errors
      };
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  /**
   * Batch requests
   */
  async batchRequests(
    queries: Array<{ query: string; variables?: Record<string, any> }>
  ): Promise<any[]> {
    try {
      const promises = queries.map(({ query, variables }) =>
        this.client.request(query, variables)
      );
      return await Promise.all(promises);
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  /**
   * Handle errors and convert to TwentyError
   */
  private handleError(error: any): TwentyError {
    if (error instanceof TwentyError) {
      return error;
    }

    if (error.response) {
      // Server responded with error
      const { status, errors } = error.response;
      return new TwentyError(
        errors?.[0]?.message || error.message || 'Request failed',
        `HTTP_${status}`,
        status,
        errors
      );
    } else if (error.request) {
      // Request made but no response received
      return new TwentyError(
        'No response received from server',
        'NO_RESPONSE'
      );
    } else {
      // Error in request setup
      return new TwentyError(
        error.message || 'Request setup failed',
        'REQUEST_ERROR'
      );
    }
  }

  /**
   * Determine if request should be retried
   */
  private shouldRetry(error: any): boolean {
    // Retry on network errors
    if (!error.response) {
      return true;
    }

    // Retry on specific status codes
    const retryableCodes = [408, 429, 500, 502, 503, 504];
    return retryableCodes.includes(error.response.status);
  }

  /**
   * Delay helper for retry logic
   */
  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * Set custom headers
   */
  setHeaders(headers: Record<string, string>): void {
    this.client.setHeaders(headers);
  }

  /**
   * Set API key
   */
  setApiKey(apiKey: string): void {
    this.config.apiKey = apiKey;
    this.client.setHeader('Authorization', `Bearer ${apiKey}`);
  }

  /**
   * Get client configuration
   */
  getConfig(): Required<TwentyConfig> {
    return { ...this.config };
  }

  /**
   * Health check
   */
  async healthCheck(): Promise<boolean> {
    try {
      const query = `
        query HealthCheck {
          __schema {
            queryType {
              name
            }
          }
        }
      `;
      await this.query(query);
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Get GraphQL schema
   */
  async getSchema(): Promise<any> {
    const query = `
      query IntrospectionQuery {
        __schema {
          types {
            name
            kind
            description
          }
        }
      }
    `;
    return await this.query(query);
  }
}
