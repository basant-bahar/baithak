import type { Exograph, ExographPriv } from "../../generated/exograph.d.ts";
import type { AuthContext } from "../../generated/contexts.d.ts";

const signUpContext = {
  AuthContext: {
    role: "admin",
  },
};

async function getUserByEmail(email: string, exo: ExographPriv) {
  const res = await exo.executeQueryPriv(
    `query($email: String!) {
      authUserByEmail(email: $email) {
        id
        clerkId
      }
    }`,
    { email },
    signUpContext
  );

  return res.authUserByEmail;
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

export async function getAuthUserId(
  authContext: AuthContext,
  exo: Exograph
): Promise<string | null> {
  if (!authContext.clerkId) {
    return null;
  }

  const res = await exo.executeQuery(
    `query($clerkId: String!) {
        authUserByClerkId(clerkId: $clerkId) {
          id
        }
      }`,
    { clerkId: authContext.clerkId }
  );

  return res.authUserByClerkId.id;
}
