import { GraphQLClient } from 'graphql-request';

export interface TwentyCRMClientConfig {
  apiUrl: string;
  apiKey?: string;
  accessToken?: string;
  timeout?: number;
}

export class TwentyGraphQLClient {
  private client: GraphQLClient;
  private config: TwentyCRMClientConfig;

  constructor(config: TwentyCRMClientConfig) {
    this.config = config;

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (config.apiKey) {
      headers['Authorization'] = `Bearer ${config.apiKey}`;
    } else if (config.accessToken) {
      headers['Authorization'] = `Bearer ${config.accessToken}`;
    }

    this.client = new GraphQLClient(config.apiUrl, {
      headers,
      timeout: config.timeout || 30000,
    });
  }

  async request<T>(query: string, variables?: any): Promise<T> {
    try {
      return await this.client.request<T>(query, variables);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  updateToken(token: string) {
    this.client.setHeader('Authorization', `Bearer ${token}`);
  }

  private handleError(error: any): Error {
    if (error.response) {
      const { errors } = error.response;
      if (errors && errors.length > 0) {
        const firstError = errors[0];
        return new Error(
          `GraphQL Error: ${firstError.message} (${firstError.extensions?.code || 'UNKNOWN'})`
        );
      }
    }

    if (error.message) {
      return new Error(`Request failed: ${error.message}`);
    }

    return new Error('An unknown error occurred');
  }
}
