import { ExographPriv } from "../../generated/exograph.d.ts";
import { processAndSendEmail } from "./processAndSendEmail.ts";
import { verifyCode } from "./codeManagement.ts";

const deleteSubscription = `
  mutation deleteSubscription($email: String) {
    deleteSubscriptions(where:{email: {eq: $email}}) {
      id
    }
  }
`;

const createSubscription = `
  mutation createSubscription($data: SubscriptionCreationInput!) {
    createSubscription(data: $data) {
      id
    }
  }
`;

const getSubscription = `
  query getSubscription($email: String) {
    subscriptionByEmail(email: $email) {
      id
    }
  }
`;

const adminContext = {
  AuthContext: {
    role: "admin",
  },
};

const subscriptionJwtSecret = Deno.env.get("SUBSCRIPTION_JWT_SECRET");
if (!subscriptionJwtSecret) throw new Error("SUBSCRIPTION_JWT_SECRET env must be defined");

async function subscriptionByEmail(email: String, exograph: ExographPriv): any {
  return (await exograph.executeQueryPriv(getSubscription, { email }, adminContext))
    .subscriptionByEmail;
}

export async function initiateSubscribe(email: string, exograph: ExographPriv) {
  const from = Deno.env.get("CONTACT_EMAIL") || "";
  const subject = "Subscribe confirmation";
  const hostUrl = Deno.env.get("HOST_URL");
  const existingSubscription = await subscriptionByEmail(email, exograph);

  if (!existingSubscription && hostUrl) {
    await processAndSendEmail(
      "./src/subscription/subscriptionTemplate.html",
      email,
      from,
      hostUrl,
      subject,
      subscriptionJwtSecret as string
    );
  }
  return "OK";
}

export async function verifySubscribe(email: string, code: string, exograph: ExographPriv) {
  await verifyCode(email, code, subscriptionJwtSecret as string);

  const existingSubscription = await subscriptionByEmail(email, exograph);

  if (!existingSubscription) {
    await exograph.executeQueryPriv(
      createSubscription,
      { data: { email, group: "all" } },
      adminContext
    );
  }
  return "OK";
}

export async function initiateUnsubscribe(email: string, exograph: ExographPriv) {
  const from = Deno.env.get("CONTACT_EMAIL") || "";
  const subject = "Unsubscribe confirmation";
  const hostUrl = Deno.env.get("HOST_URL");

  const existingSubscription = await subscriptionByEmail(email, exograph);

  if (existingSubscription && hostUrl) {
    await processAndSendEmail(
      "./src/subscription/unsubscribeTemplate.html",
      email,
      from,
      hostUrl,
      subject,
      subscriptionJwtSecret as string
    );
  }
  return "OK";
}

export async function verifyUnsubscribe(email: string, code: string, exograph: ExographPriv) {
  await verifyCode(email, code, subscriptionJwtSecret as string);

  const existingSubscription = await subscriptionByEmail(email, exograph);

  if (existingSubscription) {
    await exograph.executeQueryPriv(deleteSubscription, { email }, adminContext);
  }
  return "OK";
}
