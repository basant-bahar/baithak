import React, { useState } from "react";
import ArtistView from "./artistView";
import Image from "next/image";
import { FragmentType, getFragmentData, makeFragmentData } from "../../__generated__";
import PageHeader from "../common/pageHeader";
import PreviewContainer from "../common/previewContainer";
import { artistDetails } from "../../graphql/artists";
import { ArtistDetailsFragment } from "../../__generated__/graphql";
import { handleFileUpload, imageUrl } from "../../utils";
import TagInput from "../common/tagInput";

type ArtistEditorProps = {
  artistData?: FragmentType<typeof artistDetails>;
  done: Function;
};

const newArtist: ArtistDetailsFragment = {
  title: "",
  name: "",
  bio: "",
  photoUrl: "",
  youtubeVideoIds: [],
  instruments: [],
  publish: true,
};

export default function ArtistEditor(props: ArtistEditorProps) {
  const artist = getFragmentData(artistDetails, props.artistData);
  const [artistData, setArtistData] = useState(artist ? artist : newArtist);
  const youtubeVideoIds = artistData.youtubeVideoIds ? artistData.youtubeVideoIds : [];
  const titles = ["", "Begum", "Pandit", "Shri", "Shrimati", "Ustad", "Vidushi"];

  function changeName(e: React.ChangeEvent<HTMLInputElement>) {
    setArtistData({ ...artistData, name: e.currentTarget.value });
  }

  function updateYoutubeIds(ids: string[]) {
    setArtistData({ ...artistData, youtubeVideoIds: ids });
  }

  function changeTitle(e: React.ChangeEvent<HTMLSelectElement>) {
    setArtistData({ ...artistData, title: e.currentTarget.value });
  }

  function changeBio(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setArtistData({ ...artistData, bio: e.currentTarget.value });
  }

  function changePublish(e: React.ChangeEvent<HTMLInputElement>) {
    setArtistData({ ...artistData, publish: e.target.checked });
  }

  function updateInstrument(newInstruments: string[]) {
    setArtistData({ ...artistData, instruments: newInstruments.sort() });
  }

  const saveArtist = async () => {
    props.done(makeFragmentData(artistData, artistDetails));
  };

  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      const updatedPhotoUrl = await handleFileUpload(file);
      setArtistData({ ...artistData, photoUrl: updatedPhotoUrl });
    }
  };

  return (
    <>
      <div className="main-container">
        <PageHeader title={"Artist"} />
        <div className="flex-auto p-4 max-lg:p-0">
          <div className="form-row">
            <label className="form-label">Title and Name</label>
            <select
              className="mr-2 border-b p-2"
              onChange={changeTitle}
              value={artistData.title || ""}
            >
              {titles.map((title) => (
                <option key={title} value={title}>
                  {title}
                </option>
              ))}
            </select>
            <input
              className="simple-input max-lg:w-44"
              name="name"
              placeholder="Name"
              onChange={changeName}
              value={artistData.name}
            />
          </div>
          <div className="form-row">
            <label className="form-label">Instruments</label>
            <TagInput existingTags={artistData.instruments} onChange={updateInstrument} />
          </div>
          <div className="form-row">
            <label className="form-label">Bio</label>
            <textarea
              className="border p-2 col-span-3"
              rows={5}
              placeholder="Bio"
              onChange={changeBio}
              value={artistData.bio || ""}
            />
          </div>
          <div className="form-row">
            <label className="form-label">Photo</label>
            {artistData.photoUrl && (
              <Image
                className="col-span-3"
                src={imageUrl(artistData.photoUrl)}
                width={80}
                height={60}
                alt={`Artist ${artistData.name} photo`}
              />
            )}
            <input
              type="file"
              className="col-start-2 mt-1 max-lg:col-end-5"
              accept=".png, .jpg, .jpeg"
              onChange={handlePhotoChange}
              // placeholder="Upload photo"
            />
          </div>
          <div className="form-row">
            <label className="form-label">Youtube</label>
            <TagInput existingTags={youtubeVideoIds} onChange={updateYoutubeIds} />
          </div>
          <div className="form-row">
            <div className="form-label">
              <input
                type="checkbox"
                className="w-4 h-4"
                checked={artistData.publish}
                onChange={changePublish}
              />
            </div>
            <div className="flex justify-start items-center">
              <label>Publish</label>
            </div>
          </div>
        </div>
        <div className="grid mb-4 max-lg:grid-cols-4 lg:grid-cols-8">
          <button
            className="text-white bg-green-600 hover:bg-green-700 col-start-3 max-lg:col-start-2 lg:ml-4"
            onClick={() => saveArtist()}
          >
            Save
          </button>
        </div>
      </div>
      <PreviewContainer className="mt-6">
        <div className="bordered-container">
          <ArtistView artistData={makeFragmentData(artistData, artistDetails)} />
        </div>
      </PreviewContainer>
    </>
  );
}
