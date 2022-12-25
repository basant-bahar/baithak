import Link from "next/link";
import React from "react";
import { imageUrl } from "../../utils";
import { FragmentType, getFragmentData } from "../../__generated__";
import { artistBasicInfo } from "../../app/about/featured-artists/[names]/page";
import { ArtistBasicInfoFragment } from "../../__generated__/graphql";

type ArtistCardProps = {
  artist: ArtistBasicInfoFragment;
};

export const ArtistCard = ({ artist }: ArtistCardProps) => {
  const imageSrc = artist.photoUrl ? imageUrl(artist.photoUrl) : "/images/placeholder.png";
  const artistName = (artist.title ? artist.title + " " : "") + artist.name;
  return (
    <Link href={`/artists/${artist.id}`}>
      <div className="flex flex-col rounded-2xl border p-4 mb-2 shadow-lg cursor-pointer items-center gap-y-2">
        <img className="rounded-2xl" src={imageSrc} width="70%" height="auto" alt="Artist photo" />
        <div className="text-primary">{artistName}</div>
      </div>
    </Link>
  );
};
