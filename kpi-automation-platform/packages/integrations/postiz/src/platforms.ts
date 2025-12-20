import { PostizClient } from './client';
import {
  Platform,
  PlatformConnection,
  ConnectPlatformRequest,
  PlatformConnectionSchema,
  Media,
  UploadMediaRequest,
  MediaSchema
} from './types';

/**
 * Platform Management Service
 */
export class PlatformsService {
  constructor(private client: PostizClient) {}

  /**
   * Connect a new platform account
   */
  async connectPlatform(request: ConnectPlatformRequest): Promise<PlatformConnection> {
    const response = await this.client.post<PlatformConnection>(
      '/platforms/connect',
      request
    );

    if (!response.success || !response.data) {
      throw new Error(response.error?.message || 'Failed to connect platform');
    }

    return PlatformConnectionSchema.parse(response.data);
  }

  /**
   * Disconnect a platform account
   */
  async disconnectPlatform(connectionId: string): Promise<void> {
    const response = await this.client.post(`/platforms/${connectionId}/disconnect`);

    if (!response.success) {
      throw new Error(response.error?.message || 'Failed to disconnect platform');
    }
  }

  /**
   * Get platform connection details
   */
  async getPlatformConnection(connectionId: string): Promise<PlatformConnection> {
    const response = await this.client.get<PlatformConnection>(
      `/platforms/${connectionId}`
    );

    if (!response.success || !response.data) {
      throw new Error(response.error?.message || 'Failed to get platform connection');
    }

    return PlatformConnectionSchema.parse(response.data);
  }

  /**
   * List all connected platforms
   */
  async listPlatformConnections(params?: {
    platform?: Platform;
    isActive?: boolean;
  }): Promise<PlatformConnection[]> {
    const response = await this.client.get<PlatformConnection[]>(
      '/platforms',
      params
    );

    if (!response.success || !response.data) {
      throw new Error(response.error?.message || 'Failed to list platform connections');
    }

    return response.data.map(connection =>
      PlatformConnectionSchema.parse(connection)
    );
  }

  /**
   * Refresh platform connection token
   */
  async refreshPlatformToken(connectionId: string): Promise<PlatformConnection> {
    const response = await this.client.post<PlatformConnection>(
      `/platforms/${connectionId}/refresh`
    );

    if (!response.success || !response.data) {
      throw new Error(response.error?.message || 'Failed to refresh platform token');
    }

    return PlatformConnectionSchema.parse(response.data);
  }

  /**
   * Sync platform data
   */
  async syncPlatform(connectionId: string): Promise<{
    success: boolean;
    syncedAt: string;
    itemsSynced: number;
  }> {
    const response = await this.client.post<any>(
      `/platforms/${connectionId}/sync`
    );

    if (!response.success || !response.data) {
      throw new Error(response.error?.message || 'Failed to sync platform');
    }

    return response.data;
  }

  /**
   * Get platform capabilities
   */
  async getPlatformCapabilities(platform: Platform): Promise<{
    maxContentLength: number;
    supportsImages: boolean;
    supportsVideos: boolean;
    supportsGifs: boolean;
    maxMediaCount: number;
    maxVideoSize: number;
    maxImageSize: number;
    supportsScheduling: boolean;
    supportsHashtags: boolean;
    supportsMentions: boolean;
    supportsLinks: boolean;
  }> {
    const response = await this.client.get<any>(
      `/platforms/${platform}/capabilities`
    );

    if (!response.success || !response.data) {
      throw new Error(response.error?.message || 'Failed to get platform capabilities');
    }

    return response.data;
  }

  /**
   * Upload media to platform
   */
  async uploadMedia(
    connectionId: string,
    request: UploadMediaRequest
  ): Promise<Media> {
    const response = await this.client.uploadFile<Media>(
      `/platforms/${connectionId}/media`,
      request.file,
      request.filename,
      { type: request.type }
    );

    if (!response.success || !response.data) {
      throw new Error(response.error?.message || 'Failed to upload media');
    }

    return MediaSchema.parse(response.data);
  }

  /**
   * Delete media from platform
   */
  async deleteMedia(connectionId: string, mediaId: string): Promise<void> {
    const response = await this.client.delete(
      `/platforms/${connectionId}/media/${mediaId}`
    );

    if (!response.success) {
      throw new Error(response.error?.message || 'Failed to delete media');
    }
  }

  /**
   * List media for platform connection
   */
  async listMedia(connectionId: string, params?: {
    limit?: number;
    offset?: number;
  }): Promise<{
    items: Media[];
    total: number;
  }> {
    const response = await this.client.get<any>(
      `/platforms/${connectionId}/media`,
      params
    );

    if (!response.success || !response.data) {
      throw new Error(response.error?.message || 'Failed to list media');
    }

    const validatedMedia = response.data.items.map((media: any) =>
      MediaSchema.parse(media)
    );

    return {
      items: validatedMedia,
      total: response.data.total
    };
  }

  /**
   * Test platform connection
   */
  async testConnection(connectionId: string): Promise<{
    success: boolean;
    message: string;
    latency?: number;
  }> {
    const startTime = Date.now();

    const response = await this.client.get<any>(
      `/platforms/${connectionId}/test`
    );

    const latency = Date.now() - startTime;

    if (!response.success || !response.data) {
      return {
        success: false,
        message: response.error?.message || 'Connection test failed',
        latency
      };
    }

    return {
      ...response.data,
      latency
    };
  }

  /**
   * Get platform account info
   */
  async getPlatformAccountInfo(connectionId: string): Promise<{
    id: string;
    username: string;
    displayName: string;
    profileUrl: string;
    avatarUrl?: string;
    followers?: number;
    following?: number;
    verified?: boolean;
  }> {
    const response = await this.client.get<any>(
      `/platforms/${connectionId}/account`
    );

    if (!response.success || !response.data) {
      throw new Error(response.error?.message || 'Failed to get platform account info');
    }

    return response.data;
  }

  /**
   * Get supported platforms list
   */
  async getSupportedPlatforms(): Promise<Array<{
    platform: Platform;
    name: string;
    icon: string;
    color: string;
    isAvailable: boolean;
    comingSoon: boolean;
  }>> {
    const response = await this.client.get<any>('/platforms/supported');

    if (!response.success || !response.data) {
      throw new Error(response.error?.message || 'Failed to get supported platforms');
    }

    return response.data;
  }

  /**
   * Update platform connection settings
   */
  async updatePlatformSettings(
    connectionId: string,
    settings: {
      autoPublish?: boolean;
      defaultHashtags?: string[];
      watermark?: boolean;
      notifyOnPublish?: boolean;
    }
  ): Promise<PlatformConnection> {
    const response = await this.client.patch<PlatformConnection>(
      `/platforms/${connectionId}/settings`,
      settings
    );

    if (!response.success || !response.data) {
      throw new Error(response.error?.message || 'Failed to update platform settings');
    }

    return PlatformConnectionSchema.parse(response.data);
  }

  /**
   * Get OAuth authorization URL for platform
   */
  async getAuthorizationUrl(
    platform: Platform,
    redirectUri: string,
    state?: string
  ): Promise<{
    authUrl: string;
    state: string;
  }> {
    const response = await this.client.post<any>('/platforms/auth-url', {
      platform,
      redirectUri,
      state
    });

    if (!response.success || !response.data) {
      throw new Error(response.error?.message || 'Failed to get authorization URL');
    }

    return response.data;
  }

  /**
   * Exchange OAuth code for tokens
   */
  async exchangeOAuthCode(
    platform: Platform,
    code: string,
    redirectUri: string
  ): Promise<{
    accessToken: string;
    refreshToken?: string;
    expiresIn?: number;
  }> {
    const response = await this.client.post<any>('/platforms/exchange-code', {
      platform,
      code,
      redirectUri
    });

    if (!response.success || !response.data) {
      throw new Error(response.error?.message || 'Failed to exchange OAuth code');
    }

    return response.data;
  }
}
