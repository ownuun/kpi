import { PostizClient } from './client';
import {
  Analytics,
  Platform,
  GetAnalyticsParams,
  AnalyticsSchema
} from './types';

/**
 * Analytics Service
 */
export class AnalyticsService {
  constructor(private client: PostizClient) {}

  /**
   * Get analytics for a specific post
   */
  async getPostAnalytics(params: GetAnalyticsParams): Promise<Analytics[]> {
    const response = await this.client.get<Analytics[]>(
      `/analytics/posts/${params.postId}`,
      {
        platforms: params.platforms?.join(','),
        startDate: params.startDate,
        endDate: params.endDate
      }
    );

    if (!response.success || !response.data) {
      throw new Error(response.error?.message || 'Failed to get post analytics');
    }

    return response.data.map(analytics => AnalyticsSchema.parse(analytics));
  }

  /**
   * Get aggregated analytics for multiple posts
   */
  async getAggregatedAnalytics(params: {
    postIds?: string[];
    platforms?: Platform[];
    startDate?: string;
    endDate?: string;
  }): Promise<{
    totalViews: number;
    totalLikes: number;
    totalShares: number;
    totalComments: number;
    totalClicks: number;
    totalReach: number;
    totalImpressions: number;
    averageEngagement: number;
    averageEngagementRate: number;
    byPlatform: Array<{
      platform: Platform;
      views: number;
      likes: number;
      shares: number;
      comments: number;
      clicks: number;
      reach: number;
      impressions: number;
      engagement: number;
      engagementRate: number;
    }>;
  }> {
    const response = await this.client.get<any>('/analytics/aggregated', {
      postIds: params.postIds?.join(','),
      platforms: params.platforms?.join(','),
      startDate: params.startDate,
      endDate: params.endDate
    });

    if (!response.success || !response.data) {
      throw new Error(response.error?.message || 'Failed to get aggregated analytics');
    }

    return response.data;
  }

  /**
   * Get analytics time series
   */
  async getAnalyticsTimeSeries(params: {
    postIds?: string[];
    platforms?: Platform[];
    startDate: string;
    endDate: string;
    interval?: 'hour' | 'day' | 'week' | 'month';
  }): Promise<Array<{
    timestamp: string;
    views: number;
    likes: number;
    shares: number;
    comments: number;
    clicks: number;
    reach: number;
    impressions: number;
    engagement: number;
    engagementRate: number;
  }>> {
    const response = await this.client.get<any>('/analytics/time-series', {
      postIds: params.postIds?.join(','),
      platforms: params.platforms?.join(','),
      startDate: params.startDate,
      endDate: params.endDate,
      interval: params.interval || 'day'
    });

    if (!response.success || !response.data) {
      throw new Error(response.error?.message || 'Failed to get analytics time series');
    }

    return response.data;
  }

  /**
   * Get top performing posts
   */
  async getTopPosts(params: {
    platforms?: Platform[];
    startDate?: string;
    endDate?: string;
    metric?: 'views' | 'likes' | 'shares' | 'comments' | 'engagement';
    limit?: number;
  }): Promise<Array<{
    postId: string;
    content: string;
    platform: Platform;
    metric: number;
    publishedAt: string;
  }>> {
    const response = await this.client.get<any>('/analytics/top-posts', {
      platforms: params.platforms?.join(','),
      startDate: params.startDate,
      endDate: params.endDate,
      metric: params.metric || 'engagement',
      limit: params.limit || 10
    });

    if (!response.success || !response.data) {
      throw new Error(response.error?.message || 'Failed to get top posts');
    }

    return response.data;
  }

  /**
   * Get platform performance comparison
   */
  async getPlatformComparison(params: {
    platforms: Platform[];
    startDate?: string;
    endDate?: string;
  }): Promise<Array<{
    platform: Platform;
    totalPosts: number;
    averageViews: number;
    averageLikes: number;
    averageShares: number;
    averageComments: number;
    averageEngagement: number;
    averageEngagementRate: number;
    bestPostingTime: string;
    bestPostingDay: string;
  }>> {
    const response = await this.client.get<any>('/analytics/platform-comparison', {
      platforms: params.platforms.join(','),
      startDate: params.startDate,
      endDate: params.endDate
    });

    if (!response.success || !response.data) {
      throw new Error(response.error?.message || 'Failed to get platform comparison');
    }

    return response.data;
  }

  /**
   * Get audience demographics
   */
  async getAudienceDemographics(params: {
    platforms?: Platform[];
    startDate?: string;
    endDate?: string;
  }): Promise<{
    totalAudience: number;
    byAge: Array<{
      range: string;
      count: number;
      percentage: number;
    }>;
    byGender: Array<{
      gender: string;
      count: number;
      percentage: number;
    }>;
    byLocation: Array<{
      country: string;
      city?: string;
      count: number;
      percentage: number;
    }>;
    byLanguage: Array<{
      language: string;
      count: number;
      percentage: number;
    }>;
  }> {
    const response = await this.client.get<any>('/analytics/demographics', {
      platforms: params.platforms?.join(','),
      startDate: params.startDate,
      endDate: params.endDate
    });

    if (!response.success || !response.data) {
      throw new Error(response.error?.message || 'Failed to get audience demographics');
    }

    return response.data;
  }

  /**
   * Get engagement insights
   */
  async getEngagementInsights(params: {
    postIds?: string[];
    platforms?: Platform[];
    startDate?: string;
    endDate?: string;
  }): Promise<{
    averageEngagementRate: number;
    bestEngagementTime: string;
    bestEngagementDay: string;
    engagementTrend: 'up' | 'down' | 'stable';
    engagementTrendPercentage: number;
    topHashtags: Array<{
      hashtag: string;
      usageCount: number;
      averageEngagement: number;
    }>;
    topMentions: Array<{
      mention: string;
      usageCount: number;
      averageEngagement: number;
    }>;
  }> {
    const response = await this.client.get<any>('/analytics/engagement-insights', {
      postIds: params.postIds?.join(','),
      platforms: params.platforms?.join(','),
      startDate: params.startDate,
      endDate: params.endDate
    });

    if (!response.success || !response.data) {
      throw new Error(response.error?.message || 'Failed to get engagement insights');
    }

    return response.data;
  }

  /**
   * Get content performance by type
   */
  async getContentPerformance(params: {
    platforms?: Platform[];
    startDate?: string;
    endDate?: string;
  }): Promise<Array<{
    contentType: 'text' | 'image' | 'video' | 'link';
    count: number;
    averageViews: number;
    averageLikes: number;
    averageShares: number;
    averageComments: number;
    averageEngagementRate: number;
  }>> {
    const response = await this.client.get<any>('/analytics/content-performance', {
      platforms: params.platforms?.join(','),
      startDate: params.startDate,
      endDate: params.endDate
    });

    if (!response.success || !response.data) {
      throw new Error(response.error?.message || 'Failed to get content performance');
    }

    return response.data;
  }

  /**
   * Get posting frequency analysis
   */
  async getPostingFrequency(params: {
    platforms?: Platform[];
    startDate?: string;
    endDate?: string;
  }): Promise<{
    totalPosts: number;
    averagePostsPerDay: number;
    averagePostsPerWeek: number;
    averagePostsPerMonth: number;
    byDayOfWeek: Array<{
      day: string;
      count: number;
      averageEngagement: number;
    }>;
    byHourOfDay: Array<{
      hour: number;
      count: number;
      averageEngagement: number;
    }>;
  }> {
    const response = await this.client.get<any>('/analytics/posting-frequency', {
      platforms: params.platforms?.join(','),
      startDate: params.startDate,
      endDate: params.endDate
    });

    if (!response.success || !response.data) {
      throw new Error(response.error?.message || 'Failed to get posting frequency');
    }

    return response.data;
  }

  /**
   * Export analytics report
   */
  async exportReport(params: {
    postIds?: string[];
    platforms?: Platform[];
    startDate?: string;
    endDate?: string;
    format?: 'csv' | 'xlsx' | 'pdf';
  }): Promise<Buffer> {
    const response = await this.client.post<any>('/analytics/export', params);

    if (!response.success || !response.data) {
      throw new Error(response.error?.message || 'Failed to export report');
    }

    // Download the report file
    const fileUrl = response.data.downloadUrl;
    return await this.client.download(fileUrl);
  }

  /**
   * Get real-time analytics
   */
  async getRealTimeAnalytics(postId: string): Promise<{
    postId: string;
    currentViews: number;
    currentLikes: number;
    currentShares: number;
    currentComments: number;
    viewsPerMinute: number;
    likesPerMinute: number;
    lastUpdated: string;
  }> {
    const response = await this.client.get<any>(
      `/analytics/real-time/${postId}`
    );

    if (!response.success || !response.data) {
      throw new Error(response.error?.message || 'Failed to get real-time analytics');
    }

    return response.data;
  }

  /**
   * Get competitor analysis
   */
  async getCompetitorAnalysis(params: {
    competitorIds: string[];
    platforms?: Platform[];
    startDate?: string;
    endDate?: string;
  }): Promise<Array<{
    competitorId: string;
    competitorName: string;
    totalPosts: number;
    averageEngagement: number;
    averageEngagementRate: number;
    followerGrowth: number;
    topPosts: Array<{
      postId: string;
      content: string;
      engagement: number;
    }>;
  }>> {
    const response = await this.client.get<any>('/analytics/competitors', {
      competitorIds: params.competitorIds.join(','),
      platforms: params.platforms?.join(','),
      startDate: params.startDate,
      endDate: params.endDate
    });

    if (!response.success || !response.data) {
      throw new Error(response.error?.message || 'Failed to get competitor analysis');
    }

    return response.data;
  }
}
