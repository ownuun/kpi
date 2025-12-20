/**
 * Twenty CRM Client Configuration
 * Initializes and exports the Twenty CRM client for lead management
 */

import { createTwentyClient, TwentyClient } from '@kpi/integrations-twenty-crm';

// Initialize Twenty CRM client
let twentyClient: TwentyClient | null = null;

export function getTwentyClient(): TwentyClient {
  if (!twentyClient) {
    const apiUrl = process.env.TWENTY_CRM_API_URL;
    const apiKey = process.env.TWENTY_CRM_API_KEY;

    if (!apiUrl || !apiKey) {
      throw new Error(
        'Missing Twenty CRM configuration. Please set TWENTY_CRM_API_URL and TWENTY_CRM_API_KEY environment variables.'
      );
    }

    twentyClient = createTwentyClient({
      apiUrl,
      apiKey,
      timeout: 30000,
    });
  }

  return twentyClient;
}

/**
 * Reset client (useful for testing or token refresh)
 */
export function resetTwentyClient(): void {
  twentyClient = null;
}
