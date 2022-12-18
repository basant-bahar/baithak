import React from "react";
import ConcertView from "../../../components/concert/concertView";
import { concertViewDetails } from "../../../graphql/concert";
import { graphql, useFragment } from "../../../__generated__";
import { ssrApolloClient } from "../../apollo-client";

interface ViewConcertProps {
  params: { id: string };
}

export default async function ViewConcert(props: ViewConcertProps) {
  const id = parseInt(props.params.id);
  const concert = await getConcertFor(id);

  if (!concert) return null;

  return (
    <div className="main-container">
      <ConcertView concert={concert} />
    </div>
  );
}

async function getConcertFor(id: number) {
  const { data } = await ssrApolloClient.query({
    query: getConcertView,
    variables: { id },
  });
  return data.concert;
}

const getConcertView = graphql(`
  query getConcertView($id: Int!) {
    concert(id: $id) {
      ...ConcertViewDetails
    }
  }
`);
