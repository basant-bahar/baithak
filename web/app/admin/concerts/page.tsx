"use client";

import React from "react";
import { getSeparatedDateDetails } from "utils";
import { ConcertDetailsFragment } from "__generated__/graphql";
import EntityList, { EntityInfo } from "components/common/entityList";
import { concertArtistInfo, concertsForCalendar, searchConcert } from "../../../graphql/concert";
import { getFragmentData, graphql } from "__generated__";
import { getSimpleDateTime } from "app/page";
import { endOfYear, startOfYear } from "date-fns";

export default function ConcertList() {
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

  const today = new Date();
  const deleteRefetchQueries = [
    {
      query: concertsForCalendar,
      variables: {
        start: getSimpleDateTime(startOfYear(today)),
        end: getSimpleDateTime(endOfYear(today)),
      },
    },
  ];
  return (
    <EntityList
      entityInfo={
        new EntityInfo<ConcertDetailsFragment>(
          "Concert",
          "Concerts",
          "concerts",
          searchConcert,
          deleteConcert,
          deleteRefetchQueries
        )
      }
      descFn={descFn}
    />
  );
}

const deleteConcert = graphql(`
  mutation deleteConcert($id: Uuid!) {
    deleteConcertArtists(where: { concert: { id: { eq: $id } } }) {
      id
    }
    deleteConcert(id: $id) {
      id
    }
  }
`);
