import { SMTPClient } from "https://deno.land/x/denomailer@1.0.0/mod.ts";

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
  to: string | [string];
  cc?: string | [string];
  bcc?: string | [string];
}): Promise<boolean> {
  const { subject, message, from, to, cc, bcc } = input;
  const client = createClient();

  try {
    await client.send({
      to,
      cc,
      bcc,
      from,
      subject,
      content: "auto",
      html: message,
      priority: "low",
    });
  } catch (e) {
    console.log("Error sending email", e);
    throw e;
  }

  await client.close();
  return true;
}
