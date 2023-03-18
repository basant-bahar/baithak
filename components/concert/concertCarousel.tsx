"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { FragmentType, graphql, getFragmentData } from "../../__generated__";
import { ConcertCalendarDetailFragment } from "../../__generated__/graphql";
import ConcertCarouselSlide from "./concertCarouselSlide";

interface ConcertCarouselProps {
  concerts: FragmentType<typeof concertCalendarDetail>[];
}

export default function ConcertCarousel(props: ConcertCarouselProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const carousel = useRef<HTMLDivElement>(null);
  const concerts = getFragmentData(concertCalendarDetail, props.concerts);

  if (concerts?.length === 0) return null;

  const onChangeSlide = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, index: number) => {
      e.preventDefault();
      changeSlide(index);
    },
    [carousel]
  );

  const changeSlide = useCallback(
    (index: number) => {
      const behavior = index === 0 ? "instant" : "smooth";
      setCurrentSlide(index % concerts.length);
      const carouselWidth = carousel.current?.clientWidth || 1;
      const targetXPixel = carouselWidth * index;
      // Scroll to the current slide. There is an open bug to fix TypeScript type for behavior.
      // https://github.com/microsoft/TypeScript-DOM-lib-generator/issues/1195
      // TODO: Remove following line once the bug is fixed.
      // @ts-expect-error
      carousel.current?.scrollTo({ top: 0, left: targetXPixel, behavior: behavior });
    },
    [carousel, concerts]
  );

  return (
    <>
      <div className="carousel w-9/12 mx-auto" ref={carousel}>
        <ConcertCarouselSlides
          currentSlide={currentSlide}
          concerts={concerts}
          onChangeSlide={onChangeSlide}
          changeSlide={changeSlide}
          carousel={carousel}
        />
      </div>
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

interface ConcertCarouselSlidesProps {
  currentSlide: number;
  concerts: readonly ConcertCalendarDetailFragment[];
  onChangeSlide: (e: React.MouseEvent<HTMLAnchorElement>, index: number) => void;
  changeSlide: (index: number) => void;
  carousel: React.RefObject<HTMLDivElement>;
}

function ConcertCarouselSlides({
  currentSlide,
  concerts,
  onChangeSlide,
  changeSlide,
  carousel,
}: ConcertCarouselSlidesProps) {
  const totalConcerts = concerts.length;

  useEffect(() => {
    const handle = setTimeout(() => {
      const next = (currentSlide + 1) % totalConcerts;
      changeSlide(next);
    }, 5000);
    () => clearTimeout(handle);
  }, [carousel, changeSlide, currentSlide, totalConcerts]);

  return (
    <>
      {concerts.map((concert, index) => (
        <ConcertCarouselSlide
          key={concert.id}
          index={index}
          currentSlide={currentSlide}
          totalSlides={totalConcerts}
          onChangeSlide={onChangeSlide}
          concert={concert}
        />
      ))}
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
