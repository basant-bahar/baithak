"use client";

import React from "react";
import { useMutation, useLazyQuery } from "@apollo/react-hooks";
import { getSeparatedDateDetails } from "../../../utils";
import { ConcertDetailsFragment } from "../../../__generated__/graphql";
import Protected from "../../../components/auth/protected";
import EntityList, { EntityInfo } from "../../../components/common/entityList";
import { concertArtistInfo, searchConcert } from "../../../graphql/concert";
import { getFragmentData, graphql } from "../../../__generated__";

export default function ConcertList() {
  const [concertArtistDelete] = useMutation(deleteConcertArtist);
  const [concertArtistsForConcert] = useLazyQuery(concertArtistIdsForConcert);

  const preDelete = async (idToRemove: number) => {
    const result = await concertArtistsForConcert({
      variables: {
        id: idToRemove,
      },
    });
    if (result) {
      result.data?.concert.concertArtists.forEach((element) => {
        concertArtistDelete({
          variables: {
            id: element.id,
          },
        });
      });
    }
  };

  function descFn(concert: ConcertDetailsFragment) {
    const artistStr = concert.mainArtists
      .map((mainArtist) => {
        const artistData = getFragmentData(concertArtistInfo, mainArtist);
        return artistData.artist.name;
      })
      .join(", ");
    const date = getSeparatedDateDetails(new Date(new Date(concert.startTime + "Z")));
    return `${concert.title} (${artistStr}) on ${date.month} ${date.date}, ${date.year} ${date.time}`;
  }

  return (
    <Protected>
      <EntityList
        entityInfo={
          new EntityInfo<ConcertDetailsFragment>(
            "Concert",
            "Concerts",
            "concerts",
            searchConcert,
            deleteConcert,
            preDelete
          )
        }
        descFn={descFn}
      />
    </Protected>
  );
}

const deleteConcert = graphql(`
  mutation deleteConcert($id: Int!) {
    deleteConcert(id: $id) {
      id
    }
  }
`);

const concertArtistIdsForConcert = graphql(`
  query concertArtistIdsForConcert($id: Int!) {
    concert(id: $id) {
      concertArtists {
        id
      }
    }
  }
`);

const deleteConcertArtist = graphql(`
  mutation deleteConcertArtist($id: Int!) {
    deleteConcertArtist(id: $id) {
      id
    }
  }
`);
