import React from "react";
import ConcertView from "components/concert/concertView";
import { graphql } from "__generated__";
import { ssrApolloClient } from "../../apollo-client";

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

const getConcertView = graphql(`
  query getConcertView($id: Uuid!) {
    concert(id: $id) {
      id
      ...ConcertDetails
    }
  }
`);
