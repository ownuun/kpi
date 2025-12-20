import { TwentyGraphQLClient } from '../client/graphql-client';
import {
  Company,
  CreateCompanyInput,
  UpdateCompanyInput,
  CompanyFilter,
} from '../types/company';
import { Connection, OrderBy, PaginationParams } from '../types/common';
import {
  GET_COMPANY,
  LIST_COMPANIES,
  CREATE_COMPANY,
  UPDATE_COMPANY,
  DELETE_COMPANY,
  FIND_DUPLICATE_COMPANIES,
} from '../queries/company';

export class CompanyService {
  constructor(private client: TwentyGraphQLClient) {}

  /**
   * Get a single company by ID
   */
  async get(id: string): Promise<Company> {
    const response = await this.client.request<{ company: Company }>(
      GET_COMPANY,
      { id }
    );
    return response.company;
  }

  /**
   * List companies with optional filtering, sorting, and pagination
   */
  async list(options?: {
    filter?: CompanyFilter;
    orderBy?: OrderBy;
    pagination?: PaginationParams;
  }): Promise<Connection<Company>> {
    const response = await this.client.request<{
      companies: Connection<Company>;
    }>(LIST_COMPANIES, {
      filter: options?.filter,
      orderBy: options?.orderBy,
      first: options?.pagination?.first,
      after: options?.pagination?.after,
    });
    return response.companies;
  }

  /**
   * Create a new company
   */
  async create(data: CreateCompanyInput): Promise<Company> {
    const response = await this.client.request<{ createCompany: Company }>(
      CREATE_COMPANY,
      { data }
    );
    return response.createCompany;
  }

  /**
   * Update an existing company
   */
  async update(id: string, data: UpdateCompanyInput): Promise<Company> {
    const response = await this.client.request<{ updateCompany: Company }>(
      UPDATE_COMPANY,
      { id, data }
    );
    return response.updateCompany;
  }

  /**
   * Delete a company (soft delete)
   */
  async delete(id: string): Promise<{ id: string }> {
    const response = await this.client.request<{
      deleteCompany: { id: string };
    }>(DELETE_COMPANY, { id });
    return response.deleteCompany;
  }

  /**
   * Find duplicate companies based on name or domain
   */
  async findDuplicates(data: {
    name?: string;
    domainName?: { primaryLinkUrl: string };
  }): Promise<Company[]> {
    const response = await this.client.request<{
      findDuplicateCompanies: Company[];
    }>(FIND_DUPLICATE_COMPANIES, { data });
    return response.findDuplicateCompanies;
  }

  /**
   * Search companies by name
   */
  async searchByName(query: string, limit = 20): Promise<Connection<Company>> {
    return this.list({
      filter: {
        name: { ilike: `%${query}%` },
      },
      pagination: { first: limit },
    });
  }

  /**
   * Search companies by domain
   */
  async searchByDomain(domain: string): Promise<Connection<Company>> {
    return this.list({
      filter: {
        domainName: {
          primaryLinkUrl: { ilike: `%${domain}%` },
        },
      },
    });
  }

  /**
   * Get ideal customer profile companies
   */
  async getIdealCustomerProfiles(): Promise<Connection<Company>> {
    return this.list({
      filter: {
        idealCustomerProfile: { eq: true },
      },
    });
  }

  /**
   * Get companies by employee count range
   */
  async getByEmployeeRange(
    min: number,
    max: number
  ): Promise<Connection<Company>> {
    return this.list({
      filter: {
        employees: {
          gte: min,
          lte: max,
        },
      },
    });
  }

  /**
   * Get companies by account owner
   */
  async getByAccountOwner(ownerId: string): Promise<Connection<Company>> {
    return this.list({
      filter: {
        accountOwnerId: { eq: ownerId },
      },
    });
  }

  /**
   * Get companies created within a date range
   */
  async getByDateRange(
    startDate: string,
    endDate: string
  ): Promise<Connection<Company>> {
    return this.list({
      filter: {
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
    });
  }
}
