import React, { useEffect, useState } from "react";
import { ConcertArtistEditInfo } from "./concertEditor";
import { ArtistBasicInfoFragment } from "../../__generated__/graphql";

interface ConcertArtistEditorProps {
  artists: ArtistBasicInfoFragment[];
  concertArtist: ConcertArtistEditInfo;
  artistReadonly?: boolean;
  updateConcertArtist: (concertArtist: ConcertArtistEditInfo) => void;
}

export default function ConcertArtistEditor(props: ConcertArtistEditorProps) {
  const [instruments, setInstruments] = useState<string[]>([]);
  const roles = ["Main", "Accompany"];

  useEffect(() => {
    if (props.concertArtist?.artist?.id) {
      const artist = props.artists.filter((artist) => {
        return artist.id === props.concertArtist?.artist?.id;
      })[0];
      setInstruments(artist.instruments);
    }
  }, [props.artists, props.concertArtist]);

  if (!props.artists) return null;

  const changeArtist = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const artistId = parseInt(e.target.value);
    props.updateConcertArtist({
      ...props.concertArtist,
      artist: {
        id: artistId,
      },
    });

    const artist = props.artists.filter((a) => a.id === artistId)[0];
    setInstruments(artist.instruments);
  };

  const changeInstrument = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (props.concertArtist.artist?.id) {
      props.updateConcertArtist({
        ...props.concertArtist,
        instrument: e.target.value,
      });
    }
  };

  const changeRole = (e: React.ChangeEvent<HTMLSelectElement>) => {
    props.updateConcertArtist({
      ...props.concertArtist,
      isMain: e.target.value === "Main",
    });
  };

  const changeRank = (e: React.ChangeEvent<HTMLInputElement>) => {
    props.updateConcertArtist({
      ...props.concertArtist,
      rank: parseInt(e.target.value),
    });
  };

  return (
    <div className="form-row grid-cols-5" key={props.concertArtist.id}>
      <select
        className="mr-2 border-b col-start-2 col-end-4"
        onChange={changeArtist}
        value={props.concertArtist.artist?.id ? props.concertArtist.artist?.id : ""}
        disabled={props.artistReadonly}
      >
        <option key="artist-empty-row" value={""}>
          {"--Artist--"}
        </option>
        {props.artists.map((artist) => (
          <option key={artist.name} value={artist.id}>
            {artist.title || "" + " " + artist.name}
          </option>
        ))}
      </select>
      <select
        className="mr-2 border-b col-start-4 col-end-5"
        onChange={changeInstrument}
        value={props.concertArtist.instrument ? props.concertArtist.instrument : ""}
      >
        <option key="instrument-empty-row" value={""}>
          {"--Instrument--"}
        </option>
        {instruments.map((instrument) => (
          <option key={instrument} value={instrument}>
            {instrument}
          </option>
        ))}
      </select>
      <div className="flex">
        <select
          className="mr-2 border-b flex-grow"
          onChange={changeRole}
          value={props.concertArtist.isMain ? "Main" : "Accompany"}
        >
          <option key="role-empty-row" value={""}>
            {"--Role--"}
          </option>
          {roles.map((role) => (
            <option key={role} value={role}>
              {role}
            </option>
          ))}
        </select>
        <input
          className="border-b mr-2 w-12 text-center"
          type="number"
          name="rank"
          min="1"
          max="99"
          value={props.concertArtist.rank ? props.concertArtist.rank : ""}
          onChange={changeRank}
        />
      </div>
    </div>
  );
}
