import React, { FC } from "react";
import { graphql } from "../../../__generated__";
import { ssrApolloClient } from "../../apollo-client";
import ArtistView from "../../../components/artists/artistView";

interface ViewArtistProps {
  params: { id: string };
}

export default async function ViewArtist(props: ViewArtistProps) {
  const id = parseInt(props.params.id);
  const artistData = await getArtistFor(id);

  if (!artistData) return null;

  return (
    <div className="main-container">
      <ArtistView artistData={artistData} />
    </div>
  );
}

export const artistDetails = graphql(`
  fragment ArtistDetails on Artist {
    id
    title
    name
    bio
    photoUrl
    youtubeVideoIds
    instruments
    publish
  }
`);

const getArtist = graphql(`
  query getArtist($id: Int!) {
    artist(id: $id) {
      ...ArtistDetails
    }
  }
`);

async function getArtistFor(id: number) {
  const { data } = await ssrApolloClient.query({
    query: getArtist,
    variables: { id },
  });
  return data.artist;
}
