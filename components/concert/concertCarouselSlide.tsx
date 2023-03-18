import React from "react";
import { getSeparatedDateDetails, imageUrl } from "../../utils";
import { ConcertCalendarDetailFragment } from "../../__generated__/graphql";

interface ConcertCarouselSlideProps {
  index: number;
  currentSlide: number;
  totalSlides: number;
  onChangeSlide: (e: React.MouseEvent<HTMLAnchorElement>, index: number) => void;
  concert: ConcertCalendarDetailFragment;
}

export default function ConcertCarouselSlide({
  index,
  currentSlide,
  totalSlides,
  onChangeSlide,
  concert,
}: ConcertCarouselSlideProps) {
  const mainArtists = concert.mainArtists
    .map((m) => (m.artist?.title ? m.artist.title + " " + m.artist.name : m.artist?.name))
    .join(" and ");
  const imageSrc = concert.photoUrl ? imageUrl(concert.photoUrl) : "/images/placeholder.png";
  const localDate = concert.startTime ? new Date(new Date(concert.startTime + "Z")) : new Date();
  const { month, date } = getSeparatedDateDetails(localDate);
  const prev = (currentSlide - 1 + totalSlides) % totalSlides;
  const next = (currentSlide + 1) % totalSlides;

  return (
    <div className="carousel-item w-full relative">
      <img className="block w-full" src={imageSrc} alt="Concert photo" />
      <div className="absolute flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2">
        <a
          className="btn p-2 border-0 text-lg text-slate-300"
          onClick={(e) => onChangeSlide(e, prev)}
        >
          ❮
        </a>
        <a
          className="btn p-2 border-0 text-lg text-slate-300"
          onClick={(e) => onChangeSlide(e, next)}
        >
          ❯
        </a>
      </div>
      {currentSlide === index && (
        <div className="absolute w-full bottom-0 py-5 text-center text-primary white-transparent">
          <h5 className="text-xl">{mainArtists}</h5>
          <p>{`${month} ${date}`}</p>
        </div>
      )}
    </div>
  );
}
