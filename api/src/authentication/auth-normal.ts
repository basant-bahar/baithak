import * as bcrypt from "https://deno.land/x/bcrypt@v0.4.0/mod.ts";
import { queryUserInfo } from "./login-utils.ts";
import { createJwt } from "../utils/jwt.ts";
import { processAndSendEmail } from "../utils/processAndSendEmail.ts";
import { verifyCode } from "../utils/codeManagement.ts";
import _type from "../../generated/exograph.d.ts";

const adminContext = {
  AuthContext: {
    role: "ADMIN",
  },
};

export async function loginNormal(
  email: string,
  password: string,
  exograph: ExographPriv
): Promise<string> {
  const res = await exograph.executeQueryPriv(
    `
        query ($email: String!) {
            authUsers(where: { email: { eq: $email }}) {
                password
            }
        } 
    `,
    {
      email: email,
    },
    adminContext
  );

  const user = res.authUsers.length === 1 ? res.authUsers[0] : null;

  if (user && bcrypt.compareSync(password, user.password)) {
    const userInfo = await queryUserInfo(email, "", exograph);
    return await createJwt(userInfo);
  } else {
    throw new ExographError(`Incorrect username/password`);
  }
}

export async function signupNormal(
  email: string,
  password: string,
  firstName: string,
  lastName: string,
  exograph: ExographPriv
): Promise<string> {
  const hashed = bcrypt.hashSync(password);
  //let hashed = password;

  await exograph.executeQueryPriv(
    `mutation(
          $email: String!, 
          $password: String!,
          $role: String!,
          $firstName: String!
          $lastName: String!
          $verified: Boolean!
          $enabled: Boolean!
        ) {
            createAuthUser(data: {
              email: $email, 
              password: $password,
              role: $role,
              firstName: $firstName,
              lastName: $lastName,
              verified: $verified,
              enabled: $enabled,
            }) {
              id
            }
        }`,
    {
      email: email,
      password: hashed,
      role: "USER",
      firstName,
      lastName,
      verified: false,
      enabled: true,
    },
    adminContext
  );

  // TODO: Send a verification email and implement a veryfyNormal function to respond to it
  return "Ok";
}

export async function initiateResetPassword(
  email: string,
  exograph: ExographPriv
): Promise<string> {
  const from = Deno.env.get("CONTACT_EMAIL") || "";
  const subject = "Reset password";
  const hostUrl = Deno.env.get("HOST_URL");
  if (!hostUrl) throw new Error("Host URL must be defined");

  const res = await exograph.executeQueryPriv(
    `
        query ($email: String!) {
            authUsers(where: { email: { eq: $email }}) {
                password
            }
        } 
    `,
    {
      email: email,
    },
    adminContext
  );

  if (res.authUsers.length === 1) {
    await processAndSendEmail(
      "./src/authentication/resetEmailTemplate.html",
      email,
      from,
      hostUrl,
      subject
    );
  }
  return "OK";
}

export async function resetPassword(
  email: string,
  password: string,
  code: string,
  exograph: ExographPriv
): Promise<string> {
  await verifyCode(email, code);
  const hashed = bcrypt.hashSync(password);

  await exograph.executeQueryPriv(
    `
        mutation resetPassword($email: String, $password: String) {
            updateAuthUsers(where: {email: {eq: $email}}, data: {
              password: $password
            }) {
                id
            } 
        }
    `,
    {
      email,
      password: hashed,
    },
    adminContext
  );

  return "OK";
}
