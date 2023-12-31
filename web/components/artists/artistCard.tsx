import Link from "next/link";
import React from "react";
import { imageUrl } from "utils";
import { ArtistBasicInfoFragment } from "../../__generated__/graphql";

type ArtistCardProps = {
  artist: ArtistBasicInfoFragment;
};

export const ArtistCard = ({ artist }: ArtistCardProps) => {
  const imageSrc = artist.photoUrl ? imageUrl(artist.photoUrl) : "/images/placeholder.png";
  const artistName = (artist.title ? artist.title + " " : "") + artist.name;
  return (
    <Link href={`/artists/${artist.id}`}>
      <div className="flex flex-col rounded-2xl border min-h-[210px] lg:p-4 p-1 mb-2 shadow-lg cursor-pointer items-center gap-y-2">
        <picture className="rounded-2xl w-[70%] max-xs:w-3/4">
          <img src={imageSrc} alt="Artist photo" />
        </picture>
        <div className="text-primary text-center max-xs:truncate max-xs:w-11/12">{artistName}</div>
      </div>
    </Link>
  );
};
