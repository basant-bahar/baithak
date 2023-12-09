import { graphql } from "../__generated__";

export const membershipDetails = graphql(`
  fragment MembershipDetails on Membership {
    authUser {
      id
      clerkId
      firstName
      lastName
      email
    }
    spouseFirstName
    spouseLastName
    spouseEmail
    expiry
    type
  }
`);

export const membershipOnlyDetails = graphql(`
  fragment MembershipOnlyDetails on Membership {
    spouseFirstName
    spouseLastName
    spouseEmail
    expiry
    type
  }
`);

export const searchMembership = graphql(`
  query searchMembership($search: String) {
    memberships(
      where: {
        or: [
          { authUser: { firstName: { ilike: $search } } }
          { authUser: { lastName: { ilike: $search } } }
          { authUser: { email: { ilike: $search } } }
          { spouseFirstName: { ilike: $search } }
          { spouseLastName: { ilike: $search } }
        ]
      }
      orderBy: { authUser: { firstName: ASC } }
    ) {
      id
      ...MembershipDetails
    }
  }
`);

export const updateMembership = graphql(`
  mutation updateMembership($id: Uuid!, $data: MembershipUpdateInput!) {
    updateMembership(id: $id, data: $data) {
      id
      ...MembershipOnlyDetails
    }
  }
`);
