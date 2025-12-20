/**
 * Person GraphQL Queries
 */

/**
 * Get person by ID
 */
export const GET_PERSON = `
  query GetPerson($id: ID!) {
    person(id: $id) {
      id
      firstName
      lastName
      email
      phone
      jobTitle
      companyId
      linkedinUrl
      avatarUrl
      city
      country
      createdAt
      updatedAt
      deletedAt
    }
  }
`;

/**
 * List people with pagination and filtering
 */
export const LIST_PEOPLE = `
  query ListPeople(
    $limit: Int
    $offset: Int
    $orderBy: String
    $orderDirection: OrderDirection
    $filter: PersonFilter
  ) {
    people(
      limit: $limit
      offset: $offset
      orderBy: $orderBy
      orderDirection: $orderDirection
      filter: $filter
    ) {
      items {
        id
        firstName
        lastName
        email
        phone
        jobTitle
        companyId
        linkedinUrl
        avatarUrl
        city
        country
        createdAt
        updatedAt
        deletedAt
      }
      total
      hasMore
      cursor
    }
  }
`;

/**
 * Search people by query
 */
export const SEARCH_PEOPLE = `
  query SearchPeople($query: String!, $limit: Int, $offset: Int) {
    searchPeople(query: $query, limit: $limit, offset: $offset) {
      items {
        id
        firstName
        lastName
        email
        phone
        jobTitle
        companyId
        linkedinUrl
        avatarUrl
        city
        country
        createdAt
        updatedAt
      }
      total
      hasMore
    }
  }
`;

/**
 * Get people by company
 */
export const GET_PEOPLE_BY_COMPANY = `
  query GetPeopleByCompany($companyId: ID!, $limit: Int, $offset: Int) {
    peopleByCompany(companyId: $companyId, limit: $limit, offset: $offset) {
      items {
        id
        firstName
        lastName
        email
        phone
        jobTitle
        linkedinUrl
        avatarUrl
        city
        country
        createdAt
        updatedAt
      }
      total
      hasMore
    }
  }
`;

/**
 * Get person with company details
 */
export const GET_PERSON_WITH_COMPANY = `
  query GetPersonWithCompany($id: ID!) {
    person(id: $id) {
      id
      firstName
      lastName
      email
      phone
      jobTitle
      linkedinUrl
      avatarUrl
      city
      country
      company {
        id
        name
        domainName
        industry
        logoUrl
      }
      createdAt
      updatedAt
    }
  }
`;

/**
 * Get person with opportunities
 */
export const GET_PERSON_WITH_OPPORTUNITIES = `
  query GetPersonWithOpportunities($id: ID!) {
    person(id: $id) {
      id
      firstName
      lastName
      email
      phone
      jobTitle
      opportunities {
        id
        name
        amount
        stage
        probability
        closeDate
      }
      createdAt
      updatedAt
    }
  }
`;

/**
 * Count people by filters
 */
export const COUNT_PEOPLE = `
  query CountPeople($filter: PersonFilter) {
    countPeople(filter: $filter) {
      total
    }
  }
`;

/**
 * Get people by IDs
 */
export const GET_PEOPLE_BY_IDS = `
  query GetPeopleByIds($ids: [ID!]!) {
    peopleByIds(ids: $ids) {
      id
      firstName
      lastName
      email
      phone
      jobTitle
      companyId
      linkedinUrl
      avatarUrl
      city
      country
      createdAt
      updatedAt
    }
  }
`;

/**
 * Get people statistics
 */
export const GET_PEOPLE_STATS = `
  query GetPeopleStats {
    peopleStats {
      total
      withEmail
      withPhone
      withCompany
      byCountry {
        country
        count
      }
      byCity {
        city
        count
      }
    }
  }
`;

/**
 * Get recently created people
 */
export const GET_RECENT_PEOPLE = `
  query GetRecentPeople($limit: Int) {
    recentPeople(limit: $limit) {
      id
      firstName
      lastName
      email
      phone
      jobTitle
      companyId
      createdAt
    }
  }
`;

/**
 * Get recently updated people
 */
export const GET_RECENTLY_UPDATED_PEOPLE = `
  query GetRecentlyUpdatedPeople($limit: Int) {
    recentlyUpdatedPeople(limit: $limit) {
      id
      firstName
      lastName
      email
      phone
      jobTitle
      updatedAt
    }
  }
`;
