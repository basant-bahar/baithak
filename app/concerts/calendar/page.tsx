import { endOfYear, startOfYear } from "date-fns";
import React from "react";
import PageHeader from "../../../components/common/pageHeader";
import { CalendarConcertCard } from "../../../components/concert/calendarConcertCard";
import ConcertCarousel, {
  concertCalendarDetail,
} from "../../../components/concert/concertCarousel";
import { FragmentType, graphql, getFragmentData } from "../../../__generated__";
import { ssrApolloClient } from "../../apollo-client";
import { getSimpleDateTime } from "../../page";

export default async function Calendar() {
  const calendarConcertsData = await getConcertCalendarData();
  if (!calendarConcertsData) return null;

  return (
    <>
      <div className="main-container">
        <PageHeader title={"Concert calendar"} />
        <ConcertCarousel
          concerts={calendarConcertsData as FragmentType<typeof concertCalendarDetail>[]}
        />
      </div>
      <div className="main-container p-2 mt-5 mb-2 grid grid-cols-2 gap-4">
        {calendarConcertsData.map((calendarConcertData) => {
          const concert = getFragmentData(concertCalendarDetail, calendarConcertData);
          return concert && <CalendarConcertCard key={"v-" + concert.id} concert={concert} />;
        })}
      </div>
    </>
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
  return data && data.concerts;
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
