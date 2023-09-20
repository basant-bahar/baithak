"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { FragmentType, graphql, getFragmentData } from "../../__generated__";
import ConcertCarouselSlide from "./concertCarouselSlide";

interface ConcertCarouselProps {
  concerts: FragmentType<typeof concertCalendarDetail>[];
}

export default function ConcertCarousel(props: ConcertCarouselProps) {
  const [isHovered, setHovered] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const carousel = useRef<HTMLDivElement>(null);
  const concerts = getFragmentData(concertCalendarDetail, props.concerts);
  const totalConcerts = concerts.length;

  const changeSlide = useCallback(
    (index: number) => {
      const behavior = index === 0 ? "instant" : "smooth";
      setCurrentSlide(index % concerts.length);
      const carouselWidth = carousel.current?.clientWidth || 1;
      const targetXPixel = carouselWidth * index;

      carousel.current?.scrollTo({ top: 0, left: targetXPixel, behavior: behavior });
    },
    [carousel, concerts]
  );

  const onChangeSlide = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, index: number) => {
      e.preventDefault();
      changeSlide(index);
    },
    [changeSlide]
  );

  useEffect(() => {
    let handle: ReturnType<typeof setTimeout>;

    if (!isHovered && totalConcerts > 0) {
      handle = setTimeout(() => {
        const next = (currentSlide + 1) % totalConcerts;
        changeSlide(next);
      }, 5000);
    }
    return () => {
      clearTimeout(handle);
    };
  }, [changeSlide, currentSlide, totalConcerts, isHovered]);

  return (
    <>
      <div
        className="carousel w-9/12 mx-auto"
        ref={carousel}
        onMouseOver={() => setHovered(true)}
        onMouseOut={() => setHovered(false)}
      >
        {concerts.map((concert) => (
          <ConcertCarouselSlide
            key={concert.id}
            currentSlide={currentSlide}
            totalSlides={totalConcerts}
            onChangeSlide={onChangeSlide}
            concert={concert}
          />
        ))}
      </div>
      {/* Render tabs for the slides */}
      <div className="flex justify-center w-full py-2 gap-2">
        {concerts.map((concert, i) => {
          const bgClass =
            currentSlide === i
              ? "bg-primary hover:bg-primary-light"
              : "bg-slate-300 hover:bg-slate-200";
          return (
            <a
              key={concert.id.toString()}
              className={`btn min-h-0 p-0 h-1 w-[30px] border-0 border-solid border-transparent ${bgClass}`}
              onClick={(e) => onChangeSlide(e, i)}
            ></a>
          );
        })}
      </div>
    </>
  );
}

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
