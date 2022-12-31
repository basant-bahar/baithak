import { graphql } from "../__generated__";

export const venueDetails = graphql(`
  fragment VenueDetails on Venue {
    name
    street
    city
    state
    zip
    publish
  }
`);

export const searchVenues = graphql(`
  query searchVenues($search: String) {
    venues(where: { name: { ilike: $search } }, orderBy: { name: ASC }) {
      id
      ...VenueDetails
    }
  }
`);
