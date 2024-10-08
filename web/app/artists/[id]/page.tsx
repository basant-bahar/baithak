import React from "react";
import { ssrApolloClient } from "../../apollo-client";
import ArtistView from "components/artists/artistView";
import { getArtist } from "../../../graphql/artists";

interface ViewArtistProps {
  params: { id: string };
}

export default async function ViewArtist(props: ViewArtistProps) {
  const id = props.params.id;
  const artistData = await getArtistFor(id);

  if (!artistData) return null;

  return (
    <div className="main-container">
      <ArtistView artistData={artistData} />
    </div>
  );
}

async function getArtistFor(id: string) {
  const { data } = await ssrApolloClient.query({
    query: getArtist,
    variables: { id },
  });
  return data.artist;
}
