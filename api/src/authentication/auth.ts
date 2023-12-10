import type { ExographError } from "../../generated/exograph.d.ts";
import { ExographPriv } from "../../generated/exograph.d.ts";
import type { AuthContext } from "../../generated/contexts.d.ts";

const signUpContext = {
  AuthContext: {
    role: "admin",
  },
};

async function getUserByEmail(email: string, exo: ExographPriv) {
  const res = await exo.executeQueryPriv(
    `query($email: String!) {
      authUsers(where: {email: {eq: $email}}) {
        id
        clerkId
      }
    }`,
    { email },
    signUpContext
  );

  const foundAuthUsers = res.authUsers;
  if (foundAuthUsers.length === 1) {
    return foundAuthUsers[0];
  } else if (foundAuthUsers.length > 1) {
    throw new Error(`Multiple users found for email ${email}`);
  } else {
    return null;
  }
}

export async function syncAuthUser(authContext: AuthContext, exo: ExographPriv): Promise<string> {
  const { clerkId, email, firstName, lastName } = authContext;

  try {
    const userByEmail = await getUserByEmail(email, exo);

    if (userByEmail) {
      if (userByEmail.clerkId && clerkId != userByEmail.clerkId) {
        throw new Error("ClerkId in context does not match the one in database");
      } else if (!userByEmail.clerkId) {
        await exo.executeQueryPriv(
          `
          mutation($id: String!, $clerkId: String!) {
            updateAuthUser(id: $id, data: {clerkId: $clerkId}) {
              id
            }
          }
          `,
          {
            id: userByEmail.id,
            clerkId,
          },
          signUpContext
        );
      }
    } else {
      await exo.executeQueryPriv(
        `mutation($clerkId: String!, $email: String!, $firstName: String, $lastName: String) {
          createAuthUser(data: { clerkId: $clerkId, email: $email, firstName: $firstName, lastName: $lastName}) {
            id
          }
      }`,
        { clerkId, email, firstName, lastName },
        signUpContext
      );
    }
    return "Okay";
  } catch (e) {
    console.log("Failed to sign up ", e);
    throw new ExographError("Failed to sign up");
  }
}
