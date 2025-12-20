/**
 * Company GraphQL Queries
 */

/**
 * Get company by ID
 */
export const GET_COMPANY = `
  query GetCompany($id: ID!) {
    company(id: $id) {
      id
      name
      domainName
      address
      employees
      industry
      linkedinUrl
      logoUrl
      annualRecurringRevenue
      idealCustomerProfile
      createdAt
      updatedAt
      deletedAt
    }
  }
`;

/**
 * List companies with pagination and filtering
 */
export const LIST_COMPANIES = `
  query ListCompanies(
    $limit: Int
    $offset: Int
    $orderBy: String
    $orderDirection: OrderDirection
    $filter: CompanyFilter
  ) {
    companies(
      limit: $limit
      offset: $offset
      orderBy: $orderBy
      orderDirection: $orderDirection
      filter: $filter
    ) {
      items {
        id
        name
        domainName
        address
        employees
        industry
        linkedinUrl
        logoUrl
        annualRecurringRevenue
        idealCustomerProfile
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
 * Search companies by query
 */
export const SEARCH_COMPANIES = `
  query SearchCompanies($query: String!, $limit: Int, $offset: Int) {
    searchCompanies(query: $query, limit: $limit, offset: $offset) {
      items {
        id
        name
        domainName
        address
        employees
        industry
        linkedinUrl
        logoUrl
        annualRecurringRevenue
        idealCustomerProfile
        createdAt
        updatedAt
      }
      total
      hasMore
    }
  }
`;

/**
 * Get company with people
 */
export const GET_COMPANY_WITH_PEOPLE = `
  query GetCompanyWithPeople($id: ID!) {
    company(id: $id) {
      id
      name
      domainName
      address
      employees
      industry
      linkedinUrl
      logoUrl
      annualRecurringRevenue
      idealCustomerProfile
      people {
        id
        firstName
        lastName
        email
        phone
        jobTitle
      }
      createdAt
      updatedAt
    }
  }
`;

/**
 * Get company with opportunities
 */
export const GET_COMPANY_WITH_OPPORTUNITIES = `
  query GetCompanyWithOpportunities($id: ID!) {
    company(id: $id) {
      id
      name
      domainName
      industry
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
 * Get companies by industry
 */
export const GET_COMPANIES_BY_INDUSTRY = `
  query GetCompaniesByIndustry($industry: String!, $limit: Int, $offset: Int) {
    companiesByIndustry(industry: $industry, limit: $limit, offset: $offset) {
      items {
        id
        name
        domainName
        employees
        linkedinUrl
        logoUrl
        annualRecurringRevenue
        createdAt
      }
      total
      hasMore
    }
  }
`;

/**
 * Get ideal customer profile companies
 */
export const GET_ICP_COMPANIES = `
  query GetICPCompanies($limit: Int, $offset: Int) {
    icpCompanies(limit: $limit, offset: $offset) {
      items {
        id
        name
        domainName
        address
        employees
        industry
        linkedinUrl
        logoUrl
        annualRecurringRevenue
        idealCustomerProfile
        createdAt
      }
      total
      hasMore
    }
  }
`;

/**
 * Count companies by filters
 */
export const COUNT_COMPANIES = `
  query CountCompanies($filter: CompanyFilter) {
    countCompanies(filter: $filter) {
      total
    }
  }
`;

/**
 * Get companies by IDs
 */
export const GET_COMPANIES_BY_IDS = `
  query GetCompaniesByIds($ids: [ID!]!) {
    companiesByIds(ids: $ids) {
      id
      name
      domainName
      address
      employees
      industry
      linkedinUrl
      logoUrl
      annualRecurringRevenue
      idealCustomerProfile
      createdAt
      updatedAt
    }
  }
`;

/**
 * Get companies statistics
 */
export const GET_COMPANIES_STATS = `
  query GetCompaniesStats {
    companiesStats {
      total
      totalICP
      byIndustry {
        industry
        count
      }
      byEmployeeRange {
        range
        count
      }
      totalRevenue
      averageRevenue
    }
  }
`;

/**
 * Get recently created companies
 */
export const GET_RECENT_COMPANIES = `
  query GetRecentCompanies($limit: Int) {
    recentCompanies(limit: $limit) {
      id
      name
      domainName
      industry
      employees
      createdAt
    }
  }
`;

/**
 * Get recently updated companies
 */
export const GET_RECENTLY_UPDATED_COMPANIES = `
  query GetRecentlyUpdatedCompanies($limit: Int) {
    recentlyUpdatedCompanies(limit: $limit) {
      id
      name
      domainName
      industry
      updatedAt
    }
  }
`;

/**
 * Get company by domain name
 */
export const GET_COMPANY_BY_DOMAIN = `
  query GetCompanyByDomain($domainName: String!) {
    companyByDomain(domainName: $domainName) {
      id
      name
      domainName
      address
      employees
      industry
      linkedinUrl
      logoUrl
      annualRecurringRevenue
      idealCustomerProfile
      createdAt
      updatedAt
    }
  }
`;
