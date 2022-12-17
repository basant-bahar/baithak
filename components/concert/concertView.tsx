import Image from "next/image";
import Link from "next/link";
import React from "react";
import {
  concertArtistInfo,
  concertDetails,
  concertViewDetails,
  newConcertDetails,
} from "../../graphql/concert";
import { imageUrl } from "../../utils";
import { FragmentType, useFragment } from "../../__generated__";
import { ConcertLogistics } from "./concertLogistics";
import Markdown from "./markdown";

type ConcertViewProps = {
  concert: FragmentType<typeof concertViewDetails>;
};

export default function ConcertView(props: ConcertViewProps) {
  const viewDetails = useFragment(concertViewDetails, props.concert);
  const details = useFragment(concertDetails, viewDetails);
  const concert = useFragment(newConcertDetails, details);
  const imageSrc = concert.photoUrl ? imageUrl(concert.photoUrl) : "/images/placeholder.png";

  return (
    <>
      <div className="mb-4 text-3xl text-center text-primary font-bold">{concert.title}</div>
      {concert.mainArtists.length > 0 && (
        <ArtistLink key={"main"} isMain={true} concertArtistsData={concert.mainArtists} />
      )}
      <div className="flex justify-center">
        <Image src={imageSrc} width={600} height={450} alt="Concert photo" />
      </div>
      {concert.accompanyingArtists.length > 0 && (
        <>
          <div className="mt-8 text-lg text-center color-primary">Accompanied by</div>
          <ArtistLink
            key={"accompany"}
            isMain={false}
            concertArtistsData={concert.accompanyingArtists}
          />
        </>
      )}
      <div className="flex mt-4 mb-4 p-4 text-lg">
        <Markdown>{concert.description}</Markdown>
      </div>
      <ConcertLogistics
        title={concert.title}
        memberPrice={concert.memberPrice}
        nonMemberPrice={concert.nonMemberPrice}
        startTime={concert.startTime}
        endTime={concert.endTime}
        venue={viewDetails.venue}
      />
    </>
  );
}

const ArtistLink = ({
  isMain,
  concertArtistsData,
}: {
  isMain: boolean;
  concertArtistsData: FragmentType<typeof concertArtistInfo>[];
}) => {
  const concertArtists = useFragment(concertArtistInfo, concertArtistsData);
  const artistsCount = concertArtists.length;
  if (artistsCount === 0) {
    return null;
  }
  const links = concertArtists.map((concertArtist) => {
    if (concertArtist.artist) {
      const nameText =
        artistsCount > 1
          ? `${concertArtist.artist.name} (${concertArtist.instrument})`
          : concertArtist.artist.name;
      const link = (
        <Link href={`/artists/${concertArtist.artist.id}`} key={concertArtist.artist.id}>
          <div className="cursor-pointer">{nameText} </div>
        </Link>
      );

      return (
        <div
          key={isMain ? "main-artists" : "accompany-artists"}
          className={isMain ? "mb-4 text-4xl" : "mt-1 text-2xl"}
        >
          {link}
        </div>
      );
    }
  });

  return <div className="text-center text-primary font-bold">{links}</div>;
};
