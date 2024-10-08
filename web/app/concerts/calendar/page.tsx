import { endOfYear, startOfYear } from "date-fns";
import React from "react";
import PageHeader from "components/common/pageHeader";
import { CalendarConcertCard } from "components/concert/calendarConcertCard";
import ConcertCarousel, { concertCalendarDetail } from "components/concert/concertCarousel";
import { getFragmentData } from "__generated__";
import { ssrApolloClient } from "../../apollo-client";
import { concertsForCalendar } from "graphql/concert";
import { getServerDateTime } from "utils";

export default async function Calendar() {
  const calendarConcertsData = await getConcertCalendarData();
  if (!calendarConcertsData) return null;

  return (
    <>
      <div className="main-container">
        <PageHeader title={"Concert calendar"} />
        <ConcertCarousel concerts={calendarConcertsData} />
      </div>
      <div className="main-container p-2 mt-5 mb-2 grid grid-cols-2 gap-4 max-sm:grid-cols-1">
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
      start: getServerDateTime(startOfYear(today)),
      end: getServerDateTime(endOfYear(today)),
    },
  });
  return data && data.concerts;
}
