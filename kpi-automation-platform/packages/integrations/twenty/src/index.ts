/**
 * Twenty CRM Integration Package
 *
 * GraphQL 기반 CRM 플랫폼 Twenty API 클라이언트
 * People, Companies, Opportunities 관리
 */

import { TwentyClient } from './client';
import { TwentyConfig, Person, Company, Opportunity } from './types';
import * as queries from './queries';
import * as mutations from './mutations';

export * from './types';
export { TwentyClient } from './client';
export * from './queries';
export * from './mutations';

/**
 * Main Twenty SDK Class
 */
export class TwentySDK {
  public readonly client: TwentyClient;

  constructor(config: TwentyConfig) {
    this.client = new TwentyClient(config);
  }

  // ==================== Person Operations ====================

  /**
   * Create a new person
   */
  async createPerson(input: any): Promise<Person> {
    const data = await this.client.mutate(mutations.CREATE_PERSON, { input });
    return data.createPerson;
  }

  /**
   * Get person by ID
   */
  async getPerson(id: string): Promise<Person> {
    const data = await this.client.query(queries.GET_PERSON, { id });
    return data.person;
  }

  /**
   * Update person
   */
  async updatePerson(id: string, input: any): Promise<Person> {
    const data = await this.client.mutate(mutations.UPDATE_PERSON, { id, input });
    return data.updatePerson;
  }

  /**
   * Delete person
   */
  async deletePerson(id: string): Promise<void> {
    await this.client.mutate(mutations.DELETE_PERSON, { id });
  }

  /**
   * List people with pagination and filtering
   */
  async listPeople(params?: any): Promise<any> {
    const data = await this.client.query(queries.LIST_PEOPLE, params);
    return data.people;
  }

  /**
   * Search people
   */
  async searchPeople(query: string, params?: any): Promise<any> {
    const data = await this.client.query(queries.SEARCH_PEOPLE, {
      query,
      ...params
    });
    return data.searchPeople;
  }

  /**
   * Get people by company
   */
  async getPeopleByCompany(companyId: string, params?: any): Promise<any> {
    const data = await this.client.query(queries.GET_PEOPLE_BY_COMPANY, {
      companyId,
      ...params
    });
    return data.peopleByCompany;
  }

  /**
   * Batch create people
   */
  async batchCreatePeople(inputs: any[]): Promise<any> {
    const data = await this.client.mutate(mutations.BATCH_CREATE_PEOPLE, { inputs });
    return data.batchCreatePeople;
  }

  /**
   * Batch delete people
   */
  async batchDeletePeople(ids: string[]): Promise<any> {
    const data = await this.client.mutate(mutations.BATCH_DELETE_PEOPLE, { ids });
    return data.batchDeletePeople;
  }

  // ==================== Company Operations ====================

  /**
   * Create a new company
   */
  async createCompany(input: any): Promise<Company> {
    const data = await this.client.mutate(mutations.CREATE_COMPANY, { input });
    return data.createCompany;
  }

  /**
   * Get company by ID
   */
  async getCompany(id: string): Promise<Company> {
    const data = await this.client.query(queries.GET_COMPANY, { id });
    return data.company;
  }

  /**
   * Update company
   */
  async updateCompany(id: string, input: any): Promise<Company> {
    const data = await this.client.mutate(mutations.UPDATE_COMPANY, { id, input });
    return data.updateCompany;
  }

  /**
   * Delete company
   */
  async deleteCompany(id: string): Promise<void> {
    await this.client.mutate(mutations.DELETE_COMPANY, { id });
  }

  /**
   * List companies with pagination and filtering
   */
  async listCompanies(params?: any): Promise<any> {
    const data = await this.client.query(queries.LIST_COMPANIES, params);
    return data.companies;
  }

  /**
   * Search companies
   */
  async searchCompanies(query: string, params?: any): Promise<any> {
    const data = await this.client.query(queries.SEARCH_COMPANIES, {
      query,
      ...params
    });
    return data.searchCompanies;
  }

  /**
   * Get company with people
   */
  async getCompanyWithPeople(id: string): Promise<any> {
    const data = await this.client.query(queries.GET_COMPANY_WITH_PEOPLE, { id });
    return data.company;
  }

  /**
   * Get company with opportunities
   */
  async getCompanyWithOpportunities(id: string): Promise<any> {
    const data = await this.client.query(queries.GET_COMPANY_WITH_OPPORTUNITIES, { id });
    return data.company;
  }

  /**
   * Batch create companies
   */
  async batchCreateCompanies(inputs: any[]): Promise<any> {
    const data = await this.client.mutate(mutations.BATCH_CREATE_COMPANIES, { inputs });
    return data.batchCreateCompanies;
  }

  /**
   * Batch delete companies
   */
  async batchDeleteCompanies(ids: string[]): Promise<any> {
    const data = await this.client.mutate(mutations.BATCH_DELETE_COMPANIES, { ids });
    return data.batchDeleteCompanies;
  }

  /**
   * Mark company as ICP
   */
  async markAsICP(id: string): Promise<Company> {
    const data = await this.client.mutate(mutations.MARK_AS_ICP, { id });
    return data.markAsICP;
  }

  /**
   * Unmark company as ICP
   */
  async unmarkAsICP(id: string): Promise<Company> {
    const data = await this.client.mutate(mutations.UNMARK_AS_ICP, { id });
    return data.unmarkAsICP;
  }

  // ==================== Opportunity Operations ====================

  /**
   * Create a new opportunity
   */
  async createOpportunity(input: any): Promise<Opportunity> {
    const data = await this.client.mutate(mutations.CREATE_OPPORTUNITY, { input });
    return data.createOpportunity;
  }

  /**
   * Update opportunity
   */
  async updateOpportunity(id: string, input: any): Promise<Opportunity> {
    const data = await this.client.mutate(mutations.UPDATE_OPPORTUNITY, { id, input });
    return data.updateOpportunity;
  }

  /**
   * Delete opportunity
   */
  async deleteOpportunity(id: string): Promise<void> {
    await this.client.mutate(mutations.DELETE_OPPORTUNITY, { id });
  }

  /**
   * Move opportunity to stage
   */
  async moveOpportunityStage(id: string, stage: string): Promise<Opportunity> {
    const data = await this.client.mutate(mutations.MOVE_OPPORTUNITY_STAGE, { id, stage });
    return data.moveOpportunityStage;
  }

  /**
   * Win opportunity
   */
  async winOpportunity(id: string): Promise<Opportunity> {
    const data = await this.client.mutate(mutations.WIN_OPPORTUNITY, { id });
    return data.winOpportunity;
  }

  /**
   * Lose opportunity
   */
  async loseOpportunity(id: string, reason?: string): Promise<Opportunity> {
    const data = await this.client.mutate(mutations.LOSE_OPPORTUNITY, { id, reason });
    return data.loseOpportunity;
  }

  // ==================== Utility Methods ====================

  /**
   * Check if SDK is properly configured
   */
  async healthCheck(): Promise<boolean> {
    return await this.client.healthCheck();
  }

  /**
   * Get SDK version
   */
  getVersion(): string {
    return '0.1.0';
  }

  /**
   * Get GraphQL schema
   */
  async getSchema(): Promise<any> {
    return await this.client.getSchema();
  }
}

/**
 * Create Twenty SDK instance
 */
export function createTwentySDK(config: TwentyConfig): TwentySDK {
  return new TwentySDK(config);
}

/**
 * Default export
 */
export default TwentySDK;
