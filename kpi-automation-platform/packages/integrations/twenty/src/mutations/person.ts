/**
 * Person GraphQL Mutations
 */

/**
 * Create person
 */
export const CREATE_PERSON = `
  mutation CreatePerson($input: CreatePersonInput!) {
    createPerson(input: $input) {
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
 * Update person
 */
export const UPDATE_PERSON = `
  mutation UpdatePerson($id: ID!, $input: UpdatePersonInput!) {
    updatePerson(id: $id, input: $input) {
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
 * Delete person
 */
export const DELETE_PERSON = `
  mutation DeletePerson($id: ID!) {
    deletePerson(id: $id) {
      success
      message
    }
  }
`;

/**
 * Soft delete person
 */
export const SOFT_DELETE_PERSON = `
  mutation SoftDeletePerson($id: ID!) {
    softDeletePerson(id: $id) {
      id
      firstName
      lastName
      deletedAt
    }
  }
`;

/**
 * Restore person
 */
export const RESTORE_PERSON = `
  mutation RestorePerson($id: ID!) {
    restorePerson(id: $id) {
      id
      firstName
      lastName
      deletedAt
    }
  }
`;

/**
 * Batch create people
 */
export const BATCH_CREATE_PEOPLE = `
  mutation BatchCreatePeople($inputs: [CreatePersonInput!]!) {
    batchCreatePeople(inputs: $inputs) {
      created {
        id
        firstName
        lastName
        email
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
 * Batch update people
 */
export const BATCH_UPDATE_PEOPLE = `
  mutation BatchUpdatePeople($updates: [PersonUpdateInput!]!) {
    batchUpdatePeople(updates: $updates) {
      updated {
        id
        firstName
        lastName
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
 * Batch delete people
 */
export const BATCH_DELETE_PEOPLE = `
  mutation BatchDeletePeople($ids: [ID!]!) {
    batchDeletePeople(ids: $ids) {
      deleted
      failed {
        id
        error
      }
    }
  }
`;

/**
 * Merge people
 */
export const MERGE_PEOPLE = `
  mutation MergePeople($sourceId: ID!, $targetId: ID!) {
    mergePeople(sourceId: $sourceId, targetId: $targetId) {
      id
      firstName
      lastName
      email
      phone
      updatedAt
    }
  }
`;

/**
 * Update person company
 */
export const UPDATE_PERSON_COMPANY = `
  mutation UpdatePersonCompany($personId: ID!, $companyId: ID!) {
    updatePersonCompany(personId: $personId, companyId: $companyId) {
      id
      firstName
      lastName
      companyId
      updatedAt
    }
  }
`;

/**
 * Remove person from company
 */
export const REMOVE_PERSON_FROM_COMPANY = `
  mutation RemovePersonFromCompany($personId: ID!) {
    removePersonFromCompany(personId: $personId) {
      id
      firstName
      lastName
      companyId
      updatedAt
    }
  }
`;

/**
 * Enrich person data
 */
export const ENRICH_PERSON = `
  mutation EnrichPerson($id: ID!) {
    enrichPerson(id: $id) {
      id
      firstName
      lastName
      email
      phone
      jobTitle
      linkedinUrl
      city
      country
      updatedAt
    }
  }
`;
