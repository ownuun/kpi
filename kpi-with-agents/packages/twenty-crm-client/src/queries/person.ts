/**
 * GraphQL fragments and queries for Person entity
 */

export const PERSON_FRAGMENT = `
  fragment PersonFields on Person {
    id
    createdAt
    updatedAt
    deletedAt
    position
    name {
      firstName
      lastName
    }
    emails {
      primaryEmail
      additionalEmails
    }
    phones {
      primaryPhoneNumber
      primaryPhoneCountryCode
      additionalPhones
    }
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
    avatarUrl
    city
    jobTitle
    intro
    whatsapp {
      primaryPhoneNumber
      primaryPhoneCountryCode
      additionalPhones
    }
    companyId
    createdBy {
      source
      workspaceMemberId
      name
    }
  }
`;

export const GET_PERSON = `
  ${PERSON_FRAGMENT}
  query GetPerson($id: ID!) {
    person(filter: { id: { eq: $id } }) {
      ...PersonFields
    }
  }
`;

export const LIST_PEOPLE = `
  ${PERSON_FRAGMENT}
  query ListPeople($filter: PersonFilterInput, $orderBy: [PersonOrderByInput!], $first: Int, $after: String) {
    people(filter: $filter, orderBy: $orderBy, first: $first, after: $after) {
      edges {
        node {
          ...PersonFields
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

export const CREATE_PERSON = `
  ${PERSON_FRAGMENT}
  mutation CreatePerson($data: PersonCreateInput!) {
    createPerson(data: $data) {
      ...PersonFields
    }
  }
`;

export const UPDATE_PERSON = `
  ${PERSON_FRAGMENT}
  mutation UpdatePerson($id: ID!, $data: PersonUpdateInput!) {
    updatePerson(id: $id, data: $data) {
      ...PersonFields
    }
  }
`;

export const DELETE_PERSON = `
  mutation DeletePerson($id: ID!) {
    deletePerson(id: $id) {
      id
    }
  }
`;

export const FIND_DUPLICATE_PEOPLE = `
  ${PERSON_FRAGMENT}
  query FindDuplicatePeople($data: PersonFindDuplicateInput!) {
    findDuplicatePeople(data: $data) {
      ...PersonFields
    }
  }
`;
