import { CheckIcon, TrashIcon } from "@heroicons/react/20/solid";
import { useState } from "react";
import { ArtistBasicInfoFragment } from "../../__generated__/graphql";
import ConcertArtistEditor from "./concertArtistEditor";
import { ConcertArtistEditInfo } from "./concertEditor";

interface ConcertArtistsEditorProps {
  artists: ArtistBasicInfoFragment[];
  concertArtists: ConcertArtistEditInfo[];
  updateConcertArtists: (concertArtists: ConcertArtistEditInfo[]) => void;
}

export default function ConcertArtistsEditor(props: ConcertArtistsEditorProps) {
  const maxRank = Math.max(...props.concertArtists.map((ca) => ca.rank || 0)) | 0;
  // State to keep track of concert artist currently being edited
  const [currentConcertArtist, setCurrentConcertArtist] = useState<ConcertArtistEditInfo>({
    isMain: true,
    rank: maxRank + 1,
  });
  const [concertArtists, setConcertArtists] = useState<ConcertArtistEditInfo[]>(
    props.concertArtists
  );

  function updateConcertArtist(concertArtist: ConcertArtistEditInfo) {
    const newConcertArtists = [...concertArtists];
    const foundConcertArtistIndex = newConcertArtists.findIndex(
      (ca) => ca.artist?.id === concertArtist.artist?.id
    );
    if (foundConcertArtistIndex != -1) {
      newConcertArtists[foundConcertArtistIndex] = concertArtist;
      setConcertArtists(newConcertArtists);
      props.updateConcertArtists(newConcertArtists);
    } else {
      setCurrentConcertArtist(concertArtist);
    }
  }

  function addArtist() {
    if (
      currentConcertArtist.artist?.id &&
      currentConcertArtist.isMain !== undefined &&
      currentConcertArtist.rank &&
      currentConcertArtist.instrument
    ) {
      const newConcertArtists = [
        ...concertArtists,
        {
          artist: { id: currentConcertArtist.artist.id },
          isMain: currentConcertArtist.isMain,
          rank: currentConcertArtist.rank,
          instrument: currentConcertArtist.instrument,
        },
      ];
      setConcertArtists(newConcertArtists);
      setCurrentConcertArtist({});
      props.updateConcertArtists(newConcertArtists);
    } else {
      console.log("Some required properties were not set");
    }
  }

  function removeConcertArtist(artistId: number) {
    const newConcertArtists = concertArtists.filter((ca) => ca.artist?.id !== artistId);
    setConcertArtists(newConcertArtists);
    props.updateConcertArtists(newConcertArtists);
  }

  const concertArtistsElems = concertArtists.map((concertArtist) => {
    const artistId = concertArtist.artist?.id;

    return (
      <div className="flex mb-4" key={artistId}>
        <ConcertArtistEditor
          artists={props.artists}
          concertArtist={concertArtist}
          updateConcertArtist={updateConcertArtist}
          artistReadonly={true}
        />

        {artistId && (
          <TrashIcon
            className="text-red-500 cursor-pointer"
            width={20}
            height={20}
            onClick={() => removeConcertArtist(artistId)}
          />
        )}
      </div>
    );
  });

  return (
    <>
      <div className="mb-4">{concertArtistsElems}</div>
      <div className="flex mb-4" key="newArtist">
        <ConcertArtistEditor
          artists={props.artists}
          concertArtist={currentConcertArtist}
          updateConcertArtist={updateConcertArtist}
        />
        <CheckIcon
          className="text-green-600 cursor-pointer"
          width={20}
          height={20}
          onClick={addArtist}
        />
      </div>
    </>
  );
}
