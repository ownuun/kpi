import { TwentyGraphQLClient } from '../client/graphql-client';
import {
  Person,
  CreatePersonInput,
  UpdatePersonInput,
  PersonFilter,
} from '../types/person';
import { Connection, OrderBy, PaginationParams } from '../types/common';
import {
  GET_PERSON,
  LIST_PEOPLE,
  CREATE_PERSON,
  UPDATE_PERSON,
  DELETE_PERSON,
  FIND_DUPLICATE_PEOPLE,
} from '../queries/person';

export class PersonService {
  constructor(private client: TwentyGraphQLClient) {}

  /**
   * Get a single person by ID
   */
  async get(id: string): Promise<Person> {
    const response = await this.client.request<{ person: Person }>(GET_PERSON, {
      id,
    });
    return response.person;
  }

  /**
   * List people with optional filtering, sorting, and pagination
   */
  async list(options?: {
    filter?: PersonFilter;
    orderBy?: OrderBy;
    pagination?: PaginationParams;
  }): Promise<Connection<Person>> {
    const response = await this.client.request<{ people: Connection<Person> }>(
      LIST_PEOPLE,
      {
        filter: options?.filter,
        orderBy: options?.orderBy,
        first: options?.pagination?.first,
        after: options?.pagination?.after,
      }
    );
    return response.people;
  }

  /**
   * Create a new person
   */
  async create(data: CreatePersonInput): Promise<Person> {
    const response = await this.client.request<{ createPerson: Person }>(
      CREATE_PERSON,
      { data }
    );
    return response.createPerson;
  }

  /**
   * Update an existing person
   */
  async update(id: string, data: UpdatePersonInput): Promise<Person> {
    const response = await this.client.request<{ updatePerson: Person }>(
      UPDATE_PERSON,
      { id, data }
    );
    return response.updatePerson;
  }

  /**
   * Delete a person (soft delete)
   */
  async delete(id: string): Promise<{ id: string }> {
    const response = await this.client.request<{ deletePerson: { id: string } }>(
      DELETE_PERSON,
      { id }
    );
    return response.deletePerson;
  }

  /**
   * Find duplicate people based on email or name
   */
  async findDuplicates(data: {
    emails?: { primaryEmail: string };
    name?: { firstName: string; lastName: string };
  }): Promise<Person[]> {
    const response = await this.client.request<{ findDuplicatePeople: Person[] }>(
      FIND_DUPLICATE_PEOPLE,
      { data }
    );
    return response.findDuplicatePeople;
  }

  /**
   * Search people by name
   */
  async searchByName(query: string, limit = 20): Promise<Connection<Person>> {
    return this.list({
      filter: {
        or: [
          { name: { firstName: { ilike: `%${query}%` } } },
          { name: { lastName: { ilike: `%${query}%` } } },
        ],
      },
      pagination: { first: limit },
    });
  }

  /**
   * Search people by email
   */
  async searchByEmail(email: string): Promise<Connection<Person>> {
    return this.list({
      filter: {
        emails: {
          primaryEmail: { ilike: `%${email}%` },
        },
      },
    });
  }

  /**
   * Get all people for a specific company
   */
  async getByCompany(companyId: string): Promise<Connection<Person>> {
    return this.list({
      filter: {
        companyId: { eq: companyId },
      },
    });
  }

  /**
   * Get people created within a date range
   */
  async getByDateRange(
    startDate: string,
    endDate: string
  ): Promise<Connection<Person>> {
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
