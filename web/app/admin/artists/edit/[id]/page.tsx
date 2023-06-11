"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation } from "@apollo/react-hooks";
import { graphql } from "__generated__";
import ArtistEditor from "components/artists/artistEditor";
import { ArtistDetailsFragment } from "__generated__/graphql";
import { getArtist, searchArtists } from "../../../../../graphql/artists";

interface EditArtistProps {
  params: { id: string };
}

export default function EditArtist(props: EditArtistProps) {
  const id = props.params.id;

  return <>{id === "new" ? <CreateArtist /> : <UpdateArtist id={id} />}</>;
}

interface UpdateArtistProps {
  id: string;
}

function UpdateArtist({ id }: UpdateArtistProps) {
  const router = useRouter();
  const { data } = useQuery(getArtist, {
    variables: { id },
  });

  const [updateArtistMutation] = useMutation(updateArtist, {
    refetchQueries: [{ query: searchArtists, variables: { search: "%%" } }],
  });

  const saveArtist = async (artist: ArtistDetailsFragment) => {
    await updateArtistMutation({
      variables: {
        id,
        data: artist,
      },
    }).then((_) => router.back());
  };

  if (!data) return null;

  return data && data.artist && <ArtistEditor artistData={data.artist} done={saveArtist} />;
}

function CreateArtist() {
  const router = useRouter();

  const [addArtist] = useMutation(createArtist, {
    refetchQueries: [{ query: searchArtists, variables: { search: "%%" } }],
  });

  const saveArtist = (artist: ArtistDetailsFragment) => {
    addArtist({
      variables: {
        data: artist,
      },
    }).then((_) => router.back());
  };

  return <ArtistEditor done={saveArtist} />;
}

const updateArtist = graphql(`
  mutation updateArtist($id: Uuid!, $data: ArtistUpdateInput!) {
    updateArtist(id: $id, data: $data) {
      ...ArtistDetails
    }
  }
`);

const createArtist = graphql(`
  mutation createArtist($data: ArtistCreationInput!) {
    createArtist(data: $data) {
      ...ArtistDetails
    }
  }
`);
