// @deno-types="npm:@types/nodemailer"
import nodemailer from "npm:nodemailer@6.9.8";

async function createClient(): nodemailer.Transporter {
  const host = Deno.env.get("SMTP_HOST") || "localhost";
  const port = Number(Deno.env.get("SMTP_PORT"));
  const username = Deno.env.get("SMTP_USERNAME") || "";
  const password = Deno.env.get("SMTP_PASSWORD") || "";
  const tls = Deno.env.get("SMTP_USE_TLS") === "true";

  const smtpTransportOptions = {
    host,
    port,
    auth: {
      user: username,
      pass: password,
    },
    secure: tls,
    ignoreTLS: !tls,
    logger: true,
    debug: false,
  };
  const transporter = nodemailer.createTransport(smtpTransportOptions);
  await transporter.verify();
  return transporter;
}

export async function sendEmail(input: {
  subject: string;
  message: string;
  from: string;
  to: string;
  cc?: string;
  bcc?: string | [string];
}): Promise<string> {
  const client = await createClient();
  const { subject, message, from, to, cc, bcc } = input;
  const bccs = typeof bcc === "string" ? [bcc] : bcc;

  try {
    if (bccs) {
      const batchSize = 800;
      let remaining = bccs;
      console.log("Sending email to ", bccs.length);
      while (remaining.length > 0) {
        const batchedBccs = remaining.slice(0, batchSize);
        console.log(
          `Sending batch of: ${batchedBccs.length},
          first email: ${batchedBccs[0]},
          last email: ${batchedBccs[batchedBccs.length - 1]}`
        );
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
  }
}

async function sendBatch(
  client: nodemailer.Transporter,
  subject: string,
  message: string,
  from: string,
  to: string,
  cc?: string,
  bccs?: string[]
): Promise<void> {
  const email = {
    from,
    to,
    cc,
    bcc: bccs,
    subject,
    html: message,
  };

  await client.sendMail(email);
}
