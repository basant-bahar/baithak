"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation } from "@apollo/react-hooks";
import Protected from "../../../../../components/auth/protected";
import VenueEditor from "../../../../../components/venues/venueEditor";
import { graphql } from "../../../../../__generated__";
import { searchVenues } from "../../../../../graphql/venues";
import { VenueDetailsFragment } from "../../../../../__generated__/graphql";

interface EditVenueProps {
  params: { id: string };
}

export default function EditVenue(props: EditVenueProps) {
  const id = props.params.id === "new" ? props.params.id : parseInt(props.params.id);

  return <Protected>{id === "new" ? <CreateVenue /> : <UpdateVenue id={id} />}</Protected>;
}

interface UpdateVenueProps {
  id: number;
}

function UpdateVenue({ id }: UpdateVenueProps) {
  const router = useRouter();
  const { data } = useQuery(getVenue, {
    variables: { id },
  });

  const [updateVenueMutation] = useMutation(updateVenue, {
    refetchQueries: [{ query: searchVenues, variables: { search: "%%" } }],
  });

  const saveVenue = async (venue: VenueDetailsFragment) => {
    updateVenueMutation({
      variables: {
        id,
        data: venue,
      },
    }).then((_) => router.back());
  };

  if (!data) return null;

  return data && data.venue && <VenueEditor venueData={data.venue} done={saveVenue} />;
}

function CreateVenue() {
  const router = useRouter();

  const [createVenueMutation] = useMutation(createVenue, {
    refetchQueries: [{ query: searchVenues, variables: { search: "%%" } }],
  });

  const saveVenue = (venue: VenueDetailsFragment) => {
    createVenueMutation({
      variables: {
        data: venue,
      },
    }).then((_) => router.back());
  };

  return <VenueEditor done={saveVenue} />;
}

const getVenue = graphql(`
  query getVenue($id: Int!) {
    venue(id: $id) {
      id
      ...VenueDetails
    }
  }
`);

const updateVenue = graphql(`
  mutation updateVenue($id: Int!, $data: VenueUpdateInput!) {
    updateVenue(id: $id, data: $data) {
      ...VenueDetails
    }
  }
`);

const createVenue = graphql(`
  mutation createVenue($data: VenueCreationInput!) {
    createVenue(data: $data) {
      ...VenueDetails
    }
  }
`);
