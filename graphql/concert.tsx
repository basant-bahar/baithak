import { graphql } from "../__generated__";

export const concertArtistInfo = graphql(
  `
    fragment ConcertArtistInfo on ConcertArtist {
      id
      artist {
        id
        title
        name
      }
      role
      rank
      instrument
    }
  `
);

export const newConcertDetails = graphql(
  `
    fragment NewConcertDetails on Concert {
      title
      description
      memberPrice
      nonMemberPrice
      ticketLink
      photoUrl
      startTime
      endTime
      publish
      mainArtists: concertArtists(where: { role: { eq: "Main" } }, orderBy: { rank: ASC }) {
        ...ConcertArtistInfo
      }
      accompanyingArtists: concertArtists(
        where: { role: { eq: "Accompany" } }
        orderBy: { rank: ASC }
      ) {
        ...ConcertArtistInfo
      }
      venue {
        id
      }
    }
  `
);

export const concertDetails = graphql(
  `
    fragment ConcertDetails on Concert {
      id
      ...NewConcertDetails
    }
  `
);

export const venueDetails = graphql(
  `
    fragment VenueDetails on Venue {
      id
      name
      street
      city
      state
      zip
      publish
    }
  `
);

export const concertViewDetails = graphql(
  `
    fragment ConcertViewDetails on Concert {
      ...ConcertDetails
      venue {
        ...VenueDetails
      }
    }
  `
);
