"use client";

import React from "react";
import { useQuery } from "@apollo/react-hooks";
import { getSeparatedDateDetails } from "utils";
import PageHeader from "components/common/pageHeader";
import { ConcertRsvp } from "components/concert/concertRsvp";
import { concertArtistInfo, concertDetails, getConcertView } from "graphql/concert";
import { getFragmentData } from "__generated__";

interface ConcertsRsvpProps {
  params: { id: string };
}

const ConcertsRsvp = (props: ConcertsRsvpProps) => {
  const id = props.params.id;

  let { data } = useQuery(getConcertView, {
    variables: { id },
  });

  if (!data) return null;

  const concert = getFragmentData(concertDetails, data.concert);
  const mainArtistsCount = concert.mainArtists.length;
  const mainArtists = concert.mainArtists.map((mainConcertArtist) => {
    const main = getFragmentData(concertArtistInfo, mainConcertArtist);
    const nameText =
      mainArtistsCount > 1 ? `${main.artist.name} (${main.instrument})` : main.artist.name;
    return <div className="cursor-pointer">{nameText} </div>;
  });
  const startDate = getSeparatedDateDetails(new Date(new Date(concert.startTime + "Z")));
  const endDate = getSeparatedDateDetails(new Date(new Date(concert.endTime + "Z")));
  const dateTimeStr = `${startDate.weekday}, ${startDate.month} ${startDate.date}, ${startDate.year} ${startDate.time} - ${endDate.time}`;

  return (
    <div className="main-container">
      <PageHeader title="RSVP for" />
      <hr />
      <div className="mt-4 mb-4 text-xl text-center font-bold">{concert.title}</div>
      <div className="mb-4 text-2xl text-center color-primary font-bold">{mainArtists}</div>
      <div className="mt-2 mb-2 text-center font-bold">On</div>
      <div className="mb-4 text-center font-bold">{dateTimeStr}</div>
      <ConcertRsvp concertId={id} />
    </div>
  );
};

export default ConcertsRsvp;
