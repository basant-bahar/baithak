"use client";

import React from "react";
import EntityList, { EntityInfo } from "components/common/entityList";
import { searchArtists } from "../../../graphql/artists";
import { graphql } from "__generated__";
import { ArtistDetailsFragment } from "__generated__/graphql";

export default function ArtistList() {
  function descFn(artist: ArtistDetailsFragment) {
    const title = artist.title ? artist.title + " " : "";
    return title + artist.name;
  }

  return (
    <EntityList
      entityInfo={
        new EntityInfo<ArtistDetailsFragment>(
          "Artist",
          "Artists",
          "artists",
          searchArtists,
          deleteArtist
        )
      }
      descFn={descFn}
    />
  );
}

const deleteArtist = graphql(`
  mutation deleteArtist($id: Int!) {
    deleteArtist(id: $id) {
      id
    }
  }
`);
