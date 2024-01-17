import { SMTPClient } from "https://deno.land/x/denomailer@1.6.0/mod.ts";

function createClient(): SMTPClient {
  const host = Deno.env.get("SMTP_HOST") || "localhost";
  const port = Number(Deno.env.get("SMTP_PORT"));
  const username = Deno.env.get("SMTP_USERNAME") || "";
  const password = Deno.env.get("SMTP_PASSWORD") || "";
  const tls = Deno.env.get("SMTP_USE_TLS") === "true";

  return new SMTPClient({
    connection: {
      hostname: host,
      port,
      tls,
      auth: {
        username,
        password,
      },
    },
    client: {
      warning: "log",
    },
    debug: {
      log: false,
      allowUnsecure: true,
      encodeLB: false,
      noStartTLS: false,
    },
  });
}

export async function sendEmail(input: {
  subject: string;
  message: string;
  from: string;
  to: string;
  cc?: string;
  bcc?: string | [string];
}): Promise<string> {
  const client = createClient();
  const { subject, message, from, to, cc, bcc } = input;
  const bccs = typeof bcc === "string" ? [bcc] : bcc;

  try {
    if (bccs) {
      const batchSize = 800;
      let remaining = bccs;
      console.log("Sending email to ", bccs.length);
      while (remaining.length > 0) {
        const batchedBccs = remaining.slice(0, batchSize);
        console.log("Sending batch of ", batchedBccs.length);
        await sendBatch(client, subject, message, from, to, cc, batchedBccs);
        remaining = remaining.slice(batchSize);
      }

      return remaining.length === 0
        ? "ok"
        : `Error while sending emails. Remaining emails: ${remaining.length}`;
    } else {
      await sendBatch(client, subject, message, from, to, cc);
      return "ok";
    }
  } catch (e) {
    console.log("Error sending email ", e);
    throw e;
  } finally {
    try {
      await client.close();
    } catch (e) {
      // Denomailer errors when closing client after sending zero emails.
      console.log("Error closing SMTP client", e);
    }
  }
}

async function sendBatch(
  client: SMTPClient,
  subject: string,
  message: string,
  from: string,
  to: string,
  cc?: string,
  bccs?: string[]
): Promise<void> {
  await client.send({
    to,
    cc,
    bcc: bccs,
    from,
    subject,
    content: "auto",
    html: message,
    priority: "low",
  });
}
