import Link from "next/link";
import React from "react";
import { MapPinIcon, CalendarIcon } from "@heroicons/react/20/solid";
import format from "date-fns/format";
import { venueDetails } from "../../graphql/concert";
import { FragmentType, useFragment } from "../../__generated__";

type ConcertLogisticsProps = {
  title: string;
  memberPrice: number;
  nonMemberPrice: number;
  startTime: string;
  endTime: string;
  venue: FragmentType<typeof venueDetails>;
};

export const ConcertLogistics = (props: ConcertLogisticsProps) => {
  const venue = useFragment(venueDetails, props.venue);

  const options: Intl.DateTimeFormatOptions = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  const timeOptions: Intl.DateTimeFormatOptions = { hour: "numeric", minute: "2-digit" };

  const isFree = props.memberPrice === 0;
  const localDate = props.startTime ? new Date(new Date(props.startTime + "Z")) : new Date();
  const localEndDate = props.endTime ? new Date(new Date(props.endTime + "Z")) : new Date();
  const localDateStr = localDate.toLocaleDateString("en-US", options);
  const isNonSaturday = localDate.getDay() !== 6;
  const isBefore5pm = localDate.getHours() < 17;
  const specialNoteStyle = isNonSaturday || isBefore5pm ? "pb-4" : "";
  const day = localDate.toLocaleDateString("en-US", { weekday: "long" });

  const localStartTimeStr = localDate.toLocaleTimeString([], timeOptions);
  const localEndTimeStr = localEndDate.toLocaleTimeString([], timeOptions);
  const dateStr = localDateStr + " " + localStartTimeStr + " - " + localEndTimeStr;

  const showAddress = venue.name !== "Online" && venue.name !== "TBD";
  const venueAddress = showAddress
    ? venue.street + ", " + venue.city + " " + venue.state + " " + venue.zip
    : "";

  const venueLink = "https://maps.google.com/?q=" + venueAddress;

  function googleEventDateLink() {
    let venueString = "";
    if (venue) {
      if (venue.name === "TBD") {
        venueString = venue.name;
      } else {
        venueString = venue.name + ", " + venueAddress;
      }
    }

    const googleDate = (date: Date) => {
      return format(date, "yyyyMMdd'T'HHmmssX");
    };

    return (
      "http://www.google.com/calendar/event?action=TEMPLATE&text=" +
      props.title +
      "&" +
      "dates=" +
      googleDate(localDate) +
      "/" +
      googleDate(localEndDate) +
      "&" +
      "details=http://basantbahar.org&location=" +
      venueString +
      "&trp=false&sprop=Basant%20Bahar&sprop=name:basantbahar.org"
    );
  }

  return (
    <div className="mx-auto max-w-screen-sm bg-gray-100 rounded-xl p-2">
      <div className={`text-center text-primary bg-secondary ${specialNoteStyle}`}>
        {isNonSaturday && (
          <div className="font-bold p-4 pb-0">Please note this is a {day} concert.</div>
        )}
        {isBefore5pm && (
          <div className="font-bold p-4 pb-0 pt-2">
            Please note time for this concert is {localStartTimeStr}.
          </div>
        )}
      </div>
      <div className="p-4 text-center text-white bg-primary">
        <div className="flex flex-wrap justify-center mb-4">
          <span>Tickets: {props.nonMemberPrice} (available at the gate)</span>
          <span className="xs:block hidden mr-1">,</span>
          <span>Basant Bahar Members: {isFree ? "Free" : props.memberPrice}</span>
        </div>
        <div className="mb-4">
          {isFree && (
            <span>Become a Basant Bahar member and attend all concerts free for one year.</span>
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
          <div className="flex justify-center align-center">
            {dateStr}
            <a className="link-icon ml-1 w-5" href={googleEventDateLink()} target="_blank">
              <CalendarIcon />
            </a>
          </div>
          <div className="flex justify-center align-center">
            {venue.name} {showAddress && <>, {venueAddress}</>}
            {showAddress && (
              <a className="link-icon ml-1 w-5" href={venueLink} target="_blank">
                <MapPinIcon />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
