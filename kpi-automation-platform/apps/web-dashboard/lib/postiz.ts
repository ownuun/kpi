import { Platform, MediaType, PostStatus, Post, CreatePostRequest, UpdatePostRequest, ListPostsParams, PaginatedResponse } from '@/types/posts';

/**
 * Postiz SDK with real API implementation
 */
class PostizSDK {
  private apiKey: string;
  private baseUrl: string;
  private timeout: number;
  private retryAttempts: number;
  private retryDelay: number;

  constructor(config: {
    apiKey: string;
    baseUrl: string;
    timeout: number;
    retryAttempts: number;
    retryDelay: number;
  }) {
    this.apiKey = config.apiKey;
    this.baseUrl = config.baseUrl;
    this.timeout = config.timeout;
    this.retryAttempts = config.retryAttempts;
    this.retryDelay = config.retryDelay;
  }

  /**
   * Make HTTP request with retry logic
   */
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    let lastError: Error | null = null;

    for (let attempt = 0; attempt < this.retryAttempts; attempt++) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), this.timeout);

        const response = await fetch(url, {
          ...options,
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
            ...options.headers,
          },
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(
            errorData.message || `HTTP ${response.status}: ${response.statusText}`
          );
        }

        return await response.json();
      } catch (error) {
        lastError = error as Error;
        
        // Don't retry on 4xx errors (client errors)
        if (error instanceof Error && error.message.includes('HTTP 4')) {
          throw error;
        }

        // Wait before retrying (exponential backoff)
        if (attempt < this.retryAttempts - 1) {
          await new Promise(resolve => 
            setTimeout(resolve, this.retryDelay * Math.pow(2, attempt))
          );
        }
      }
    }

    throw lastError || new Error('Request failed after retries');
  }

  posts = {
    createPost: async (request: CreatePostRequest): Promise<Post> => {
      return await this.request<Post>('/api/posts', {
        method: 'POST',
        body: JSON.stringify(request),
      });
    },

    updatePost: async (id: string, request: UpdatePostRequest): Promise<Post> => {
      return await this.request<Post>(`/api/posts/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(request),
      });
    },

    getPost: async (id: string): Promise<Post> => {
      return await this.request<Post>(`/api/posts/${id}`);
    },

    deletePost: async (id: string): Promise<void> => {
      await this.request<void>(`/api/posts/${id}`, {
        method: 'DELETE',
      });
    },

    listPosts: async (params: ListPostsParams): Promise<PaginatedResponse<Post>> => {
      const queryParams = new URLSearchParams();
      
      if (params.page) queryParams.set('page', params.page.toString());
      if (params.limit) queryParams.set('limit', params.limit.toString());
      if (params.status) queryParams.set('status', params.status);
      if (params.platform) queryParams.set('platform', params.platform);
      if (params.search) queryParams.set('search', params.search);
      if (params.sort) queryParams.set('sort', params.sort);
      if (params.order) queryParams.set('order', params.order);

      const queryString = queryParams.toString();
      const endpoint = `/api/posts${queryString ? `?${queryString}` : ''}`;

      return await this.request<PaginatedResponse<Post>>(endpoint);
    },

    publishPost: async (id: string): Promise<Post> => {
      return await this.request<Post>(`/api/posts/${id}/publish`, {
        method: 'POST',
      });
    },
  };

  analytics = {
    getPostAnalytics: async (params: any): Promise<any> => {
      const queryParams = new URLSearchParams();

      if (params.postId) queryParams.set('postId', params.postId);
      if (params.platform) queryParams.set('platform', params.platform);
      if (params.startDate) queryParams.set('startDate', params.startDate);
      if (params.endDate) queryParams.set('endDate', params.endDate);

      const queryString = queryParams.toString();
      const endpoint = `/api/analytics${queryString ? `?${queryString}` : ''}`;

      return await this.request<any>(endpoint);
    },
  };

  integrations = {
    // 사용자의 연결된 계정 목록 가져오기
    listIntegrations: async (): Promise<Integration[]> => {
      return await this.request<Integration[]>('/api/integrations');
    },

    // OAuth 인증 URL 생성
    getAuthUrl: async (params: {
      platform: string;
      redirectUri: string;
      state: string;
    }): Promise<string> => {
      const response = await this.request<{ authUrl: string }>('/api/integrations/auth-url', {
        method: 'POST',
        body: JSON.stringify(params),
      });
      return response.authUrl;
    },

    // OAuth 코드를 access token으로 교환
    exchangeToken: async (code: string): Promise<Integration> => {
      return await this.request<Integration>('/api/integrations/exchange-token', {
        method: 'POST',
        body: JSON.stringify({ code }),
      });
    },

    // 특정 integration으로 포스트 발행
    createPostWithIntegration: async (
      integrationId: string,
      request: CreatePostRequest
    ): Promise<Post> => {
      return await this.request<Post>('/api/posts', {
        method: 'POST',
        body: JSON.stringify({
          ...request,
          integrationId, // Postiz에게 어떤 계정을 사용할지 지정
        }),
      });
    },

    // Integration 삭제 (계정 연결 해제)
    deleteIntegration: async (integrationId: string): Promise<void> => {
      await this.request<void>(`/api/integrations/${integrationId}`, {
        method: 'DELETE',
      });
    },
  };

  async healthCheck(): Promise<boolean> {
    try {
      await this.request<{ status: string }>('/api/health');
      return true;
    } catch (error) {
      console.error('Postiz health check failed:', error);
      return false;
    }
  }
}

// Integration 타입 정의
export interface Integration {
  id: string;
  platform: string;
  accountName: string;
  accountId: string;
  profilePicture?: string;
  isConnected: boolean;
  accessToken?: string;
  refreshToken?: string;
  expiresAt?: string;
}

/**
 * Postiz SDK singleton instance
 * Used across the application for SNS operations
 */
let postizInstance: PostizSDK | null = null;

export function getPostizClient(): PostizSDK {
  if (!postizInstance) {
    const apiKey = process.env.POSTIZ_API_KEY || process.env.NEXT_PUBLIC_POSTIZ_API_KEY;

    if (!apiKey) {
      throw new Error(
        'POSTIZ_API_KEY is not configured. Please set it in your .env file.'
      );
    }

    postizInstance = new PostizSDK({
      apiKey,
      baseUrl: process.env.POSTIZ_API_URL || 'https://api.postiz.com',
      timeout: 30000,
      retryAttempts: 3,
      retryDelay: 1000,
    });
  }

  return postizInstance;
}

/**
 * Reset the Postiz client instance
 * Useful for testing or when configuration changes
 */
export function resetPostizClient(): void {
  postizInstance = null;
}

/**
 * Check if Postiz is properly configured
 */
export async function checkPostizHealth(): Promise<boolean> {
  try {
    const client = getPostizClient();
    return await client.healthCheck();
  } catch (error) {
    console.error('Postiz health check failed:', error);
    return false;
  }
}

export default getPostizClient;
