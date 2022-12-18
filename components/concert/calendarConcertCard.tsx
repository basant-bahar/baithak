import Link from "next/link";
import React from "react";
import Image from "next/image";
import { getSeparatedDateDetails, imageUrl } from "../../utils";
import { FragmentType, useFragment } from "../../__generated__";
import { concertCalendarDetail } from "./concertCarousel";

type CalendarConcertCardProps = {
  concertData: FragmentType<typeof concertCalendarDetail>;
};

export const CalendarConcertCard = ({ concertData }: CalendarConcertCardProps) => {
  const concert = useFragment(concertCalendarDetail, concertData);
  const imageSrc = concert.photoUrl ? imageUrl(concert.photoUrl) : "/images/placeholder.png";

  const localDate = concert.startTime ? new Date(new Date(concert.startTime + "Z")) : new Date();
  const dateDetails = getSeparatedDateDetails(localDate);
  let concertArtists = concert.mainArtists
    .map((concertArtist) => {
      const title = concertArtist.artist.title ? concertArtist.artist.title + " " : "";
      return title + concertArtist.artist.name;
    })
    .join(", ");

  return (
    <Link href={`/concerts/${concert.id}`}>
      <div className="card lg:card-side border p-2 shadow-lg cursor-pointer">
        <div className="bordered max-w-3/4 min-w-3/4 sm:min-w-1/3">
          <div className="md:max-w-30 text-center rounded-2xl border-2 flex-grow-0 p-0">
            <h2 className="bg-blue-500 text-white p-2 rounded-t-2xl">{dateDetails.month}</h2>
            <div className="text-2xl text-blue-500 font-bold pt-3 pb-3">{dateDetails.date}</div>
            <div className="text-blue-500">{dateDetails.weekday}</div>
            <div className="text-blue-500">{dateDetails.time}</div>
          </div>
        </div>
        <div className="md:min-w-70 md:mt-2 text-center">
          <div className="flex justify-center">
            <Image src={imageSrc} width={180} height={135} alt="Artist photo" />
          </div>
          <h2 className="pl-2 pr-2 pt-2 m-0 truncate">{concertArtists}</h2>
        </div>
      </div>
    </Link>
  );
};
