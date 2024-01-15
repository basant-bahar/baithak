"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation } from "@apollo/react-hooks";
import VenueEditor from "components/venues/venueEditor";
import { graphql } from "__generated__";
import { searchVenues } from "../../../../../graphql/venues";
import { VenueDetailsFragment } from "__generated__/graphql";
import { SSR_PAGES } from "utils/ssrPages";
import { revalidateSSRPages } from "utils/revalidateSSRPage";

interface EditVenueProps {
  params: { id: string };
}

export default function EditVenue(props: EditVenueProps) {
  const id = props.params.id;

  return <>{id === "new" ? <CreateVenue /> : <UpdateVenue id={id} />}</>;
}

interface UpdateVenueProps {
  id: string;
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
    }).then(async (_) => {
      await revalidateSSRPages(SSR_PAGES.HOME, SSR_PAGES.CONCERTS_CALENDAR, SSR_PAGES.VENUES_ID);
      router.back();
    });
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
    }).then(async (_) => {
      await revalidateSSRPages(SSR_PAGES.HOME, SSR_PAGES.CONCERTS_CALENDAR);
      router.back();
    });
  };

  return <VenueEditor done={saveVenue} />;
}

const getVenue = graphql(`
  query getVenue($id: Uuid!) {
    venue(id: $id) {
      id
      ...VenueDetails
    }
  }
`);

const updateVenue = graphql(`
  mutation updateVenue($id: Uuid!, $data: VenueUpdateInput!) {
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
