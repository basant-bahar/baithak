"use client";

import Script from "next/script";
import React from "react";
import { FragmentType, graphql, useFragment } from "../../__generated__";
import ConcertCarouselSlide from "./concertCarouselSlide";

interface ConcertCarouselProps {
  concerts: FragmentType<typeof concertCalendarDetail>[];
}

const ConcertCarousel = (props: ConcertCarouselProps) => {
  const concerts = useFragment(concertCalendarDetail, props.concerts);

  return (
    <>
      <Script src="https://cdn.jsdelivr.net/npm/tw-elements/dist/js/index.min.js"></Script>
      <div
        id="concertCalendar"
        className="carousel slide relative mx-auto w-9/12"
        data-bs-ride="carousel"
      >
        <div className="carousel-indicators absolute right-0 bottom-0 left-0 flex justify-center p-0 mb-4">
          {concerts.map((concert, i) => (
            <button
              key={`button-${concert.id}`}
              type="button"
              data-bs-target="#concertCalendar"
              data-bs-slide-to={i}
              className={`!bg-primary ${i === 0 ? "active" : ""}`}
              aria-current="true"
              aria-label={`${concert.title}`}
            ></button>
          ))}
        </div>
        <div className="carousel-inner relative w-full overflow-hidden">
          {concerts.map((concert, i) => {
            return <ConcertCarouselSlide key={concert.id} concertData={concert} index={i} />;
          })}
        </div>
        <button
          className="carousel-control-prev absolute top-0 bottom-0 flex items-center justify-center p-0 text-center border-0 hover:outline-none hover:no-underline focus:outline-none focus:no-underline left-0"
          type="button"
          data-bs-target="#concertCalendar"
          data-bs-slide="prev"
        >
          <span
            className="carousel-control-prev-icon inline-block bg-no-repeat"
            aria-hidden="true"
          ></span>
          <span className="visually-hidden">Previous</span>
        </button>
        <button
          className="carousel-control-next absolute top-0 bottom-0 flex items-center justify-center p-0 text-center border-0 hover:outline-none hover:no-underline focus:outline-none focus:no-underline right-0"
          type="button"
          data-bs-target="#concertCalendar"
          data-bs-slide="next"
        >
          <span
            className="carousel-control-next-icon inline-block bg-no-repeat"
            aria-hidden="true"
          ></span>
          <span className="visually-hidden">Next</span>
        </button>
      </div>
    </>
  );
};

export default ConcertCarousel;

export const concertCalendarDetail = graphql(`
  fragment ConcertCalendarDetail on Concert {
    id
    title
    mainArtists: concertArtists(where: { isMain: { eq: true } }, orderBy: { rank: ASC }) {
      artist {
        title
        name
      }
    }
    startTime
    photoUrl
    venue {
      id
      name
    }
  }
`);
