// Temporary stub for Metabase integration
class MetabaseIntegration {
  private baseUrl: string;
  private apiKey: string;
  private secretKey: string;

  constructor(config: { baseUrl: string; apiKey: string; secretKey: string }) {
    this.baseUrl = config.baseUrl;
    this.apiKey = config.apiKey;
    this.secretKey = config.secretKey;
  }

  async getDashboardUrl(dashboardId: number, params?: Record<string, any>): Promise<string> {
    // Stub implementation
    return `${this.baseUrl}/embed/dashboard/${dashboardId}`;
  }

  async getQuestionUrl(questionId: number, params?: Record<string, any>): Promise<string> {
    // Stub implementation
    return `${this.baseUrl}/embed/question/${questionId}`;
  }
}

/**
 * Server-side Metabase integration instance
 *
 * Used to generate JWT-signed embed URLs for dashboards and questions
 */
export const metabase = new MetabaseIntegration({
  baseUrl: process.env.METABASE_BASE_URL || 'http://localhost:3001',
  apiKey: process.env.METABASE_API_KEY || '',
  secretKey: process.env.METABASE_SECRET_KEY || '',
});

/**
 * Dashboard IDs (these should match your Metabase setup)
 */
export const METABASE_DASHBOARDS = {
  FUNNEL_ANALYSIS: 1,
  PLATFORM_ROI: 2,
  WEEKLY_TREND: 3,
  LEAD_SOURCE_ATTRIBUTION: 4,
  BUSINESS_LINE_COMPARISON: 5,
} as const;

/**
 * Question IDs (these should match your Metabase setup)
 */
export const METABASE_QUESTIONS = {
  REVENUE_CHART: 10,
  CONVERSION_RATE: 11,
  TOP_PLATFORMS: 12,
  RECENT_DEALS: 13,
} as const;
