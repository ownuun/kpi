/**
 * Metabase REST API Client
 * Wrapper for Metabase API operations
 */

import axios, { AxiosInstance, AxiosError } from 'axios';
import type {
  MetabaseConfig,
  SessionToken,
  Dashboard,
  CreateDashboardInput,
  UpdateDashboardInput,
  Card,
  CreateCardInput,
  UpdateCardInput,
  Collection,
  Database,
  Table,
  QueryResult,
  ListOptions,
  MetabaseApiError,
  User,
  PublicLink,
} from '../types';

export class MetabaseClient {
  private client: AxiosInstance;
  private config: MetabaseConfig;
  private sessionToken?: string;

  constructor(config: MetabaseConfig) {
    this.config = config;
    this.client = axios.create({
      baseURL: `${config.apiUrl}/api`,
      timeout: config.timeout || 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Error interceptor
    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        const apiError: MetabaseApiError = {
          message: error.response?.data?.message || error.message,
          code: error.code || 'UNKNOWN_ERROR',
          statusCode: error.response?.status || 500,
          errors: error.response?.data?.errors,
        };
        throw apiError;
      }
    );

    // Request interceptor to add session token
    this.client.interceptors.request.use((config) => {
      if (this.sessionToken) {
        config.headers['X-Metabase-Session'] = this.sessionToken;
      }
      return config;
    });
  }

  // ========================================
  // Authentication & Session Management
  // ========================================

  /**
   * Authenticate and obtain session token
   */
  async authenticate(): Promise<string> {
    if (this.config.apiKey) {
      // Use API key authentication
      this.sessionToken = this.config.apiKey;
      return this.sessionToken;
    }

    if (!this.config.username || !this.config.password) {
      throw new Error('Either apiKey or username/password must be provided');
    }

    const response = await this.client.post<SessionToken>('/session', {
      username: this.config.username,
      password: this.config.password,
    });

    this.sessionToken = response.data.id;
    return this.sessionToken;
  }

  /**
   * Get current session token (authenticate if needed)
   */
  async getSessionToken(): Promise<string> {
    if (!this.sessionToken) {
      await this.authenticate();
    }
    return this.sessionToken!;
  }

  /**
   * End current session
   */
  async logout(): Promise<void> {
    if (this.sessionToken) {
      await this.client.delete('/session');
      this.sessionToken = undefined;
    }
  }

  /**
   * Get current user information
   */
  async getCurrentUser(): Promise<User> {
    const response = await this.client.get<User>('/user/current');
    return response.data;
  }

  // ========================================
  // Dashboard Operations
  // ========================================

  /**
   * List all dashboards
   */
  async listDashboards(options: ListOptions = {}): Promise<Dashboard[]> {
    const params: any = {};
    if (options.archived !== undefined) {
      params.archived = options.archived;
    }
    if (options.collection_id !== undefined) {
      params.collection_id = options.collection_id;
    }

    const response = await this.client.get<Dashboard[]>('/dashboard', {
      params,
    });
    return response.data;
  }

  /**
   * Get dashboard by ID
   */
  async getDashboard(id: number): Promise<Dashboard> {
    const response = await this.client.get<Dashboard>(`/dashboard/${id}`);
    return response.data;
  }

  /**
   * Create a new dashboard
   */
  async createDashboard(input: CreateDashboardInput): Promise<Dashboard> {
    const response = await this.client.post<Dashboard>('/dashboard', input);
    return response.data;
  }

  /**
   * Update dashboard
   */
  async updateDashboard(
    id: number,
    input: UpdateDashboardInput
  ): Promise<Dashboard> {
    const response = await this.client.put<Dashboard>(
      `/dashboard/${id}`,
      input
    );
    return response.data;
  }

  /**
   * Delete dashboard
   */
  async deleteDashboard(id: number): Promise<void> {
    await this.client.delete(`/dashboard/${id}`);
  }

  /**
   * Archive dashboard
   */
  async archiveDashboard(id: number): Promise<Dashboard> {
    return this.updateDashboard(id, { archived: true });
  }

  /**
   * Unarchive dashboard
   */
  async unarchiveDashboard(id: number): Promise<Dashboard> {
    return this.updateDashboard(id, { archived: false });
  }

  /**
   * Copy/duplicate dashboard
   */
  async copyDashboard(
    id: number,
    name?: string,
    collectionId?: number
  ): Promise<Dashboard> {
    const response = await this.client.post<Dashboard>(
      `/dashboard/${id}/copy`,
      {
        name,
        collection_id: collectionId,
      }
    );
    return response.data;
  }

  /**
   * Enable public sharing for dashboard
   */
  async enableDashboardPublicSharing(id: number): Promise<PublicLink> {
    const response = await this.client.post<Dashboard>(
      `/dashboard/${id}/public_link`
    );
    return {
      uuid: response.data.public_uuid!,
      public_url: `${this.config.apiUrl}/public/dashboard/${response.data.public_uuid}`,
    };
  }

  /**
   * Disable public sharing for dashboard
   */
  async disableDashboardPublicSharing(id: number): Promise<void> {
    await this.client.delete(`/dashboard/${id}/public_link`);
  }

  // ========================================
  // Question/Card Operations
  // ========================================

  /**
   * List all questions/cards
   */
  async listCards(options: ListOptions = {}): Promise<Card[]> {
    const params: any = {};
    if (options.archived !== undefined) {
      params.archived = options.archived;
    }
    if (options.collection_id !== undefined) {
      params.collection_id = options.collection_id;
    }

    const response = await this.client.get<Card[]>('/card', { params });
    return response.data;
  }

  /**
   * Get card/question by ID
   */
  async getCard(id: number): Promise<Card> {
    const response = await this.client.get<Card>(`/card/${id}`);
    return response.data;
  }

  /**
   * Create a new card/question
   */
  async createCard(input: CreateCardInput): Promise<Card> {
    const response = await this.client.post<Card>('/card', input);
    return response.data;
  }

  /**
   * Update card/question
   */
  async updateCard(id: number, input: UpdateCardInput): Promise<Card> {
    const response = await this.client.put<Card>(`/card/${id}`, input);
    return response.data;
  }

  /**
   * Delete card/question
   */
  async deleteCard(id: number): Promise<void> {
    await this.client.delete(`/card/${id}`);
  }

  /**
   * Archive card/question
   */
  async archiveCard(id: number): Promise<Card> {
    return this.updateCard(id, { archived: true });
  }

  /**
   * Execute a saved question and get results
   */
  async executeCard(
    id: number,
    parameters?: Record<string, any>
  ): Promise<QueryResult> {
    const response = await this.client.post<QueryResult>(
      `/card/${id}/query`,
      { parameters }
    );
    return response.data;
  }

  /**
   * Enable public sharing for card
   */
  async enableCardPublicSharing(id: number): Promise<PublicLink> {
    const response = await this.client.post<Card>(`/card/${id}/public_link`);
    return {
      uuid: response.data.public_uuid!,
      public_url: `${this.config.apiUrl}/public/question/${response.data.public_uuid}`,
    };
  }

  /**
   * Disable public sharing for card
   */
  async disableCardPublicSharing(id: number): Promise<void> {
    await this.client.delete(`/card/${id}/public_link`);
  }

  // ========================================
  // Query Execution
  // ========================================

  /**
   * Execute a native SQL query
   */
  async executeNativeQuery(
    databaseId: number,
    query: string,
    parameters?: Record<string, any>
  ): Promise<QueryResult> {
    const response = await this.client.post<QueryResult>('/dataset', {
      database: databaseId,
      type: 'native',
      native: {
        query,
        'template-tags': parameters || {},
      },
    });
    return response.data;
  }

  /**
   * Execute a structured query
   */
  async executeQuery(query: any): Promise<QueryResult> {
    const response = await this.client.post<QueryResult>('/dataset', query);
    return response.data;
  }

  // ========================================
  // Collection Operations
  // ========================================

  /**
   * List all collections
   */
  async listCollections(): Promise<Collection[]> {
    const response = await this.client.get<Collection[]>('/collection');
    return response.data;
  }

  /**
   * Get collection by ID
   */
  async getCollection(id: number): Promise<Collection> {
    const response = await this.client.get<Collection>(`/collection/${id}`);
    return response.data;
  }

  /**
   * Get items in a collection
   */
  async getCollectionItems(id: number): Promise<{
    data: Array<Dashboard | Card>;
    total: number;
  }> {
    const response = await this.client.get<{
      data: Array<Dashboard | Card>;
      total: number;
    }>(`/collection/${id}/items`);
    return response.data;
  }

  /**
   * Create a new collection
   */
  async createCollection(input: {
    name: string;
    description?: string;
    color?: string;
    parent_id?: number;
  }): Promise<Collection> {
    const response = await this.client.post<Collection>('/collection', input);
    return response.data;
  }

  // ========================================
  // Database & Table Operations
  // ========================================

  /**
   * List all databases
   */
  async listDatabases(): Promise<Database[]> {
    const response = await this.client.get<Database[]>('/database');
    return response.data;
  }

  /**
   * Get database by ID
   */
  async getDatabase(id: number): Promise<Database> {
    const response = await this.client.get<Database>(`/database/${id}`);
    return response.data;
  }

  /**
   * Get tables for a database
   */
  async getDatabaseTables(databaseId: number): Promise<Table[]> {
    const response = await this.client.get<Table[]>(
      `/database/${databaseId}/tables`
    );
    return response.data;
  }

  /**
   * Get table metadata
   */
  async getTable(tableId: number): Promise<Table> {
    const response = await this.client.get<Table>(`/table/${tableId}`);
    return response.data;
  }

  /**
   * Get table fields
   */
  async getTableFields(tableId: number): Promise<Table> {
    const response = await this.client.get<Table>(
      `/table/${tableId}/query_metadata`
    );
    return response.data;
  }

  // ========================================
  // Embedding Operations
  // ========================================

  /**
   * Enable embedding for a dashboard
   */
  async enableDashboardEmbedding(
    id: number,
    params?: Record<string, 'enabled' | 'disabled' | 'locked'>
  ): Promise<Dashboard> {
    const response = await this.client.put<Dashboard>(`/dashboard/${id}`, {
      enable_embedding: true,
      embedding_params: params || {},
    });
    return response.data;
  }

  /**
   * Disable embedding for a dashboard
   */
  async disableDashboardEmbedding(id: number): Promise<Dashboard> {
    const response = await this.client.put<Dashboard>(`/dashboard/${id}`, {
      enable_embedding: false,
    });
    return response.data;
  }

  /**
   * Enable embedding for a card/question
   */
  async enableCardEmbedding(
    id: number,
    params?: Record<string, 'enabled' | 'disabled' | 'locked'>
  ): Promise<Card> {
    const response = await this.client.put<Card>(`/card/${id}`, {
      enable_embedding: true,
      embedding_params: params || {},
    });
    return response.data;
  }

  /**
   * Disable embedding for a card/question
   */
  async disableCardEmbedding(id: number): Promise<Card> {
    const response = await this.client.put<Card>(`/card/${id}`, {
      enable_embedding: false,
    });
    return response.data;
  }

  // ========================================
  // Utility Methods
  // ========================================

  /**
   * Health check / ping
   */
  async healthCheck(): Promise<boolean> {
    try {
      const response = await this.client.get('/health');
      return response.status === 200;
    } catch {
      return false;
    }
  }

  /**
   * Get Metabase version
   */
  async getVersion(): Promise<{ version: string }> {
    const response = await this.client.get<{ version: string }>('/session/properties');
    return {
      version: response.data['version']?.tag || 'unknown',
    };
  }
}

/**
 * Factory function to create Metabase client
 */
export function createMetabaseClient(config: MetabaseConfig): MetabaseClient {
  return new MetabaseClient(config);
}
