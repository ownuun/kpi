/**
 * Metabase Utility Functions
 * Helper functions for embedding, JWT generation, and iframe creation
 */

import * as crypto from 'crypto';
import type { EmbedUrlOptions, SignedEmbedUrl, EmbeddingConfig } from '../types';

/**
 * Generate JWT token for signed embedding
 * @param secretKey - Metabase embedding secret key
 * @param payload - Payload to sign
 * @returns Signed JWT token
 */
export function generateEmbedToken(
  secretKey: string,
  payload: EmbeddingConfig
): string {
  // Create header
  const header = {
    alg: 'HS256',
    typ: 'JWT',
  };

  const encodedHeader = base64UrlEncode(JSON.stringify(header));
  const encodedPayload = base64UrlEncode(JSON.stringify(payload));

  // Create signature
  const signature = crypto
    .createHmac('sha256', secretKey)
    .update(`${encodedHeader}.${encodedPayload}`)
    .digest('base64url');

  return `${encodedHeader}.${encodedPayload}.${signature}`;
}

/**
 * Base64 URL encode
 */
function base64UrlEncode(str: string): string {
  return Buffer.from(str)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
}

/**
 * Generate signed embedding URL for dashboard or question
 * @param baseUrl - Metabase base URL
 * @param secretKey - Metabase embedding secret key
 * @param options - Embedding options
 * @returns Signed URL with token
 */
export function generateSignedEmbedUrl(
  baseUrl: string,
  secretKey: string,
  options: EmbedUrlOptions
): SignedEmbedUrl {
  const { dashboardId, questionId, params = {}, expiresIn = 600 } = options;

  if (!dashboardId && !questionId) {
    throw new Error('Either dashboardId or questionId must be provided');
  }

  // Calculate expiration time
  const exp = Math.floor(Date.now() / 1000) + expiresIn;

  // Create payload
  const payload: EmbeddingConfig = {
    resource: dashboardId
      ? { dashboard: dashboardId }
      : { question: questionId },
    params,
    exp,
  };

  // Generate token
  const token = generateEmbedToken(secretKey, payload);

  // Build URL
  const resourceType = dashboardId ? 'dashboard' : 'question';
  const resourceId = dashboardId || questionId;
  const queryParams = buildQueryParams(options);
  const queryString = queryParams ? `?${queryParams}` : '';

  const url = `${baseUrl}/embed/${resourceType}/${token}${queryString}`;

  return {
    url,
    token,
    expiresAt: new Date(exp * 1000),
  };
}

/**
 * Build query parameters for embedding URL
 */
function buildQueryParams(options: EmbedUrlOptions): string {
  const params: string[] = [];

  if (options.theme) {
    params.push(`theme=${options.theme}`);
  }

  if (options.bordered === false) {
    params.push('bordered=false');
  }

  if (options.titled === false) {
    params.push('titled=false');
  }

  if (options.hideParameters !== undefined) {
    const value =
      typeof options.hideParameters === 'boolean'
        ? options.hideParameters.toString()
        : options.hideParameters;
    params.push(`hide_parameters=${value}`);
  }

  if (options.hideDownloadButton) {
    params.push('hide_download_button=true');
  }

  return params.join('&');
}

/**
 * Generate iframe HTML for embedded dashboard or question
 * @param embedUrl - Signed embed URL
 * @param options - iframe options
 * @returns HTML string for iframe
 */
export function generateIframeHtml(
  embedUrl: string,
  options?: {
    width?: string | number;
    height?: string | number;
    frameBorder?: number;
    allowTransparency?: boolean;
    style?: string;
    className?: string;
  }
): string {
  const {
    width = '100%',
    height = '600',
    frameBorder = 0,
    allowTransparency = true,
    style,
    className,
  } = options || {};

  const attributes: string[] = [
    `src="${embedUrl}"`,
    `width="${width}"`,
    `height="${height}"`,
    `frameborder="${frameBorder}"`,
  ];

  if (allowTransparency) {
    attributes.push('allowtransparency="true"');
  }

  if (style) {
    attributes.push(`style="${style}"`);
  }

  if (className) {
    attributes.push(`class="${className}"`);
  }

  return `<iframe ${attributes.join(' ')}></iframe>`;
}

/**
 * Generate React component code for embedded dashboard/question
 * @param embedUrl - Signed embed URL
 * @param options - Component options
 * @returns React component code as string
 */
export function generateReactEmbedComponent(
  embedUrl: string,
  options?: {
    componentName?: string;
    width?: string | number;
    height?: string | number;
    className?: string;
    style?: Record<string, any>;
  }
): string {
  const {
    componentName = 'MetabaseEmbed',
    width = '100%',
    height = 600,
    className,
    style,
  } = options || {};

  const styleObj = style
    ? JSON.stringify(style, null, 2)
    : `{
    width: '${width}',
    height: '${height}',
    border: 'none',
  }`;

  const classNameProp = className ? `\n  className="${className}"` : '';

  return `
import React from 'react';

export const ${componentName}: React.FC = () => {
  return (
    <iframe
      src="${embedUrl}"
      frameBorder="0"
      allowTransparency${classNameProp}
      style={${styleObj}}
    />
  );
};
`.trim();
}

/**
 * Parse parameters from URL query string
 * @param queryString - URL query string
 * @returns Parsed parameters object
 */
export function parseEmbedParameters(
  queryString: string
): Record<string, any> {
  const params: Record<string, any> = {};
  const searchParams = new URLSearchParams(queryString);

  searchParams.forEach((value, key) => {
    // Try to parse as JSON for complex values
    try {
      params[key] = JSON.parse(value);
    } catch {
      params[key] = value;
    }
  });

  return params;
}

/**
 * Validate embedding secret key format
 * @param secretKey - Secret key to validate
 * @returns true if valid, throws error otherwise
 */
export function validateSecretKey(secretKey: string): boolean {
  if (!secretKey || typeof secretKey !== 'string') {
    throw new Error('Secret key must be a non-empty string');
  }

  if (secretKey.length < 32) {
    throw new Error('Secret key should be at least 32 characters long');
  }

  return true;
}

/**
 * Create parameter mapping for locked/enabled parameters
 * @param params - Parameters to map
 * @param defaultType - Default parameter type
 * @returns Parameter mapping for Metabase embedding config
 */
export function createParameterMapping(
  params: Record<string, any>,
  defaultType: 'enabled' | 'disabled' | 'locked' = 'enabled'
): Record<string, 'enabled' | 'disabled' | 'locked'> {
  const mapping: Record<string, 'enabled' | 'disabled' | 'locked'> = {};

  Object.keys(params).forEach((key) => {
    mapping[key] = defaultType;
  });

  return mapping;
}

/**
 * Build public URL for shared dashboard/question
 * @param baseUrl - Metabase base URL
 * @param publicUuid - Public sharing UUID
 * @param resourceType - Type of resource (dashboard or question)
 * @returns Public URL
 */
export function buildPublicUrl(
  baseUrl: string,
  publicUuid: string,
  resourceType: 'dashboard' | 'question'
): string {
  return `${baseUrl}/public/${resourceType}/${publicUuid}`;
}

/**
 * Extract resource ID from Metabase URL
 * @param url - Metabase URL
 * @returns Resource ID and type
 */
export function extractResourceFromUrl(url: string): {
  id: number | null;
  type: 'dashboard' | 'question' | null;
} {
  const dashboardMatch = url.match(/\/dashboard\/(\d+)/);
  if (dashboardMatch) {
    return {
      id: parseInt(dashboardMatch[1], 10),
      type: 'dashboard',
    };
  }

  const questionMatch = url.match(/\/question\/(\d+)/);
  if (questionMatch) {
    return {
      id: parseInt(questionMatch[1], 10),
      type: 'question',
    };
  }

  return { id: null, type: null };
}

/**
 * Format filter parameters for Metabase query
 * @param filters - Filter object
 * @returns Formatted filter array
 */
export function formatFilters(
  filters: Record<string, any>
): Array<[string, string, any]> {
  return Object.entries(filters).map(([field, value]) => {
    if (Array.isArray(value)) {
      return ['=', ['field', field, null], value];
    }
    return ['=', ['field', field, null], value];
  });
}

/**
 * Create download URL for query results
 * @param baseUrl - Metabase base URL
 * @param cardId - Card/question ID
 * @param format - Export format
 * @returns Download URL
 */
export function createDownloadUrl(
  baseUrl: string,
  cardId: number,
  format: 'csv' | 'json' | 'xlsx' = 'csv'
): string {
  return `${baseUrl}/api/card/${cardId}/query/${format}`;
}

/**
 * Utilities for working with Metabase colors
 */
export const METABASE_COLORS = {
  brand: '#509EE3',
  summarize: '#88BF4D',
  filter: '#A989C5',
  success: '#84BB4C',
  danger: '#ED6E6E',
  warning: '#F9CF48',
  text: {
    dark: '#4C5773',
    medium: '#696E7B',
    light: '#949AAB',
  },
  background: {
    light: '#F9FBFC',
    medium: '#EDF2F5',
  },
} as const;

/**
 * Get color for visualization type
 */
export function getVisualizationColor(type: string): string {
  const colorMap: Record<string, string> = {
    bar: METABASE_COLORS.brand,
    line: '#88BF4D',
    pie: '#A989C5',
    area: '#509EE3',
    scatter: '#F9CF48',
    funnel: '#EF8C8C',
  };

  return colorMap[type] || METABASE_COLORS.brand;
}
