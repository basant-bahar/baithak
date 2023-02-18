import Link from "next/link";
import React from "react";
import Image from "next/image";
import { getSeparatedDateDetails, imageUrl } from "../../utils";
import { ConcertCalendarDetailFragment } from "../../__generated__/graphql";

type CalendarConcertCardProps = {
  concert: ConcertCalendarDetailFragment;
};

export const CalendarConcertCard = ({ concert }: CalendarConcertCardProps) => {
  const imageSrc = concert.photoUrl ? imageUrl(concert.photoUrl) : "/images/placeholder.png";

  const localDate = concert.startTime ? new Date(new Date(concert.startTime + "Z")) : new Date();
  const dateDetails = getSeparatedDateDetails(localDate);
  let concertArtists = concert.mainArtists
    .map((concertArtist) => {
      const title = concertArtist.artist?.title ? concertArtist.artist.title + " " : "";
      return title + concertArtist.artist?.name;
    })
    .join(", ");

  return (
    <Link href={`/concerts/${concert.id}`}>
      <div className="card lg:card-side border p-2 shadow-lg cursor-pointer items-center lg:justify-around">
        <div className="w-48 md:min-w-1/3 text-center rounded-md border-sky-600 border flex-grow-0 p-0">
          <h2 className="bg-sky-600 text-white p-2 rounded-t-md">{dateDetails.month}</h2>
          <div className="text-2xl text-sky-600 font-bold pt-3 pb-3">{dateDetails.date}</div>
          <div className="text-sky-600">{dateDetails.weekday}</div>
          <div className="text-sky-600">{dateDetails.time}</div>
        </div>
        <div className="max-lg:mt-2 text-center">
          <div className="flex justify-center">
            <Image
              className="rounded-md"
              src={imageSrc}
              width="180"
              height="135"
              alt="Artist photo"
            />
          </div>
          <div className="pl-2 pr-2 pt-2 m-0 text-sm truncate text-primary">{concertArtists}</div>
        </div>
      </div>
    </Link>
  );
};
