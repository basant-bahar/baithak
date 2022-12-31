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
      isMain
      rank
      instrument
    }
  `
);

export const concertDetails = graphql(`
  fragment ConcertDetails on Concert {
    title
    description
    memberPrice
    nonMemberPrice
    ticketLink
    photoUrl
    startTime
    endTime
    publish
    mainArtists: concertArtists(where: { isMain: { eq: true } }, orderBy: { rank: ASC }) {
      ...ConcertArtistInfo
    }
    accompanyingArtists: concertArtists(where: { isMain: { eq: false } }, orderBy: { rank: ASC }) {
      ...ConcertArtistInfo
    }
    venue {
      ...VenueDetails
    }
  }
`);

export const searchConcert = graphql(`
  query searchConcert($search: String) {
    concerts(where: { title: { like: $search } }, orderBy: { startTime: DESC }) {
      id
      ...ConcertDetails
    }
  }
`);
