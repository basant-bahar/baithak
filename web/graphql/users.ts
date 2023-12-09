import { graphql } from "../__generated__";

export const authUserDetails = graphql(`
  fragment AuthUserDetails on AuthUser {
    clerkId
    firstName
    lastName
    email
  }
`);

export const searchAuthUsers = graphql(`
  query searchAuthUsers($search: String) {
    authUsers(
      where: {
        or: [
          { email: { ilike: $search } }
          { firstName: { ilike: $search } }
          { lastName: { ilike: $search } }
        ]
      }
      orderBy: { lastName: ASC }
    ) {
      id
      ...AuthUserDetails
    }
  }
`);

export const createAuthUser = graphql(`
  mutation createAuthUser($data: AuthUserCreationInput!) {
    createAuthUser(data: $data) {
      id
      ...AuthUserDetails
    }
  }
`);
