import React from "react";
import { LocalizedDate, imageUrl } from "utils";
import { ConcertCalendarDetailFragment } from "../../__generated__/graphql";

interface ConcertCarouselSlideProps {
  currentSlide: number;
  totalSlides: number;
  onChangeSlide: (e: React.MouseEvent<HTMLAnchorElement>, index: number) => void;
  concert: ConcertCalendarDetailFragment;
}

export default function ConcertCarouselSlide({
  currentSlide,
  totalSlides,
  onChangeSlide,
  concert,
}: ConcertCarouselSlideProps) {
  const mainArtists = concert.mainArtists
    .map((m) => (m.artist?.title ? m.artist.title + " " + m.artist.name : m.artist?.name))
    .join(" and ");
  const imageSrc = concert.photoUrl ? imageUrl(concert.photoUrl) : "/images/placeholder.png";
  const utcDate = concert.startTime ? new Date(new Date(concert.startTime + "Z")) : new Date();
  const localizedDate = new LocalizedDate(utcDate);
  const month = localizedDate.getMonthString();
  const date = localizedDate.getDateString();
  const prev = (currentSlide - 1 + totalSlides) % totalSlides;
  const next = (currentSlide + 1) % totalSlides;

  return (
    <div className="carousel-item w-full relative">
      <picture className="block w-full">
        <img src={imageSrc} alt="Concert photo" />
      </picture>

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
      <div className="absolute w-full bottom-0 py-3 max-xs:py-1 text-center text-primary white-transparent">
        <h5 className="text-xl">{mainArtists}</h5>
        <p>{`${month} ${date}`}</p>
      </div>
    </div>
  );
}
