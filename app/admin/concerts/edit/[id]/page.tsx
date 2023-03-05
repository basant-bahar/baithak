"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation } from "@apollo/react-hooks";
import { graphql } from "../../../../../__generated__";
import ConcertEditor from "../../../../../components/concert/concertEditor";
import { searchConcert } from "../../../../../graphql/concert";
import { searchVenues } from "../../../../../graphql/venues";
import { ConcertCreationInput, ConcertDetailsFragment } from "../../../../../__generated__/graphql";

interface EditConcertProps {
  params: { id: string };
}

export default function EditConcert(props: EditConcertProps) {
  const id = props.params.id === "new" ? props.params.id : parseInt(props.params.id);

  return <>{id === "new" ? <CreateConcert /> : <UpdateConcert id={id} />}</>;
}

interface UpdateConcertProps {
  id: number;
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
    updateConcertMutation({
      variables: {
        id,
        data: concertUpdateData,
      },
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
    addConcert({
      variables: {
        data: concert,
      },
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
  query getConcert($id: Int!) {
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
  mutation updateConcert($id: Int!, $data: ConcertUpdateInput!) {
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
