"use client";

import React from "react";
import { LocalizedDate, getServerDateTime } from "utils";
import { ConcertDetailsFragment } from "__generated__/graphql";
import EntityList, { EntityInfo } from "components/common/entityList";
import { concertArtistInfo, concertsForCalendar, searchConcert } from "../../../graphql/concert";
import { getFragmentData, graphql } from "__generated__";
import { endOfYear, startOfYear } from "date-fns";

export default function ConcertList() {
  function descFn(concert: ConcertDetailsFragment) {
    const artistStr = concert.mainArtists
      .map((mainArtist) => {
        const artistData = getFragmentData(concertArtistInfo, mainArtist);
        return artistData.artist.name;
      })
      .join(", ");
    const localizedDate = new LocalizedDate(new Date(new Date(concert.startTime + "Z")));
    return `${
      concert.title
    } (${artistStr}) on ${localizedDate.getMonthString()} ${localizedDate.getDateString()}, ${localizedDate.getYearString()} ${localizedDate.getTimeString()}`;
  }

  const today = new Date();
  const deleteRefetchQueries = [
    {
      query: concertsForCalendar,
      variables: {
        start: getServerDateTime(startOfYear(today)),
        end: getServerDateTime(endOfYear(today)),
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
