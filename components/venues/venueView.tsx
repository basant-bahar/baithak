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
  const venueDetailsStr = `${venue.name}${venueAddress ? ", ${venueAddress}" : ""}`;

  return (
    <div className="flex justify-center items-start max-xs:flex-col max-xs:items-center">
      <div className="flex flex-wrap">{venueDetailsStr}</div>
      {venueAddress && (
        <a
          className="link-icon w-5 lg:ml-1 max-xs:w-7"
          href={venueLink}
          target="_blank"
          rel="noreferrer"
        >
          <MapPinIcon />
        </a>
      )}
    </div>
  );
}
