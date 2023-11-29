import { verifyGoogle } from "./login-google.ts";
import { verifyFacebook } from "./login-facebook.ts";
import { queryUserInfo } from "./login-utils.ts";
import { createJwt } from "../utils/jwt.ts";

const adminContext = {
  AuthContext: {
    role: "ADMIN",
  },
};

export interface LoginResult {
  email: string;
  givenName: string;
  familyName: string;
  name: string;
  picture: string;
}

// Unlike "normal" login (whose signup requires an email verification step), with social login,
// the user is created immediately (thus we can issue the JWT token on signup immediately).
// So the real difference between login and signup is that the latter adds the new user to the database.
export async function loginSocial(
  code: string,
  provider: string,
  exograph: ExographPriv
): Promise<string> {
  console.log("loginSocial...", code, provider);

  return await helper(code, provider, exograph);
}

export async function signupSocial(
  code: string,
  provider: string,
  exograph: ExographPriv
): Promise<string> {
  return await helper(code, provider, exograph, signup);
}

type OnSignupFunction = (
  email: string,
  name: string,
  exograph: ExographPriv
) => Promise<string> | undefined;

async function helper(
  code: string,
  provider: string,
  exograph: ExographPriv,
  onSignup?: OnSignupFunction
): Promise<string> {
  if (provider === "google") {
    const googleUser: LoginResult = await verifyGoogle(code);

    if (onSignup) {
      await onSignup(
        googleUser.email,
        `${googleUser.givenName} ${googleUser.familyName}`,
        exograph
      );
    }
    const payload = await queryUserInfo(googleUser.email, googleUser.picture, exograph);
    const token = await createJwt(payload);
    return token;
  } else if (provider === "facebook") {
    const facebookUser: LoginResult = await verifyFacebook(code);
    if (onSignup) {
      await onSignup(facebookUser.email, facebookUser.name, exograph);
    }
    const payload = await queryUserInfo(facebookUser.email, facebookUser.picture, exograph);
    const token = await createJwt(payload);
    return token;
  } else {
    throw new Error(`Unknown provider ${provider}`);
  }
}

async function signup(email: string, name: string, exograph: ExographPriv) {
  const res = await exograph.executeQueryPriv(
    `mutation(
        $email: String!, 
        $role: String!,
        $name: String!,
        $verified: Boolean!,
      ) {
          createAuthUser(data: {
            email: $email, 
            role: $role,
            name: $name,
            verified: $verified
          }) {
            id
          }
      }`,
    {
      email: email,
      role: "USER",
      name: name,
      verified: true,
    },
    adminContext
  );

  return res.createUser.id;
}
