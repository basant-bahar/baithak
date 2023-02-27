import { graphql } from "../__generated__";

export const membershipDetails = graphql(`
  fragment MembershipDetails on Membership {
    authUser {
      id
      firstName
      lastName
      email
    }
    phone
    spouseFirstName
    spouseLastName
    spouseEmail
    expiry
    type
  }
`);

export const membershipOnlyDetails = graphql(`
  fragment MembershipOnlyDetails on Membership {
    phone
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
