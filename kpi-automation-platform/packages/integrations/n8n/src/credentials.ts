import { N8nClient } from './client';
import {
  Credential,
  CredentialCreate,
  CredentialUpdate,
  CredentialResponse,
  CredentialType,
  CredentialSchema,
  CredentialCreateSchema,
  CredentialUpdateSchema
} from './types';

/**
 * Credential Manager
 * Handles all credential-related operations
 */
export class CredentialManager {
  constructor(private client: N8nClient) {}

  /**
   * Get all credentials
   */
  async listCredentials(options?: {
    limit?: number;
    skip?: number;
    type?: CredentialType;
  }): Promise<CredentialResponse[]> {
    const params = new URLSearchParams();

    if (options?.limit) params.append('limit', options.limit.toString());
    if (options?.skip) params.append('skip', options.skip.toString());
    if (options?.type) params.append('type', options.type);

    const queryString = params.toString();
    const url = queryString ? `/credentials?${queryString}` : '/credentials';

    const response = await this.client.get<{ data: CredentialResponse[] }>(url);
    return response.data || [];
  }

  /**
   * Get credential by ID
   */
  async getCredential(credentialId: string): Promise<CredentialResponse> {
    const response = await this.client.get<CredentialResponse>(
      `/credentials/${credentialId}`
    );
    return CredentialSchema.parse(response);
  }

  /**
   * Create a new credential
   */
  async createCredential(credential: CredentialCreate): Promise<CredentialResponse> {
    // Validate input
    const validatedData = CredentialCreateSchema.parse(credential);

    const response = await this.client.post<CredentialResponse>(
      '/credentials',
      validatedData
    );
    return CredentialSchema.parse(response);
  }

  /**
   * Update an existing credential
   */
  async updateCredential(
    credentialId: string,
    updates: CredentialUpdate
  ): Promise<CredentialResponse> {
    // Validate input
    const validatedData = CredentialUpdateSchema.parse(updates);

    const response = await this.client.put<CredentialResponse>(
      `/credentials/${credentialId}`,
      validatedData
    );
    return CredentialSchema.parse(response);
  }

  /**
   * Delete a credential
   */
  async deleteCredential(credentialId: string): Promise<void> {
    await this.client.delete(`/credentials/${credentialId}`);
  }

  /**
   * Get credential by name
   */
  async getCredentialByName(name: string): Promise<CredentialResponse> {
    const response = await this.client.get<CredentialResponse>(
      `/credentials/name/${name}`
    );
    return CredentialSchema.parse(response);
  }

  /**
   * List credentials by type
   */
  async listCredentialsByType(
    type: CredentialType,
    options?: {
      limit?: number;
      skip?: number;
    }
  ): Promise<CredentialResponse[]> {
    const params = new URLSearchParams([['type', type]]);

    if (options?.limit) params.append('limit', options.limit.toString());
    if (options?.skip) params.append('skip', options.skip.toString());

    const response = await this.client.get<{ data: CredentialResponse[] }>(
      `/credentials?${params.toString()}`
    );
    return response.data || [];
  }

  /**
   * Test credential validity
   */
  async testCredential(credentialId: string): Promise<{
    status: 'valid' | 'invalid';
    message?: string;
  }> {
    const response = await this.client.post<any>(
      `/credentials/${credentialId}/test`,
      {}
    );
    return response;
  }

  /**
   * Test credential with data
   */
  async testCredentialWithData(credential: Credential): Promise<{
    status: 'valid' | 'invalid';
    message?: string;
  }> {
    const response = await this.client.post<any>(
      '/credentials/test',
      credential
    );
    return response;
  }

  /**
   * Get workflows using a credential
   */
  async getCredentialUsage(credentialId: string): Promise<{
    workflowIds: string[];
    workflowCount: number;
  }> {
    const response = await this.client.get<any>(
      `/credentials/${credentialId}/usage`
    );
    return response;
  }

  /**
   * Search credentials by name
   */
  async searchCredentials(query: string): Promise<CredentialResponse[]> {
    const params = new URLSearchParams([['query', query]]);
    const response = await this.client.get<{ data: CredentialResponse[] }>(
      `/credentials/search?${params.toString()}`
    );
    return response.data || [];
  }

  /**
   * Duplicate a credential
   */
  async duplicateCredential(
    credentialId: string,
    newName?: string
  ): Promise<CredentialResponse> {
    const data = newName ? { name: newName } : {};
    const response = await this.client.post<CredentialResponse>(
      `/credentials/${credentialId}/duplicate`,
      data
    );
    return CredentialSchema.parse(response);
  }

  /**
   * Get credential statistics
   */
  async getCredentialStats(): Promise<{
    total: number;
    byType: Record<CredentialType, number>;
    unused: number;
  }> {
    const response = await this.client.get<any>('/credentials/stats');
    return response;
  }

  /**
   * Validate credential data structure
   */
  validateCredentialData(credential: Credential): { valid: boolean; errors?: string[] } {
    try {
      CredentialSchema.parse(credential);
      return { valid: true };
    } catch (error: any) {
      return {
        valid: false,
        errors: error.errors?.map((e: any) => e.message) || [error.message]
      };
    }
  }
}
