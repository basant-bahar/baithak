"use client";

import React from "react";
import { getSeparatedDateDetails, imageUrl } from "../../utils";
import { ConcertCalendarDetailFragment } from "../../__generated__/graphql";

interface ConcertCarouselSlideProps {
  index: number;
  concertData: ConcertCalendarDetailFragment;
}

export default function ConcertCarouselSlide(props: ConcertCarouselSlideProps) {
  const concert = props.concertData;

  const mainArtists = concert.mainArtists
    .map((m) => (m.artist.title ? m.artist.title + " " + m.artist.name : m.artist.name))
    .join(" and ");
  const imageSrc = concert.photoUrl ? imageUrl(concert.photoUrl) : "/images/placeholder.png";
  const localDate = concert.startTime ? new Date(new Date(concert.startTime + "Z")) : new Date();
  const { month, date } = getSeparatedDateDetails(localDate);

  return (
    <div
      key={concert.id}
      className={`carousel-item relative float-left w-full ${props.index === 0 ? "active" : ""}`}
    >
      <img className="block w-full" src={imageSrc} alt="Concert photo" />
      <div className="carousel-caption hidden md:block absolute text-center">
        <h5 className="text-xl">{mainArtists}</h5>
        <p>{`${month} ${date}`}</p>
      </div>
    </div>
  );
}
