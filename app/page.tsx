import Advisory from "../components/advisory";
import { ConcertRsvp } from "../components/concert/concertRsvp";
import ConcertView from "../components/concert/concertView";
import { concertDetails, concertViewDetails } from "../graphql/concert";
import { graphql, getFragmentData } from "../__generated__";
import { ssrApolloClient } from "./apollo-client";

export default async function Home() {
  const concertData = await getFrontPageConcert();
  const viewDetails = getFragmentData(concertViewDetails, concertData);
  const details = getFragmentData(concertDetails, viewDetails);

  if (!concertData || !details) return null;

  return (
    <>
      <Advisory />
      <div className="main-container">
        <ConcertView concert={concertData} />
      </div>
      <ConcertRsvp concertId={details?.id} />
    </>
  );
}

export function getSimpleDateTime(date: Date): string {
  return date.toISOString().slice(0, -1);
}

export async function getFrontPageConcert() {
  const today = new Date();

  const { data: upcomingConcert } = await ssrApolloClient.query({
    query: getUpcomingConcert,
    variables: { today: getSimpleDateTime(today) },
  });
  const { data: lastConcert } = await ssrApolloClient.query({
    query: getLastConcert,
    variables: { today: getSimpleDateTime(today) },
  });

  if (upcomingConcert && upcomingConcert.concerts && upcomingConcert.concerts.length > 0) {
    return upcomingConcert.concerts[0];
  } else if (lastConcert && lastConcert.concerts && lastConcert.concerts.length > 0) {
    return lastConcert.concerts[0];
  }
}

const getUpcomingConcert = graphql(`
  query getUpcomingConcert($today: LocalDateTime) {
    concerts(where: { startTime: { gte: $today } }, orderBy: { startTime: ASC }) {
      ...ConcertViewDetails
    }
  }
`);

const getLastConcert = graphql(`
  query getLastConcert($today: LocalDateTime) {
    concerts(where: { startTime: { lte: $today } }, orderBy: { startTime: DESC }) {
      ...ConcertViewDetails
    }
  }
`);
