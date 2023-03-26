import React from "react";
import Link from "next/link";
import { startOfYear } from "date-fns";
import PageHeader from "components/common/pageHeader";
import { graphql, getFragmentData } from "__generated__";
import { ssrApolloClient } from "../../../apollo-client";
import { getSimpleDateTime } from "../../../page";
import { ConcertCard } from "components/concert/concertCard";

interface PastConcertsProps {
  params: { year: string };
}

export default async function PastConcerts(props: PastConcertsProps) {
  const selectedYear = parseInt(props.params.year);
  const firstAndLastConcert = await getFirstAndLastConcertDate();
  const pastConcertsData = await getPastConcertsByYear(selectedYear);

  if (!firstAndLastConcert || !pastConcertsData) return null;

  function range(start: number, end: number): number[] {
    const arr = [];
    for (let i = end - 1; i >= start; i--) {
      arr.push(i);
    }
    return arr;
  }

  const renderTabs = () => {
    const startYear = new Date(
      new Date(firstAndLastConcert.firstConcert?.startTime + "Z")
    ).getFullYear();
    const endYear = new Date(
      new Date(firstAndLastConcert.lastConcert?.startTime + "Z")
    ).getFullYear();
    return range(startYear, endYear).map((year, i) => {
      const isActive = year === selectedYear;
      const linkHref = `/about/past-concerts/${year}`;
      return (
        <Link
          key={year}
          href={linkHref}
          className={`color-primary tab tab-bordered ml-2 ${
            isActive
              ? "active active: text-primary border-primary-dark"
              : "border-slate-200 text-slate-400"
          }`}
        >
          {year}
        </Link>
      );
    });
  };

  const renderCards = () => {
    return pastConcertsData.map((concertData) => {
      const concert = getFragmentData(pastConcertDetail, concertData);
      return concert && <ConcertCard key={concert.id} concert={concert} />;
    });
  };

  return (
    <div className="main-container">
      <PageHeader title="Past Concerts" />
      <div className="flex justify-center artist-tabs tabs text-center mb-12">{renderTabs()}</div>
      <div className="grid grid-cols-3 gap-4 max-xs:grid-cols-2">{renderCards()}</div>
    </div>
  );
}

const firstAndLastConcertDate = graphql(`
  query concertYearList {
    firstConcert: concerts(
      where: { publish: { eq: true } }
      orderBy: { startTime: ASC }
      limit: 1
    ) {
      id
      startTime
    }
    lastConcert: concerts(
      where: { publish: { eq: true } }
      orderBy: { startTime: DESC }
      limit: 1
    ) {
      id
      startTime
    }
  }
`);

const pastConcertDetail = graphql(`
  fragment PastConcertDetail on Concert {
    id
    title
    photoUrl
    startTime
    concertArtists {
      artist {
        title
        name
      }
    }
  }
`);

const concertsBetweenDates = graphql(`
  query concertsBetweenDates($start: LocalDateTime, $end: LocalDateTime) {
    concerts(
      where: {
        and: [
          { startTime: { gte: $start } }
          { startTime: { lt: $end } }
          { publish: { eq: true } }
        ]
      }
    ) {
      ...PastConcertDetail
    }
  }
`);

async function getPastConcertsByYear(year: number) {
  const startDate = startOfYear(new Date(year, 1));
  const endDate = startOfYear(new Date(year + 1, 1));

  const { data } = await ssrApolloClient.query({
    query: concertsBetweenDates,
    variables: { start: getSimpleDateTime(startDate), end: getSimpleDateTime(endDate) },
  });

  return data && data.concerts;
}

async function getFirstAndLastConcertDate() {
  const { data } = await ssrApolloClient.query({ query: firstAndLastConcertDate });

  if (!data || !data.firstConcert || !data.lastConcert) return null;

  return { firstConcert: data.firstConcert[0], lastConcert: data.lastConcert[0] };
}
