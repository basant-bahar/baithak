import { endOfYear, startOfYear } from "date-fns";
import React, { FC } from "react";
import ConcertCarousel, {
  concertCalendarDetail,
} from "../../../components/concert/concertCarousel";
import { graphql, useFragment } from "../../../__generated__";
import { ssrApolloClient } from "../../apollo-client";
import { getSimpleDateTime } from "../../page";

export default async function Calendar() {
  const calendarConcertsData = await getConcertCalendarData();
  // TODO: fix type error properly. There seems to be an issue with passing arrays.
  // @ts-ignore: ignore next line
  const calendarConcerts: FragmentType<typeof concertCalendarDetail>[] = useFragment(
    concertCalendarDetail,
    // @ts-ignore: ignore next line
    calendarConcertsData
  );

  if (!calendarConcerts) return null;

  return (
    <div className="main-container">
      <ConcertCarousel concerts={calendarConcerts} />
    </div>
  );
}

async function getConcertCalendarData() {
  const today = new Date();

  const { data } = await ssrApolloClient.query({
    query: concertsForCalendar,
    variables: {
      start: getSimpleDateTime(startOfYear(today)),
      end: getSimpleDateTime(endOfYear(today)),
    },
  });
  return data.concerts;
}

const concertsForCalendar = graphql(`
  query concertsForCalendar($start: LocalDateTime, $end: LocalDateTime) {
    concerts(
      where: {
        and: [{ startTime: { gte: $start } }, { startTime: { lte: $end } }]
        publish: { eq: true }
      }
      orderBy: { startTime: ASC }
    ) {
      ...ConcertCalendarDetail
    }
  }
`);
