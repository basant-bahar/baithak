import * as Eta from "https://deno.land/x/eta@v1.12.3/mod.ts";
import { sendEmail } from "../email/index.ts";
import { Exograph, ExographPriv } from "../../generated/exograph.d.ts";

const concertQuery = `
  query getConcert($id: Int!) {
    concert(id: $id) {
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

const rsvpQuery = `
  query getRsvp($concertId: Uuid!, $email: String!) {
    rsvpByConcertEmail(email: $email, concert: {id: $concertId}) {
      id
      numTickets      
    }
  }
`;

const updateRsvp = `
  mutation rsvpMutaion($id:Int!, $data: RsvpUpdateInput!) {
    updateRsvp(id: $id, data: $data) {
      id
    }
  }
`;

const createRsvp = `
  mutation createRsvp($data: RsvpCreateInput) {
    createRsvp(data: $data) {
      id
    }
  }
`;

const adminContext = {
  AuthContext: {
    role: "admin",
  },
};

async function sendRsvpEmail(
  exograph: Exograph,
  concertId: number,
  email: string,
  numTickets: number
): Promise<string> {
  const from = Deno.env.get("CONTACT_EMAIL") || "";
  const hostUrl = Deno.env.get("HOST_URL");

  const concert = (await exograph.executeQuery(concertQuery, { id: concertId })).concert;
  let template = await Deno.readTextFile("./src/rsvp/rsvpTemplate.html");
  const templateFunction = Eta.compile(template);
  const startTime = new Date(new Date(concert.startTime + "Z"));
  const concertDate = startTime.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
  });
  const subject = `RSVP for ${concertDate} concert received`;

  try {
    template = templateFunction({ concert, numTickets, hostUrl }, Eta.config);
  } catch (e) {
    throw e;
  }

  try {
    return await sendEmail({
      subject,
      message: template || "",
      to: email,
      from,
    });
  } catch (e) {
    console.log(e);
    throw e;
  }
}

export async function processRsvp(
  concertId: number,
  email: string,
  numTickets: number,
  exograph: ExographPriv
) {
  const rsvp = (await exograph.executeQueryPriv(rsvpQuery, { concertId, email }, adminContext))
    .rsvpByConcertEmail;
  await sendRsvpEmail(exograph, concertId, email, numTickets);

  if (!rsvp) {
    await exograph.executeQueryPriv(
      createRsvp,
      {
        data: {
          email,
          numTickets,
          concert: {
            id: concertId,
          },
        },
      },
      adminContext
    );
    return "OK";
  } else {
    if (rsvp.numTickets != numTickets) {
      await exograph.executeQueryPriv(
        updateRsvp,
        {
          id: rsvp.id,
          data: {
            numTickets,
          },
        },
        adminContext
      );
    }

    return "OK";
  }
}
