import { graphql } from "../__generated__";

export const artistDetails = graphql(`
  fragment ArtistDetails on Artist {
    title
    name
    bio
    photoUrl
    youtubeVideoIds
    instruments
    publish
  }
`);

export const searchArtists = graphql(`
  query searchArtists($search: String) {
    artists(where: { name: { ilike: $search } }, orderBy: { name: ASC }) {
      id
      ...ArtistDetails
    }
  }
`);

export const getArtist = graphql(`
  query getArtist($id: Uuid!) {
    artist(id: $id) {
      id
      ...ArtistDetails
    }
  }
`);
