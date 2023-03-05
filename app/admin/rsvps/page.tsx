"use client";

import React from "react";
import { useQuery, useLazyQuery } from "@apollo/react-hooks";
import { getFragmentData, graphql } from "../../../__generated__";
import { getDateStr } from "../../../utils";
import PageHeader from "../../../components/common/pageHeader";
import {
  ConcertRsvpDetailsFragment,
  ConcertRsvpPrintDetailsFragment,
} from "../../../__generated__/graphql";

export default function Rsvps() {
  const descFn = (concertRsvp: ConcertRsvpDetailsFragment) => {
    return `${concertRsvp.title} (${getDateStr(concertRsvp.startTime)})`;
  };

  const [concertRsvpsForPrint] = useLazyQuery(concertRsvpsPrint);
  const { data, loading } = useQuery(concertRsvps);

  if (!data || !data.concerts || loading) {
    return <>Loading...</>;
  }

  const concertsData = data.concerts;
  const concerts: readonly ConcertRsvpDetailsFragment[] = getFragmentData(
    concertRsvpDetails,
    concertsData
  );

  async function print(concertId: number) {
    const result = await concertRsvpsForPrint();
    if (!result || !result.data || !result.data.concerts) return;
    const concertsData = result.data?.concerts;
    const concerts: readonly ConcertRsvpPrintDetailsFragment[] = getFragmentData(
      concertRsvpPrintDetails,
      concertsData
    );
    if (!concerts) return;
    const border = "1px solid gray";
    const firstCol = `border-right: ${border}; padding: 2px 0 2px 0;`;
    const secondCol = "padding-left: 5px;";
    const header = `<div style='border: ${border}; display: grid; grid-template-columns: 6fr 1fr;'>
      <div style="${firstCol}">&nbsp;Email address</div>
      <div style="${secondCol}">Number of Rsvps</div>
      </div>
      <div style='border: ${border}; border-bottom: none; border-top: none; display: grid; grid-template-columns: 6fr 1fr;'>
      `;

    const concertFound = concerts.find((c) => c.id === concertId);
    if (concertFound && concertFound.rsvps) {
      const formatedBody =
        concertFound.rsvps.reduce(
          (acc, r) =>
            acc +
            `
          <div style="border-bottom: ${border};${firstCol}">&nbsp;${r.email}</div>
          <div style="border-bottom: ${border};${secondCol}">${r.numTickets}</div>
        `,
          header
        ) + "</div>";
      const newWindow = window.open("", "_blank");
      newWindow?.document.write(formatedBody);
    }
  }

  return (
    <div className="main-container">
      <PageHeader title="Rsvps" />
      <ul className="list-none mb-4 mx-auto p-4 divide-y max-xs:p-0">
        <li key="header" className="pt-2 pb-2 grid grid-cols-6 gap-4 max-xs:gap-2">
          <div className="font-bold col-span-4">Concert</div>
          <div className="font-bold justify-self-end">RSVP count</div>
        </li>
        {concerts.map((concert) => (
          <li key={"v-" + concert?.id} className="pt-2 pb-2 grid grid-cols-5 gap-4 max-xs:gap-2">
            <div className="col-span-3 items-center max-w-lg">
              <div>{descFn(concert)}</div>
            </div>
            <div className="justify-self-end">{concert?.rsvpsAgg?.numTickets?.sum}</div>
            <div className="justify-self-end">
              <button
                className="w-16 bg-cyan-400 hover:bg-cyan-500 mr-2"
                onClick={() => concert?.id && print(concert.id)}
                disabled={concert?.rsvpsAgg?.numTickets?.sum === null}
              >
                Print
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

const concertRsvpDetails = graphql(`
  fragment ConcertRsvpDetails on Concert {
    id
    title
    startTime
    rsvpsAgg {
      numTickets {
        sum
      }
    }
  }
`);

const concertRsvps = graphql(`
  query concertRsvps {
    concerts(orderBy: { startTime: DESC }) {
      ...ConcertRsvpDetails
    }
  }
`);

const concertRsvpPrintDetails = graphql(`
  fragment ConcertRsvpPrintDetails on Concert {
    id
    title
    startTime
    rsvps {
      email
      numTickets
    }
  }
`);

const concertRsvpsPrint = graphql(`
  query concertRsvpsPrint {
    concerts(orderBy: { startTime: DESC }) {
      ...ConcertRsvpPrintDetails
    }
  }
`);
