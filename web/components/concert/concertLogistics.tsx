import Link from "next/link";
import React from "react";
import { CalendarIcon } from "@heroicons/react/20/solid";
import { formatDate } from "date-fns/format";
import { venueDetails } from "../../graphql/venues";
import { FragmentType, getFragmentData } from "../../__generated__";
import VenueView from "../venues/venueView";
import { LocalizedDate, getVenueAddress, ORGANIZATION_NAME } from "utils";

type ConcertLogisticsProps = {
  title: string;
  memberPrice: number;
  nonMemberPrice: number;
  ticketLink?: string | null;
  startTime: string;
  endTime: string;
  venue: FragmentType<typeof venueDetails>;
};

export const ConcertLogistics = (props: ConcertLogisticsProps) => {
  const venue = getFragmentData(venueDetails, props.venue);

  const isFree = props.memberPrice === 0;
  const utcDate = new Date(new Date(props.startTime + "Z"));
  const utcEndDate = new Date(new Date(props.endTime + "Z"));
  const localizedStart = new LocalizedDate(utcDate);
  const localizedEnd = new LocalizedDate(utcEndDate);

  const localDateStr = localizedStart.getDateDisplayString();
  const isNonSaturday = localizedStart.getDay() !== 6;
  const isOddTime = localizedStart.getHours() < 17 || localizedStart.getHours() > 18;
  const specialNoteStyle = isNonSaturday || isOddTime ? "pb-4" : "";
  const day = localizedStart.getWeekdayString();

  const localStartTimeStr = localizedStart.getTimeString();
  const localEndTimeStr = localizedEnd.getTimeString();
  const localTimeStr = `${localStartTimeStr} -  ${localEndTimeStr}`;

  const venueAddress = getVenueAddress(venue);

  function onlineLink() {
    if (props.ticketLink) {
      return (
        <span>
          {" "}
          or{" "}
          <Link className="nav-link" href={props.ticketLink}>
            online
          </Link>
        </span>
      );
    } else {
      return null;
    }
  }

  function googleEventDateLink() {
    const venueString = venue ? `${venue.name}, ${venueAddress}` : "Venue TBD";
    const googleDate = (date: Date) => {
      return formatDate(date, "yyyyMMdd'T'HHmmssX");
    };
    const text = `text=${props.title}`;
    const dates = `dates=${googleDate(utcDate)}/${googleDate(utcEndDate)}`;
    const details = `details=${process.env.NEXT_PUBLIC_ORGANIZATION_URL}`;
    const location = `location=${venueString}`;

    return `http://www.google.com/calendar/event?action=TEMPLATE&${text}&${dates}&${details}&${location}`;
  }

  return (
    <div className="mx-auto max-w-screen-sm bg-gray-100 rounded-xl p-2">
      <div className={`text-center text-primary bg-secondary ${specialNoteStyle}`}>
        {isNonSaturday && (
          <div className="font-bold p-4 pb-0">Please note this is a {day} concert.</div>
        )}
        {isOddTime && (
          <div className="font-bold p-4 pb-0 pt-2">
            Please note time for this concert is {localStartTimeStr}.
          </div>
        )}
      </div>
      <div className="p-4 text-center text-white bg-primary">
        <div className="flex flex-wrap justify-center mb-4">
          <span>
            Tickets: ${props.nonMemberPrice} (available at the gate
            {onlineLink()})
          </span>
          <span className="xs:block hidden mr-1">,</span>
          <span>
            &nbsp;{`${ORGANIZATION_NAME}`} Members: {isFree ? "Free" : props.memberPrice}
          </span>
        </div>
        <div className="mb-4">
          {isFree && (
            <span>
              Become a {`${ORGANIZATION_NAME}`} member and attend all concerts free for one year.
            </span>
          )}
          <div>
            <span>For details, please visit our </span>
            <Link className="nav-link" href="/memberships/info">
              Membership Page
            </Link>
          </div>
        </div>
        <hr />
        <div className="mt-4">
          <div className="flex justify-center items-center max-xs:flex-col">
            <div className="flex flex-wrap justify-center items-center">
              <div>{localDateStr}&nbsp;</div>
              <div>{localTimeStr}</div>
              <a
                className="link-icon lg:ml-1 w-5 max-xs:w-7 pl-1"
                href={googleEventDateLink()}
                target="_blank"
                rel="noreferrer"
              >
                <CalendarIcon />
              </a>
            </div>
          </div>
          <VenueView venueData={props.venue} />
        </div>
      </div>
    </div>
  );
};
