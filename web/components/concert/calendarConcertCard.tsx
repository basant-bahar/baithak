import Link from "next/link";
import React from "react";
import Image from "next/image";
import { getSeparatedDateDetails, imageUrl } from "utils";
import { ConcertCalendarDetailFragment } from "../../__generated__/graphql";

type CalendarConcertCardProps = {
  concert: ConcertCalendarDetailFragment;
};

export const CalendarConcertCard = ({ concert }: CalendarConcertCardProps) => {
  const imageSrc = concert.photoUrl ? imageUrl(concert.photoUrl) : "/images/placeholder.png";

  const utcDate = concert.startTime ? new Date(new Date(concert.startTime + "Z")) : new Date();
  const dateDetails = getSeparatedDateDetails(utcDate);
  const concertArtists = concert.mainArtists
    .flatMap((concertArtist) => {
      if (concertArtist.artist) {
        const title = concertArtist.artist.title ? concertArtist.artist.title + " " : "";
        return title + concertArtist.artist.name;
      } else {
        return [];
      }
    })
    .join(", ");

  return (
    <Link href={`/concerts/${concert.id}`}>
      <div className="card gap-2 lg:gap-0 card-side lg:justify-around max-sm:justify-evenly border p-2 shadow-lg cursor-pointer items-center h-full">
        <div className="w-40 max-md:w-36 text-center rounded-md border-sky-600 border grow-0 p-0">
          <h2 className="bg-sky-600 text-white p-2 rounded-t-md">{dateDetails.month}</h2>
          <div className="text-2xl text-sky-600 font-bold pt-3 pb-3">{dateDetails.date}</div>
          <div className="text-sky-600">{dateDetails.weekday}</div>
          <div className="text-sky-600">{dateDetails.time}</div>
        </div>
        <div className="max-lg:mt-2 text-center">
          <div className="flex justify-center max-md:max-w-[160px]">
            <Image
              className="rounded-md max-md:max-w-[160px]"
              src={imageSrc}
              width="180"
              height="135"
              alt="Artist photo"
            />
          </div>
          <div className="pl-2 pr-2 pt-2 m-0 text-sm truncate max-w-[180px] max-md:max-w-[160px] text-primary min-h-[28px]">
            {concertArtists ? concertArtists : ""}
          </div>
        </div>
      </div>
    </Link>
  );
};
