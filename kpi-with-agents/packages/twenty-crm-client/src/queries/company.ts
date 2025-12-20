/**
 * GraphQL fragments and queries for Company entity
 */

export const COMPANY_FRAGMENT = `
  fragment CompanyFields on Company {
    id
    createdAt
    updatedAt
    deletedAt
    position
    name
    domainName {
      primaryLinkUrl
      primaryLinkLabel
      secondaryLinks
    }
    employees
    linkedinLink {
      primaryLinkUrl
      primaryLinkLabel
      secondaryLinks
    }
    xLink {
      primaryLinkUrl
      primaryLinkLabel
      secondaryLinks
    }
    annualRecurringRevenue {
      amountMicros
      currencyCode
    }
    address {
      addressStreet1
      addressStreet2
      addressCity
      addressState
      addressPostcode
      addressCountry
      addressLat
      addressLng
    }
    idealCustomerProfile
    accountOwnerId
    createdBy {
      source
      workspaceMemberId
      name
    }
  }
`;

export const GET_COMPANY = `
  ${COMPANY_FRAGMENT}
  query GetCompany($id: ID!) {
    company(filter: { id: { eq: $id } }) {
      ...CompanyFields
    }
  }
`;

export const LIST_COMPANIES = `
  ${COMPANY_FRAGMENT}
  query ListCompanies($filter: CompanyFilterInput, $orderBy: [CompanyOrderByInput!], $first: Int, $after: String) {
    companies(filter: $filter, orderBy: $orderBy, first: $first, after: $after) {
      edges {
        node {
          ...CompanyFields
        }
        cursor
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
      totalCount
    }
  }
`;

export const CREATE_COMPANY = `
  ${COMPANY_FRAGMENT}
  mutation CreateCompany($data: CompanyCreateInput!) {
    createCompany(data: $data) {
      ...CompanyFields
    }
  }
`;

export const UPDATE_COMPANY = `
  ${COMPANY_FRAGMENT}
  mutation UpdateCompany($id: ID!, $data: CompanyUpdateInput!) {
    updateCompany(id: $id, data: $data) {
      ...CompanyFields
    }
  }
`;

export const DELETE_COMPANY = `
  mutation DeleteCompany($id: ID!) {
    deleteCompany(id: $id) {
      id
    }
  }
`;

export const FIND_DUPLICATE_COMPANIES = `
  ${COMPANY_FRAGMENT}
  query FindDuplicateCompanies($data: CompanyFindDuplicateInput!) {
    findDuplicateCompanies(data: $data) {
      ...CompanyFields
    }
  }
`;
