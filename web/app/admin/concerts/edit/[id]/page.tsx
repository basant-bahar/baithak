"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation } from "@apollo/react-hooks";
import { graphql } from "__generated__";
import ConcertEditor from "components/concert/concertEditor";
import { concertsForCalendar, searchConcert } from "../../../../../graphql/concert";
import { searchVenues } from "../../../../../graphql/venues";
import { ConcertCreationInput, ConcertDetailsFragment } from "__generated__/graphql";
import { endOfYear, startOfYear } from "date-fns";
import { getServerDateTime } from "utils";

interface EditConcertProps {
  params: { id: string };
}

export default function EditConcert(props: EditConcertProps) {
  const id = props.params.id;

  return <>{id === "new" ? <CreateConcert /> : <UpdateConcert id={id} />}</>;
}

interface UpdateConcertProps {
  id: string;
}

function UpdateConcert({ id }: UpdateConcertProps) {
  const router = useRouter();

  let { data } = useQuery(getConcert, {
    variables: { id },
  });
  const { data: venuesData } = useQuery(searchVenues, {
    variables: { search: "%" },
  });
  const { data: artistsData } = useQuery(getArtistsBasicInfo);
  const [updateConcertMutation] = useMutation(updateConcert);

  const saveConcert = async (concertUpdateData: ConcertDetailsFragment) => {
    const today = new Date();

    updateConcertMutation({
      variables: {
        id,
        data: concertUpdateData,
      },
      refetchQueries: [
        { query: searchConcert, variables: { search: "%%" } },
        {
          query: concertsForCalendar,
          variables: {
            start: getServerDateTime(startOfYear(today)),
            end: getServerDateTime(endOfYear(today)),
          },
        },
      ],
    }).then((_) => router.back());
  };

  if (!data || !venuesData || !artistsData || !data.concert) {
    return <>Loading...</>;
  }

  return (
    <ConcertEditor
      concertId={id}
      concertData={data.concert}
      venues={venuesData.venues}
      artists={artistsData.artists}
      done={saveConcert}
    />
  );
}

function CreateConcert() {
  const router = useRouter();

  const { data: venuesData } = useQuery(searchVenues, {
    variables: { search: "%%" },
  });
  const { data: artistsData } = useQuery(getArtistsBasicInfo);
  const [addConcert] = useMutation(createConcert, {
    refetchQueries: [{ query: searchConcert, variables: { search: "%%" } }],
  });

  const saveConcert = (concert: ConcertCreationInput) => {
    const today = new Date();

    addConcert({
      variables: {
        data: concert,
      },
      refetchQueries: [
        {
          query: concertsForCalendar,
          variables: {
            start: getServerDateTime(startOfYear(today)),
            end: getServerDateTime(endOfYear(today)),
          },
        },
      ],
    }).then((_) => router.back());
  };

  if (!venuesData?.venues || !artistsData?.artists) {
    return <>Loading...</>;
  }

  return (
    <ConcertEditor venues={venuesData.venues} artists={artistsData.artists} done={saveConcert} />
  );
}

const getConcert = graphql(`
  query getConcert($id: Uuid!) {
    concert(id: $id) {
      id
      ...ConcertDetails
    }
  }
`);

const getArtistsBasicInfo = graphql(`
  query getArtistBasicInfo {
    artists {
      ...ArtistBasicInfo
    }
  }
`);

const updateConcert = graphql(`
  mutation updateConcert($id: Uuid!, $data: ConcertUpdateInput!) {
    updateConcert(id: $id, data: $data) {
      id
      ...ConcertDetails
    }
  }
`);

const createConcert = graphql(`
  mutation createConcert($data: ConcertCreationInput!) {
    createConcert(data: $data) {
      id
      ...ConcertDetails
    }
  }
`);
