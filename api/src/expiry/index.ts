import { sendEmail } from "../email/index.ts";
import * as Eta from "https://deno.land/x/eta@v1.12.3/mod.ts";

const expiryNotificationsQuery = `
query($start: LocalDate, $end: LocalDate) {
  memberships(where: { expiry: { gt: $start, lt: $end } }, orderBy: { authUser: { firstName: ASC }}) {
    id
    authUser {
      firstName
      lastName
      email
    }
    expiry
  }
}
`;

function getDateStr(date: Date) {
  const dateOptions: Intl.DateTimeFormatOptions = {
    month: "long",
    day: "2-digit",
    year: "numeric",
  };
  return date.toLocaleDateString("en-US", dateOptions);
}

export async function emailExpiryNotifications(
  fromDate: string,
  toDate: string,
  exograph: Exograph
): Promise<string> {
  const template = await Deno.readTextFile("./src/expiry/expiryTemplate.html");
  const templateFunction = Eta.compile(template);

  const from = Deno.env.get("CONTACT_EMAIL") || "";
  const expiryNotifications = await exograph.executeQuery(expiryNotificationsQuery, {
    start: fromDate,
    end: toDate,
  });

  for (const membership of expiryNotifications.memberships) {
    if (membership.authUser.email) {
      const name = membership.authUser.firstName + " " + membership.authUser.lastName;
      const expiry = new Date(membership.expiry);
      const dateStr = getDateStr(expiry);
      const now = new Date();
      const expirationStr =
        expiry < now ? `has expired on ${dateStr}` : `is due to expire on ${dateStr}`;
      const mailText = templateFunction(
        {
          name: name,
          expirationStr,
          hostUrl: Deno.env.get("HOST_URL"),
        },
        Eta.config
      );

      try {
        await sendEmail({
          subject: "Your membership is expiring...",
          message: mailText || "",
          to: membership.authUser.email,
          from,
        });
      } catch (e) {
        console.log(e);
        throw e;
      }
    }
  }
  return "success";
}
