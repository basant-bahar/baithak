import rehypeStringify from "npm:rehype-stringify";
import remarkParse from "npm:remark-parse";
import remarkRehype from "npm:remark-rehype";
import rehypeRaw from "npm:rehype-raw";
import { unified } from "npm:unified";

import * as Eta from "https://deno.land/x/eta@v1.12.3/mod.ts";
import { sendEmail } from "../email/index.ts";
import { Exograph } from "../../generated/exograph.d.ts";

const upcomingConcertQuery = `
  query($today: LocalDateTime) {
    concerts(where: {startTime: {gt: $today}}, orderBy: {startTime: ASC}, limit: 1) {
      id
      title
      startTime
      main: concertArtists(where: {isMain: {eq: true}}, orderBy: {rank: ASC}) {
        artist {
          name
        }
      }
      accompany: concertArtists(where: {isMain: {eq: false}}, orderBy: {rank: ASC}) {
        artist {
          name
        }
      }
    }
  }
`;
const query = `
  query ($id: Int!) {
    notification(id: $id) {
      subject
      message
      postMessage      
      concert {
        id
        title
        description
        venue {
          name
          street
          city
          state
          zip          
        }
        startTime
        endTime
        photoUrl
        memberPrice
        nonMemberPrice
        ticketLink
        main: concertArtists(where: {isMain: {eq: true}}, orderBy: {rank: ASC}) {
          artist {
            name
          }
          instrument
        }
        accompany: concertArtists(where: {isMain: {eq: false}}, orderBy: {rank: ASC}) {
          artist {
            name
          }
          instrument
        }
      }
    }
  }
`;

export async function formatNotification(
  concertNotificationId: number,
  exograph: Exograph
): Promise<string> {
  const fileServerUrl = Deno.env.get("FILE_SERVER_URL");
  const hostUrl = Deno.env.get("HOST_URL");
  const concertTemplate = await Deno.readTextFile("./src/notification/concertTemplate.html");
  Eta.templates.define("concertPartial", Eta.compile(concertTemplate));
  let template = await Deno.readTextFile("./src/notification/notificationTemplate.html");
  const templateFunction = Eta.compile(template);

  const notification = (await exograph.executeQuery(query, { id: concertNotificationId }))
    .notification;
  const concert = notification.concert;
  const message = await toHtml(notification.message);
  const postMessage = await toHtml(notification.postMessage);
  const description = concert ? await toHtml(concert.description) : "";

  const nextConcertReferenceDate = concert
    ? concert.startTime
    : new Date().toISOString().slice(0, -1);
  const upcomingConcerts = (
    await exograph.executeQuery(upcomingConcertQuery, { today: nextConcertReferenceDate })
  ).concerts;
  const upcomingConcert = upcomingConcerts.length > 0 ? upcomingConcerts[0] : null;

  try {
    template = templateFunction(
      { notification, fileServerUrl, hostUrl, message, postMessage, upcomingConcert, description },
      Eta.config
    );
  } catch (e) {
    console.log("Error processing template", e);
    throw e;
  }

  return template;
}

async function toHtml(markdown: string): Promise<string> {
  return String(
    await unified()
      .use(remarkParse)
      .use(remarkRehype, { allowDangerousHtml: true })
      .use(rehypeRaw)
      .use(rehypeStringify)
      .process(markdown)
  );
}

const allSubscribersQuery = `
  query {
    subscriptions(orderBy: {email: ASC}) {
      email
    }
  }
`;

const subscribersForGroupQuery = `
  query($group: String) {
    subscriptions(where: {group: {eq: $group}}, orderBy: {email: ASC}) {
      email
    }
  }
`;

const allActiveMembersQuery = `
  query($today: LocalDate) {
    memberships (where: {expiry: {gte: $today}}) {
      id
      expiry
      authUser {
        email
      }
    }
  }
`;

export async function emailNotification(
  concertNotificationId: number,
  emailGroupName: string,
  exograph: Exograph
): Promise<string> {
  const notification = (await exograph.executeQuery(query, { id: concertNotificationId }))
    .notification;
  const notificationText = await formatNotification(concertNotificationId, exograph);
  let bccs: [string];
  if (emailGroupName === "all") {
    const subscribers = await exograph.executeQuery(allSubscribersQuery);
    bccs = subscribers.subscriptions.map((s: { email: string }) => s.email);
  } else if (emailGroupName === "activeMembers") {
    const today = new Date().toISOString();
    const members = await exograph.executeQuery(allActiveMembersQuery, { today });
    bccs = members.memberships.map((m: { authUser: { email: string } }) => m.authUser.email);
  } else if (emailGroupName === "test") {
    const subscribers = await exograph.executeQuery(subscribersForGroupQuery, {
      group: emailGroupName,
    });
    bccs = subscribers.subscriptions.map((s: { email: string }) => s.email);
  } else {
    throw new ExographError("Invalid email group");
  }

  const subject = notification.subject;
  const toFrom = Deno.env.get("EMAIL_NOTIFICATION_FROM_ADDRESS");
  if (!toFrom) throw Error("Env EMAIL_NOTIFICATION_FROM_ADDRESS is not set");

  try {
    if (bccs.length > 0) {
      return await sendEmail({
        subject: subject,
        message: notificationText,
        to: toFrom,
        from: toFrom,
        bcc: bccs,
      });
    } else {
      throw new ExographError("Not sending email since group is empty");
    }
  } catch (e) {
    console.log(e);
    throw e;
  }
}
