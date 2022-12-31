import React, { useState } from "react";
import { venueDetails } from "../../graphql/venues";
import { FragmentType, getFragmentData, makeFragmentData } from "../../__generated__";
import { VenueDetailsFragment } from "../../__generated__/graphql";
import PageHeader from "../common/pageHeader";
import PreviewContainer from "../common/previewContainer";
import VenueView from "./venueView";

interface VenueEditorProps {
  venueData?: FragmentType<typeof venueDetails>;
  done: Function;
}

const newVenue: VenueDetailsFragment = {
  name: "",
  street: "",
  city: "",
  state: "",
  zip: "",
  publish: false,
};

const rowClassName = "grid mb-4 grid-cols-4 gap-1";
const labelClassName = "flex justify-end items-center pr-3";

export default function VenueEditor(props: VenueEditorProps) {
  const venue = getFragmentData(venueDetails, props.venueData);
  const [venueData, setVenueData] = useState(venue ? venue : newVenue);

  function changeName(e: React.ChangeEvent<HTMLInputElement>) {
    setVenueData({ ...venueData, name: e.currentTarget.value });
  }

  function changeStreet(e: React.ChangeEvent<HTMLInputElement>) {
    setVenueData({ ...venueData, street: e.currentTarget.value });
  }

  function changeCity(e: React.ChangeEvent<HTMLInputElement>) {
    setVenueData({ ...venueData, city: e.currentTarget.value });
  }

  function changeState(e: React.ChangeEvent<HTMLInputElement>) {
    setVenueData({ ...venueData, state: e.currentTarget.value });
  }

  function changeZip(e: React.ChangeEvent<HTMLInputElement>) {
    setVenueData({ ...venueData, zip: e.currentTarget.value });
  }

  function changePublish(e: React.ChangeEvent<HTMLInputElement>) {
    setVenueData({ ...venueData, publish: e.target.checked });
  }

  const saveVenue = async () => {
    props.done(venueData);
  };

  return (
    <>
      <div className="main-container">
        <PageHeader title={"Venue"} />
        <div className="flex-auto p-4 max-lg:p-0">
          <div className={rowClassName}>
            <label className={labelClassName}>Name</label>
            <input
              className="simple-input max-lg:w-60"
              placeholder="Name"
              onChange={changeName}
              value={venueData.name}
            />
          </div>
          <div className={rowClassName}>
            <label className={labelClassName}>Address</label>
            <input
              className="simple-input max-lg:w-60"
              placeholder="Street"
              onChange={changeStreet}
              value={venueData.street}
            />
          </div>
          <div className={rowClassName}>
            <label className={labelClassName}>City, State and Zip</label>
            <div className="flex max-lg:flex-wrap max-lg:col-start-2 max-lg:col-end-5">
              <input
                className="simple-input mr-2 max-lg:w-60"
                placeholder="City"
                onChange={changeCity}
                value={venueData.city}
              />
              <input
                className="simple-input mr-2 max-lg:w-60"
                placeholder="State"
                onChange={changeState}
                value={venueData.state}
              />
              <input
                className="simple-input max-lg:w-60"
                placeholder="Zip"
                onChange={changeZip}
                value={venueData.zip}
              />
            </div>
          </div>
          <div className={rowClassName}>
            <div className={labelClassName}>
              <input type="checkbox" checked={venueData.publish} onChange={changePublish} />
            </div>
            <div className="flex justify-start items-center">
              <label className="pl-1">Publish</label>
            </div>
          </div>
        </div>
        <div className="grid mb-4 max-lg:grid-cols-4 lg:grid-cols-8">
          <button
            className="text-white bg-green-600 hover:bg-green-700 col-start-3 max-lg:col-start-2 lg:ml-4"
            onClick={() => saveVenue()}
          >
            Save
          </button>
        </div>
      </div>
      <PreviewContainer className="main-container mt-2">
        <VenueView venueData={makeFragmentData(venueData, venueDetails)} />
      </PreviewContainer>
    </>
  );
}
