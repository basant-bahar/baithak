import _type from "../../generated/exograph.d.ts";
import { processAndSendEmail } from "../utils/processAndSendEmail.ts";
import { verifyCode } from "../utils/codeManagement.ts";

const deleteSubscription = `
  mutation deleteSubscription($email: String) {
    deleteSubscriptions(where:{email: {eq: $email}})
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
    subscriptions(where: {email: {eq: $email}}) {
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

export async function initiateSubscribe(email: string, exograph: ExographPriv) {
  const from = Deno.env.get("CONTACT_EMAIL") || "";
  const subject = "Subscribe confirmation";
  const hostUrl = Deno.env.get("HOST_URL");
  const existingSubscription = (
    await exograph.executeQueryPriv(getSubscription, { email }, adminContext)
  ).subscriptions;

  if (existingSubscription.length === 0 && hostUrl) {
    await processAndSendEmail(
      "./src/subscription/subscriptionTemplate.html",
      email,
      from,
      hostUrl,
      subject
    );
  }
  return "OK";
}

export async function verifySubscribe(email: string, code: string, exograph: ExographPriv) {
  await verifyCode(email, code, subscriptionJwtSecret as string);

  const existingSubscription = (
    await exograph.executeQueryPriv(getSubscription, { email }, adminContext)
  ).subscriptions;
  if (existingSubscription.length === 0) {
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

  const existingSubscription = (
    await exograph.executeQueryPriv(getSubscription, { email }, adminContext)
  ).subscriptions;
  if (existingSubscription.length > 0 && hostUrl) {
    await processAndSendEmail(
      "./src/subscription/unsubscribeTemplate.html",
      email,
      from,
      hostUrl,
      subject
    );
  }
  return "OK";
}

export async function verifyUnsubscribe(email: string, code: string, exograph: ExographPriv) {
  await verifyCode(email, code, subscriptionJwtSecret as string);

  const existingSubscription = (
    await exograph.executeQueryPriv(getSubscription, { email }, adminContext)
  ).subscriptions;
  if (existingSubscription.length > 0) {
    await exograph.executeQueryPriv(deleteSubscription, { email }, adminContext);
  }
  return "OK";
}
