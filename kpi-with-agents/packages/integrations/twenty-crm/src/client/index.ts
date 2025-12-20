/**
 * Twenty CRM GraphQL Client
 * Wrapper for Twenty CRM GraphQL API
 */

import axios, { AxiosInstance, AxiosError } from 'axios';
import type {
  TwentyConfig,
  Person,
  CreatePersonInput,
  UpdatePersonInput,
  Company,
  CreateCompanyInput,
  Opportunity,
  CreateOpportunityInput,
  UpdateOpportunityInput,
  Activity,
  CreateActivityInput,
  GraphQLResponse,
  PaginatedResponse,
  QueryOptions,
  TwentyApiError,
} from '../types';

export class TwentyClient {
  private client: AxiosInstance;
  private config: TwentyConfig;

  constructor(config: TwentyConfig) {
    this.config = config;
    this.client = axios.create({
      baseURL: `${config.apiUrl}/graphql`,
      timeout: config.timeout || 30000,
      headers: {
        'Authorization': `Bearer ${config.apiKey}`,
        'Content-Type': 'application/json',
      },
    });

    // Error interceptor
    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        const apiError: TwentyApiError = {
          message: error.message,
          code: error.code || 'UNKNOWN_ERROR',
          statusCode: error.response?.status || 500,
        };
        throw apiError;
      }
    );
  }

  /**
   * Execute a GraphQL query
   */
  private async query<T>(query: string, variables?: any): Promise<T> {
    const response = await this.client.post<GraphQLResponse<T>>('', {
      query,
      variables,
    });

    if (response.data.errors) {
      throw new Error(
        response.data.errors.map((e) => e.message).join(', ')
      );
    }

    return response.data.data!;
  }

  // ========================================
  // Person (Lead) Operations
  // ========================================

  /**
   * Create a new person (lead)
   */
  async createPerson(input: CreatePersonInput): Promise<Person> {
    const mutation = `
      mutation CreatePerson($input: PersonCreateInput!) {
        createPerson(data: $input) {
          id
          name
          email
          phone
          city
          jobTitle
          companyId
          createdAt
          updatedAt
        }
      }
    `;

    const result = await this.query<{ createPerson: Person }>(mutation, {
      input,
    });

    return result.createPerson;
  }

  /**
   * Get person by ID
   */
  async getPerson(id: string): Promise<Person> {
    const query = `
      query GetPerson($id: ID!) {
        person(id: $id) {
          id
          name
          email
          phone
          city
          jobTitle
          companyId
          createdAt
          updatedAt
        }
      }
    `;

    const result = await this.query<{ person: Person }>(query, { id });
    return result.person;
  }

  /**
   * Get all persons with filters
   */
  async getPersons(options: QueryOptions = {}): Promise<Person[]> {
    const query = `
      query GetPersons($limit: Int, $offset: Int) {
        persons(limit: $limit, offset: $offset) {
          edges {
            node {
              id
              name
              email
              phone
              city
              jobTitle
              companyId
              createdAt
              updatedAt
            }
          }
        }
      }
    `;

    const result = await this.query<{ persons: PaginatedResponse<Person> }>(
      query,
      {
        limit: options.limit || 100,
        offset: options.offset || 0,
      }
    );

    return result.persons.edges.map((edge) => edge.node);
  }

  /**
   * Update person
   */
  async updatePerson(id: string, input: UpdatePersonInput): Promise<Person> {
    const mutation = `
      mutation UpdatePerson($id: ID!, $input: PersonUpdateInput!) {
        updatePerson(id: $id, data: $input) {
          id
          name
          email
          phone
          city
          jobTitle
          companyId
          updatedAt
        }
      }
    `;

    const result = await this.query<{ updatePerson: Person }>(mutation, {
      id,
      input,
    });

    return result.updatePerson;
  }

  /**
   * Delete person
   */
  async deletePerson(id: string): Promise<void> {
    const mutation = `
      mutation DeletePerson($id: ID!) {
        deletePerson(id: $id) {
          id
        }
      }
    `;

    await this.query(mutation, { id });
  }

  // ========================================
  // Company Operations
  // ========================================

  /**
   * Create a new company
   */
  async createCompany(input: CreateCompanyInput): Promise<Company> {
    const mutation = `
      mutation CreateCompany($input: CompanyCreateInput!) {
        createCompany(data: $input) {
          id
          name
          domainName
          address
          employees
          linkedinLink
          createdAt
          updatedAt
        }
      }
    `;

    const result = await this.query<{ createCompany: Company }>(mutation, {
      input,
    });

    return result.createCompany;
  }

  /**
   * Get company by ID
   */
  async getCompany(id: string): Promise<Company> {
    const query = `
      query GetCompany($id: ID!) {
        company(id: $id) {
          id
          name
          domainName
          address
          employees
          linkedinLink
          createdAt
          updatedAt
        }
      }
    `;

    const result = await this.query<{ company: Company }>(query, { id });
    return result.company;
  }

  // ========================================
  // Opportunity (Deal) Operations
  // ========================================

  /**
   * Create a new opportunity
   */
  async createOpportunity(
    input: CreateOpportunityInput
  ): Promise<Opportunity> {
    const mutation = `
      mutation CreateOpportunity($input: OpportunityCreateInput!) {
        createOpportunity(data: $input) {
          id
          name
          amount
          stage
          probability
          expectedCloseDate
          personId
          companyId
          createdAt
          updatedAt
        }
      }
    `;

    const result = await this.query<{ createOpportunity: Opportunity }>(
      mutation,
      { input }
    );

    return result.createOpportunity;
  }

  /**
   * Get opportunity by ID
   */
  async getOpportunity(id: string): Promise<Opportunity> {
    const query = `
      query GetOpportunity($id: ID!) {
        opportunity(id: $id) {
          id
          name
          amount
          stage
          probability
          expectedCloseDate
          actualCloseDate
          personId
          companyId
          createdAt
          updatedAt
        }
      }
    `;

    const result = await this.query<{ opportunity: Opportunity }>(query, {
      id,
    });
    return result.opportunity;
  }

  /**
   * Update opportunity
   */
  async updateOpportunity(
    id: string,
    input: UpdateOpportunityInput
  ): Promise<Opportunity> {
    const mutation = `
      mutation UpdateOpportunity($id: ID!, $input: OpportunityUpdateInput!) {
        updateOpportunity(id: $id, data: $input) {
          id
          name
          amount
          stage
          probability
          expectedCloseDate
          actualCloseDate
          updatedAt
        }
      }
    `;

    const result = await this.query<{ updateOpportunity: Opportunity }>(
      mutation,
      {
        id,
        input,
      }
    );

    return result.updateOpportunity;
  }

  /**
   * Get all opportunities
   */
  async getOpportunities(
    options: QueryOptions = {}
  ): Promise<Opportunity[]> {
    const query = `
      query GetOpportunities($limit: Int, $offset: Int) {
        opportunities(limit: $limit, offset: $offset) {
          edges {
            node {
              id
              name
              amount
              stage
              probability
              expectedCloseDate
              personId
              companyId
              createdAt
            }
          }
        }
      }
    `;

    const result = await this.query<{
      opportunities: PaginatedResponse<Opportunity>;
    }>(query, {
      limit: options.limit || 100,
      offset: options.offset || 0,
    });

    return result.opportunities.edges.map((edge) => edge.node);
  }

  // ========================================
  // Activity Operations
  // ========================================

  /**
   * Create a new activity (meeting, call, etc.)
   */
  async createActivity(input: CreateActivityInput): Promise<Activity> {
    const mutation = `
      mutation CreateActivity($input: ActivityCreateInput!) {
        createActivity(data: $input) {
          id
          type
          title
          body
          dueAt
          personId
          companyId
          opportunityId
          createdAt
        }
      }
    `;

    const result = await this.query<{ createActivity: Activity }>(mutation, {
      input,
    });

    return result.createActivity;
  }

  /**
   * Get activities for a person
   */
  async getPersonActivities(personId: string): Promise<Activity[]> {
    const query = `
      query GetPersonActivities($personId: ID!) {
        activities(filter: { personId: { eq: $personId } }) {
          edges {
            node {
              id
              type
              title
              body
              dueAt
              completedAt
              createdAt
            }
          }
        }
      }
    `;

    const result = await this.query<{
      activities: PaginatedResponse<Activity>;
    }>(query, { personId });

    return result.activities.edges.map((edge) => edge.node);
  }

  /**
   * Health check
   */
  async healthCheck(): Promise<boolean> {
    try {
      const query = `
        query {
          __typename
        }
      `;
      await this.query(query);
      return true;
    } catch {
      return false;
    }
  }
}

/**
 * Factory function to create Twenty CRM client
 */
export function createTwentyClient(config: TwentyConfig): TwentyClient {
  return new TwentyClient(config);
}
