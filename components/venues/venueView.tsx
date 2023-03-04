import { MapPinIcon } from "@heroicons/react/20/solid";
import { venueDetails } from "../../graphql/venues";
import { getVenueAddress } from "../../utils";
import { FragmentType, getFragmentData } from "../../__generated__";

interface VenueViewProps {
  venueData: FragmentType<typeof venueDetails>;
}

export default function VenueView({ venueData }: VenueViewProps) {
  const venue = getFragmentData(venueDetails, venueData);

  const venueAddress = getVenueAddress(venue);

  const venueLink = `https://maps.google.com/?q=${venueAddress}`;

  return (
    <div className="flex justify-center align-center">
      {`${venue.name}, ${venueAddress}`}
      {venueAddress && (
        <a className="link-icon w-5 ml-1" href={venueLink} target="_blank" rel="noreferrer">
          <MapPinIcon />
        </a>
      )}
    </div>
  );
}
