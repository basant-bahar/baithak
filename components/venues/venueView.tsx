import { MapPinIcon } from "@heroicons/react/20/solid";
import { venueDetails } from "../../graphql/venues";
import { FragmentType, getFragmentData } from "../../__generated__";

interface VenueViewProps {
  venueData: FragmentType<typeof venueDetails>;
}

export default function VenueView({ venueData }: VenueViewProps) {
  const venue = getFragmentData(venueDetails, venueData);

  const showAddress = venue.name !== "" && venue.name !== "Online" && venue.name !== "TBD";
  const venueAddress = showAddress
    ? venue.street + ", " + venue.city + " " + venue.state + " " + venue.zip
    : "";

  const venueLink = "https://maps.google.com/?q=" + venueAddress;

  return (
    <div className="flex justify-center align-center">
      {venue.name}
      {showAddress && <>, {venueAddress}</>}
      {showAddress && (
        <a className="link-icon w-5 ml-1" href={venueLink} target="_blank" rel="noreferrer">
          <MapPinIcon />
        </a>
      )}
    </div>
  );
}
