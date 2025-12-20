/**
 * Company GraphQL Mutations
 */

/**
 * Create company
 */
export const CREATE_COMPANY = `
  mutation CreateCompany($input: CreateCompanyInput!) {
    createCompany(input: $input) {
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
 * Update company
 */
export const UPDATE_COMPANY = `
  mutation UpdateCompany($id: ID!, $input: UpdateCompanyInput!) {
    updateCompany(id: $id, input: $input) {
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
 * Delete company
 */
export const DELETE_COMPANY = `
  mutation DeleteCompany($id: ID!) {
    deleteCompany(id: $id) {
      success
      message
    }
  }
`;

/**
 * Soft delete company
 */
export const SOFT_DELETE_COMPANY = `
  mutation SoftDeleteCompany($id: ID!) {
    softDeleteCompany(id: $id) {
      id
      name
      deletedAt
    }
  }
`;

/**
 * Restore company
 */
export const RESTORE_COMPANY = `
  mutation RestoreCompany($id: ID!) {
    restoreCompany(id: $id) {
      id
      name
      deletedAt
    }
  }
`;

/**
 * Batch create companies
 */
export const BATCH_CREATE_COMPANIES = `
  mutation BatchCreateCompanies($inputs: [CreateCompanyInput!]!) {
    batchCreateCompanies(inputs: $inputs) {
      created {
        id
        name
        domainName
        createdAt
      }
      failed {
        input
        error
      }
    }
  }
`;

/**
 * Batch update companies
 */
export const BATCH_UPDATE_COMPANIES = `
  mutation BatchUpdateCompanies($updates: [CompanyUpdateInput!]!) {
    batchUpdateCompanies(updates: $updates) {
      updated {
        id
        name
        updatedAt
      }
      failed {
        id
        error
      }
    }
  }
`;

/**
 * Batch delete companies
 */
export const BATCH_DELETE_COMPANIES = `
  mutation BatchDeleteCompanies($ids: [ID!]!) {
    batchDeleteCompanies(ids: $ids) {
      deleted
      failed {
        id
        error
      }
    }
  }
`;

/**
 * Merge companies
 */
export const MERGE_COMPANIES = `
  mutation MergeCompanies($sourceId: ID!, $targetId: ID!) {
    mergeCompanies(sourceId: $sourceId, targetId: $targetId) {
      id
      name
      domainName
      updatedAt
    }
  }
`;

/**
 * Mark as ideal customer profile
 */
export const MARK_AS_ICP = `
  mutation MarkAsICP($id: ID!) {
    markAsICP(id: $id) {
      id
      name
      idealCustomerProfile
      updatedAt
    }
  }
`;

/**
 * Unmark as ideal customer profile
 */
export const UNMARK_AS_ICP = `
  mutation UnmarkAsICP($id: ID!) {
    unmarkAsICP(id: $id) {
      id
      name
      idealCustomerProfile
      updatedAt
    }
  }
`;

/**
 * Enrich company data
 */
export const ENRICH_COMPANY = `
  mutation EnrichCompany($id: ID!) {
    enrichCompany(id: $id) {
      id
      name
      domainName
      address
      employees
      industry
      linkedinUrl
      logoUrl
      annualRecurringRevenue
      updatedAt
    }
  }
`;

/**
 * Create opportunity
 */
export const CREATE_OPPORTUNITY = `
  mutation CreateOpportunity($input: CreateOpportunityInput!) {
    createOpportunity(input: $input) {
      id
      name
      amount
      stage
      probability
      closeDate
      companyId
      personId
      createdAt
      updatedAt
    }
  }
`;

/**
 * Update opportunity
 */
export const UPDATE_OPPORTUNITY = `
  mutation UpdateOpportunity($id: ID!, $input: UpdateOpportunityInput!) {
    updateOpportunity(id: $id, input: $input) {
      id
      name
      amount
      stage
      probability
      closeDate
      companyId
      personId
      createdAt
      updatedAt
    }
  }
`;

/**
 * Delete opportunity
 */
export const DELETE_OPPORTUNITY = `
  mutation DeleteOpportunity($id: ID!) {
    deleteOpportunity(id: $id) {
      success
      message
    }
  }
`;

/**
 * Move opportunity to stage
 */
export const MOVE_OPPORTUNITY_STAGE = `
  mutation MoveOpportunityStage($id: ID!, $stage: OpportunityStage!) {
    moveOpportunityStage(id: $id, stage: $stage) {
      id
      name
      stage
      updatedAt
    }
  }
`;

/**
 * Win opportunity
 */
export const WIN_OPPORTUNITY = `
  mutation WinOpportunity($id: ID!) {
    winOpportunity(id: $id) {
      id
      name
      stage
      closeDate
      updatedAt
    }
  }
`;

/**
 * Lose opportunity
 */
export const LOSE_OPPORTUNITY = `
  mutation LoseOpportunity($id: ID!, $reason: String) {
    loseOpportunity(id: $id, reason: $reason) {
      id
      name
      stage
      closeDate
      updatedAt
    }
  }
`;
