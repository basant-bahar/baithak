const adminContext = {
  AuthContext: {
    role: "ADMIN",
  },
};

export interface JWTPayload extends Record<string, unknown> {
  sub: string;
  role: string;
  email: string;
  firstName: string;
  lastName: string;
  picture: string;
}

export async function queryUserInfo(
  email: string,
  picture: string,
  exograph: ExographPriv
): Promise<JWTPayload> {
  const res = await exograph.executeQueryPriv(
    `
        query ($email: String!) {
            authUsers(where: { email: { eq: $email }}) {
                id
                role
                firstName
                lastName
                password
            }
        } 
    `,
    {
      email: email,
    },
    adminContext
  );

  if (res.authUsers.length === 0) {
    throw new Error("User not found");
  }

  const user = res.authUsers[0];

  const payload = {
    sub: user.id,
    role: user.role,
    firstName: user.firstName,
    lastName: user.lastName,
    email: email,
    picture: picture ? picture : "",
  };

  return payload;
}
