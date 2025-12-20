/**
 * Metabase Integration Package
 *
 * Provides JWT-signed embedding URLs for Metabase dashboards and questions
 *
 * @package @kpi/integrations-metabase
 * @version 1.0.0
 */

import jwt from 'jsonwebtoken';
import axios, { AxiosInstance } from 'axios';
import { z } from 'zod';

// ============================================================================
// Configuration Schemas
// ============================================================================

export const MetabaseConfigSchema = z.object({
  baseUrl: z.string().url(),
  apiKey: z.string().min(1),
  secretKey: z.string().min(1), // For JWT signing
});

export type MetabaseConfig = z.infer<typeof MetabaseConfigSchema>;

// ============================================================================
// Dashboard & Question Schemas
// ============================================================================

export const DashboardParamsSchema = z.record(z.unknown());

export const EmbedOptionsSchema = z.object({
  dashboardId: z.number().optional(),
  questionId: z.number().optional(),
  params: DashboardParamsSchema.optional(),
  theme: z.enum(['light', 'dark']).optional(),
  bordered: z.boolean().optional(),
  titled: z.boolean().optional(),
});

export type EmbedOptions = z.infer<typeof EmbedOptionsSchema>;

// ============================================================================
// API Response Schemas
// ============================================================================

export const DashboardSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string().nullable(),
  collection_id: z.number().nullable(),
  created_at: z.string(),
  updated_at: z.string(),
});

export const QuestionSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string().nullable(),
  collection_id: z.number().nullable(),
  query_type: z.string(),
  created_at: z.string(),
  updated_at: z.string(),
});

export type Dashboard = z.infer<typeof DashboardSchema>;
export type Question = z.infer<typeof QuestionSchema>;

// ============================================================================
// Metabase Integration Class
// ============================================================================

export class MetabaseIntegration {
  private config: MetabaseConfig;
  private client: AxiosInstance;

  constructor(config: MetabaseConfig) {
    this.config = MetabaseConfigSchema.parse(config);

    this.client = axios.create({
      baseURL: this.config.baseUrl,
      headers: {
        'X-API-KEY': this.config.apiKey,
        'Content-Type': 'application/json',
      },
    });
  }

  // ============================================================================
  // Embed URL Generation (JWT-signed)
  // ============================================================================

  /**
   * Generate JWT-signed embed URL for a dashboard
   *
   * @param dashboardId - The ID of the dashboard to embed
   * @param params - Optional parameters to pass to the dashboard (filters, etc.)
   * @param options - Additional embed options (theme, bordered, titled)
   * @returns Signed embed URL
   *
   * @example
   * ```typescript
   * const url = metabase.getEmbedDashboardUrl(42, {
   *   business_line_id: 1,
   *   date_from: '2025-01-01'
   * });
   * ```
   */
  getEmbedDashboardUrl(
    dashboardId: number,
    params?: Record<string, unknown>,
    options?: { theme?: 'light' | 'dark'; bordered?: boolean; titled?: boolean }
  ): string {
    const payload = {
      resource: { dashboard: dashboardId },
      params: params || {},
      exp: Math.round(Date.now() / 1000) + (60 * 60), // 1 hour expiry
    };

    const token = jwt.sign(payload, this.config.secretKey);

    const queryParams = new URLSearchParams();
    if (options?.theme) queryParams.append('theme', options.theme);
    if (options?.bordered !== undefined) queryParams.append('bordered', String(options.bordered));
    if (options?.titled !== undefined) queryParams.append('titled', String(options.titled));

    const queryString = queryParams.toString();
    return `${this.config.baseUrl}/embed/dashboard/${token}${queryString ? '?' + queryString : ''}`;
  }

  /**
   * Generate JWT-signed embed URL for a question (single chart/table)
   *
   * @param questionId - The ID of the question to embed
   * @param params - Optional parameters to pass to the question
   * @param options - Additional embed options
   * @returns Signed embed URL
   *
   * @example
   * ```typescript
   * const url = metabase.getEmbedQuestionUrl(15, {
   *   platform_id: 5
   * });
   * ```
   */
  getEmbedQuestionUrl(
    questionId: number,
    params?: Record<string, unknown>,
    options?: { theme?: 'light' | 'dark'; bordered?: boolean; titled?: boolean }
  ): string {
    const payload = {
      resource: { question: questionId },
      params: params || {},
      exp: Math.round(Date.now() / 1000) + (60 * 60), // 1 hour expiry
    };

    const token = jwt.sign(payload, this.config.secretKey);

    const queryParams = new URLSearchParams();
    if (options?.theme) queryParams.append('theme', options.theme);
    if (options?.bordered !== undefined) queryParams.append('bordered', String(options.bordered));
    if (options?.titled !== undefined) queryParams.append('titled', String(options.titled));

    const queryString = queryParams.toString();
    return `${this.config.baseUrl}/embed/question/${token}${queryString ? '?' + queryString : ''}`;
  }

  // ============================================================================
  // Dashboard Management
  // ============================================================================

  /**
   * List all dashboards
   */
  async listDashboards(): Promise<Dashboard[]> {
    try {
      const response = await this.client.get('/api/dashboard');
      return z.array(DashboardSchema).parse(response.data);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(`Failed to list dashboards: ${error.response?.data?.message || error.message}`);
      }
      throw error;
    }
  }

  /**
   * Get a specific dashboard by ID
   */
  async getDashboard(dashboardId: number): Promise<Dashboard> {
    try {
      const response = await this.client.get(`/api/dashboard/${dashboardId}`);
      return DashboardSchema.parse(response.data);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(`Failed to get dashboard ${dashboardId}: ${error.response?.data?.message || error.message}`);
      }
      throw error;
    }
  }

  // ============================================================================
  // Question Management
  // ============================================================================

  /**
   * List all questions
   */
  async listQuestions(): Promise<Question[]> {
    try {
      const response = await this.client.get('/api/card');
      return z.array(QuestionSchema).parse(response.data);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(`Failed to list questions: ${error.response?.data?.message || error.message}`);
      }
      throw error;
    }
  }

  /**
   * Get a specific question by ID
   */
  async getQuestion(questionId: number): Promise<Question> {
    try {
      const response = await this.client.get(`/api/card/${questionId}`);
      return QuestionSchema.parse(response.data);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(`Failed to get question ${questionId}: ${error.response?.data?.message || error.message}`);
      }
      throw error;
    }
  }

  // ============================================================================
  // Query Execution
  // ============================================================================

  /**
   * Execute a native SQL query and return results
   *
   * @param databaseId - The ID of the database to query
   * @param sql - The SQL query to execute
   * @returns Query results
   *
   * @example
   * ```typescript
   * const results = await metabase.executeQuery(1, `
   *   SELECT platform_name, COUNT(*) as post_count
   *   FROM posts
   *   WHERE created_at >= CURRENT_DATE - INTERVAL '30 days'
   *   GROUP BY platform_name
   * `);
   * ```
   */
  async executeQuery(databaseId: number, sql: string): Promise<unknown> {
    try {
      const response = await this.client.post('/api/dataset', {
        database: databaseId,
        type: 'native',
        native: {
          query: sql,
        },
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(`Failed to execute query: ${error.response?.data?.message || error.message}`);
      }
      throw error;
    }
  }
}

// ============================================================================
// Pre-built SQL Queries for KPI Platform
// ============================================================================

export const MetabaseQueries = {
  /**
   * Funnel Analysis Query
   * Shows conversion rates across the entire funnel: 홍보 → 유입 → 문의 → 미팅 → 거래
   */
  funnelAnalysis: `
    WITH funnel_data AS (
      SELECT
        bl.name as business_line,
        COUNT(DISTINCT p.id) as promotion_count,
        COUNT(DISTINCT lv.id) as landing_visits,
        COUNT(DISTINCT l.id) as leads,
        COUNT(DISTINCT m.id) as meetings,
        COUNT(DISTINCT CASE WHEN d.status = 'won' THEN d.id END) as deals_won,
        SUM(CASE WHEN d.status = 'won' THEN d.amount ELSE 0 END) as total_revenue
      FROM business_lines bl
      LEFT JOIN posts p ON p.business_line_id = bl.id
      LEFT JOIN landing_visits lv ON lv.business_line_id = bl.id
      LEFT JOIN leads l ON l.business_line_id = bl.id
      LEFT JOIN meetings m ON m.business_line_id = bl.id
      LEFT JOIN deals d ON d.business_line_id = bl.id
      WHERE
        p.created_at >= {{date_from}}
        AND p.created_at <= {{date_to}}
      GROUP BY bl.id, bl.name
    )
    SELECT
      business_line,
      promotion_count,
      landing_visits,
      leads,
      meetings,
      deals_won,
      total_revenue,
      ROUND(100.0 * landing_visits / NULLIF(promotion_count, 0), 2) as visit_rate,
      ROUND(100.0 * leads / NULLIF(landing_visits, 0), 2) as lead_conversion_rate,
      ROUND(100.0 * meetings / NULLIF(leads, 0), 2) as meeting_rate,
      ROUND(100.0 * deals_won / NULLIF(meetings, 0), 2) as close_rate,
      ROUND(100.0 * deals_won / NULLIF(landing_visits, 0), 2) as overall_conversion_rate
    FROM funnel_data
    ORDER BY total_revenue DESC
  `,

  /**
   * Platform ROI Analysis Query
   * Calculates ROI for each platform based on post performance
   */
  platformROI: `
    WITH platform_metrics AS (
      SELECT
        pl.name as platform_name,
        pl.category,
        COUNT(DISTINCT p.id) as post_count,
        SUM(p.likes) as total_likes,
        SUM(p.comments) as total_comments,
        SUM(p.shares) as total_shares,
        SUM(p.views) as total_views,
        COUNT(DISTINCT lv.id) as generated_visits,
        COUNT(DISTINCT l.id) as generated_leads,
        COUNT(DISTINCT CASE WHEN d.status = 'won' THEN d.id END) as generated_deals,
        SUM(CASE WHEN d.status = 'won' THEN d.amount ELSE 0 END) as generated_revenue
      FROM platforms pl
      LEFT JOIN posts p ON p.platform_id = pl.id
      LEFT JOIN landing_visits lv ON lv.utm_source = pl.name
      LEFT JOIN leads l ON l.id = lv.lead_id
      LEFT JOIN deals d ON d.lead_id = l.id
      WHERE
        p.created_at >= {{date_from}}
        AND p.created_at <= {{date_to}}
      GROUP BY pl.id, pl.name, pl.category
    )
    SELECT
      platform_name,
      category,
      post_count,
      total_views,
      total_likes + total_comments + total_shares as total_engagement,
      generated_visits,
      generated_leads,
      generated_deals,
      generated_revenue,
      ROUND(generated_revenue / NULLIF(post_count, 0), 2) as revenue_per_post,
      ROUND(100.0 * generated_leads / NULLIF(generated_visits, 0), 2) as visit_to_lead_rate,
      ROUND(100.0 * generated_deals / NULLIF(generated_leads, 0), 2) as lead_to_deal_rate,
      ROUND(generated_revenue / NULLIF(generated_visits, 0), 2) as revenue_per_visit
    FROM platform_metrics
    WHERE post_count > 0
    ORDER BY generated_revenue DESC
  `,

  /**
   * Weekly Performance Trend Query
   * Shows week-over-week performance metrics
   */
  weeklyTrend: `
    SELECT
      DATE_TRUNC('week', p.created_at) as week_start,
      COUNT(DISTINCT p.id) as posts,
      COUNT(DISTINCT lv.id) as visits,
      COUNT(DISTINCT l.id) as leads,
      COUNT(DISTINCT m.id) as meetings,
      COUNT(DISTINCT CASE WHEN d.status = 'won' THEN d.id END) as deals,
      SUM(CASE WHEN d.status = 'won' THEN d.amount ELSE 0 END) as revenue,
      ROUND(100.0 * COUNT(DISTINCT l.id) / NULLIF(COUNT(DISTINCT lv.id), 0), 2) as conversion_rate
    FROM posts p
    LEFT JOIN landing_visits lv ON DATE_TRUNC('week', lv.visited_at) = DATE_TRUNC('week', p.created_at)
    LEFT JOIN leads l ON l.id = lv.lead_id
    LEFT JOIN meetings m ON m.lead_id = l.id AND DATE_TRUNC('week', m.scheduled_at) = DATE_TRUNC('week', p.created_at)
    LEFT JOIN deals d ON d.lead_id = l.id AND DATE_TRUNC('week', d.created_at) = DATE_TRUNC('week', p.created_at)
    WHERE
      p.created_at >= {{date_from}}
      AND p.created_at <= {{date_to}}
    GROUP BY week_start
    ORDER BY week_start DESC
  `,

  /**
   * Lead Source Attribution Query
   * Tracks which campaigns and UTM sources generate the most valuable leads
   */
  leadSourceAttribution: `
    SELECT
      lv.utm_source,
      lv.utm_medium,
      lv.utm_campaign,
      COUNT(DISTINCT lv.id) as total_visits,
      COUNT(DISTINCT l.id) as leads_generated,
      COUNT(DISTINCT CASE WHEN d.status = 'won' THEN d.id END) as deals_closed,
      SUM(CASE WHEN d.status = 'won' THEN d.amount ELSE 0 END) as total_revenue,
      ROUND(100.0 * COUNT(DISTINCT l.id) / NULLIF(COUNT(DISTINCT lv.id), 0), 2) as visit_to_lead_rate,
      ROUND(100.0 * COUNT(DISTINCT CASE WHEN d.status = 'won' THEN d.id END) / NULLIF(COUNT(DISTINCT l.id), 0), 2) as lead_to_deal_rate,
      ROUND(SUM(CASE WHEN d.status = 'won' THEN d.amount ELSE 0 END) / NULLIF(COUNT(DISTINCT lv.id), 0), 2) as revenue_per_visit
    FROM landing_visits lv
    LEFT JOIN leads l ON l.id = lv.lead_id
    LEFT JOIN deals d ON d.lead_id = l.id
    WHERE
      lv.visited_at >= {{date_from}}
      AND lv.visited_at <= {{date_to}}
    GROUP BY lv.utm_source, lv.utm_medium, lv.utm_campaign
    HAVING COUNT(DISTINCT lv.id) > 0
    ORDER BY total_revenue DESC, leads_generated DESC
  `,

  /**
   * Business Line Comparison Query
   * Compare performance across different business lines
   */
  businessLineComparison: `
    SELECT
      bl.name as business_line,
      COUNT(DISTINCT p.id) as total_posts,
      COUNT(DISTINCT lv.id) as total_visits,
      COUNT(DISTINCT l.id) as total_leads,
      COUNT(DISTINCT m.id) as total_meetings,
      COUNT(DISTINCT d.id) as total_deals,
      COUNT(DISTINCT CASE WHEN d.status = 'won' THEN d.id END) as deals_won,
      COUNT(DISTINCT CASE WHEN d.status = 'lost' THEN d.id END) as deals_lost,
      SUM(CASE WHEN d.status = 'won' THEN d.amount ELSE 0 END) as total_revenue,
      ROUND(AVG(CASE WHEN d.status = 'won' THEN d.amount END), 2) as avg_deal_size,
      ROUND(100.0 * COUNT(DISTINCT CASE WHEN d.status = 'won' THEN d.id END) / NULLIF(COUNT(DISTINCT m.id), 0), 2) as win_rate
    FROM business_lines bl
    LEFT JOIN posts p ON p.business_line_id = bl.id
    LEFT JOIN landing_visits lv ON lv.business_line_id = bl.id
    LEFT JOIN leads l ON l.business_line_id = bl.id
    LEFT JOIN meetings m ON m.business_line_id = bl.id
    LEFT JOIN deals d ON d.business_line_id = bl.id
    WHERE
      bl.created_at >= {{date_from}}
    GROUP BY bl.id, bl.name
    ORDER BY total_revenue DESC
  `,
};

// ============================================================================
// Exports
// ============================================================================

export default MetabaseIntegration;
