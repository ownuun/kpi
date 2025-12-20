/**
 * @kpi-with-agents/twenty-crm-client
 *
 * TypeScript client for Twenty CRM GraphQL API
 */

export { TwentyGraphQLClient, TwentyCRMClientConfig } from './client/graphql-client';
export { PersonService } from './services/person-service';
export { CompanyService } from './services/company-service';

// Types
export * from './types/common';
export * from './types/person';
export * from './types/company';

// Main client class
import { TwentyGraphQLClient, TwentyCRMClientConfig } from './client/graphql-client';
import { PersonService } from './services/person-service';
import { CompanyService } from './services/company-service';

export class TwentyCRMClient {
  private graphqlClient: TwentyGraphQLClient;

  public readonly people: PersonService;
  public readonly companies: CompanyService;

  constructor(config: TwentyCRMClientConfig) {
    this.graphqlClient = new TwentyGraphQLClient(config);
    this.people = new PersonService(this.graphqlClient);
    this.companies = new CompanyService(this.graphqlClient);
  }

  /**
   * Update the authentication token
   */
  updateToken(token: string): void {
    this.graphqlClient.updateToken(token);
  }

  /**
   * Execute a custom GraphQL query
   */
  async query<T>(query: string, variables?: any): Promise<T> {
    return this.graphqlClient.request<T>(query, variables);
  }
}
