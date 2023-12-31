import Link from "next/link";
import React from "react";
import { imageUrl } from "utils";
import { PastConcertDetailFragment } from "../../__generated__/graphql";

type ConcertCardProps = {
  concert: PastConcertDetailFragment;
};

export const ConcertCard = ({ concert }: ConcertCardProps) => {
  const imageSrc = concert.photoUrl ? imageUrl(concert.photoUrl) : "/images/placeholder.png";
  let concertArtists = concert.concertArtists
    .map((concertArtist) => {
      const title = concertArtist.artist?.title ? concertArtist.artist.title + " " : "";
      return title + concertArtist.artist?.name;
    })
    .join(", ");

  return (
    <Link href={`/concerts/${concert.id}`}>
      <div className="relative flex flex-col overflow-hidden rounded-2xl border lg:p-4 p-1 shadow-lg cursor-pointer">
        <div className="flex justify-center">
          <picture className="rounded-md w-[70%]">
            <img src={imageSrc} alt="Comncert photo" />
          </picture>
        </div>
        <div className="text-primary pt-2 truncate">
          {concert.title + " (" + concertArtists + ")"}
        </div>
      </div>
    </Link>
  );
};
