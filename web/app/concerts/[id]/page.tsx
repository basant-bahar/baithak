import React from "react";
import ConcertView from "components/concert/concertView";
import { ssrApolloClient } from "../../apollo-client";
import { getConcertView } from "graphql/concert";

// TODO: Update this time once https://github.com/vercel/next.js/issues/59883 is fixed
export const revalidate = 0;

interface ViewConcertProps {
  params: { id: string };
}

export default async function ViewConcert(props: ViewConcertProps) {
  const id = props.params.id;
  const concert = await getConcertFor(id);

  if (!concert) return null;

  return (
    <div className="main-container">
      <ConcertView concert={concert} />
    </div>
  );
}

async function getConcertFor(id: string) {
  const { data } = await ssrApolloClient.query({
    query: getConcertView,
    variables: { id },
  });
  return data.concert;
}
