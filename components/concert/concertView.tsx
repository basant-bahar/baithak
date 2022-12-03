import Image from "next/image";
import Link from "next/link";
import React from "react";
import {
  concertArtistInfo,
  concertDetails,
  concertViewDetails,
  newConcertDetails,
  venueDetails,
} from "../../graphql/concert";
import { imageUrl } from "../../utils";
import { FragmentType, useFragment } from "../../__generated__";
import { ConcertLogistics } from "./concertLogistics";
import Markdown from "./markdown";

type ConcertViewProps = {
  concert: FragmentType<typeof concertViewDetails>;
};

const ConcertView = (props: ConcertViewProps) => {
  const viewDetails = useFragment(concertViewDetails, props.concert);
  const details = useFragment(concertDetails, viewDetails);
  const concert = useFragment(newConcertDetails, details);

  const imageSrc = concert.photoUrl ? imageUrl(concert.photoUrl) : "/images/placeholder.png";
  const mainArtistsCount = concert.mainArtists.length;
  const mainArtists = concert.mainArtists.map((mainx) => {
    const main = useFragment(concertArtistInfo, mainx);
    const nameText =
      mainArtistsCount > 1 ? `${main.artist.name} (${main.instrument})` : main.artist.name;
    return (
      <Link href={`/artists/${main.artist.id}`} key={main.artist.id}>
        <div className="cursor-pointer">{nameText} </div>
      </Link>
    );
  });
  const accompanyArtists = concert.accompanyingArtists.map((accompanyx) => {
    const accompany = useFragment(concertArtistInfo, accompanyx);
    const nameText = `${accompany.artist.name} (${accompany.instrument})`;
    return (
      <Link href={`/artists/${accompany.artist.id}`} key={accompany.artist.id}>
        <div className="cursor-pointer">{nameText} </div>
      </Link>
    );
  });

  return (
    <>
      <div className="mb-4 text-3xl text-center text-primary font-bold">{concert.title}</div>
      <div className="mb-4 text-4xl text-center text-primary font-bold">{mainArtists}</div>
      <div className="flex justify-center">
        <Image src={imageSrc} width={600} height={450} alt="Concert photo" />
      </div>
      {accompanyArtists.length > 0 && (
        <>
          <div className="mt-8 text-lg text-center color-primary">Accompanied by</div>
          <div className="mt-1 text-2xl text-center color-primary font-bold">
            {accompanyArtists}
          </div>
        </>
      )}
      <div className="flex mt-4 mb-4">
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
};

export default ConcertView;
