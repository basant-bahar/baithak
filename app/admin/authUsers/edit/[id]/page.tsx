"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation } from "@apollo/react-hooks";
import { graphql } from "../../../../../__generated__";
import { createAuthUser, searchAuthUsers } from "../../../../../graphql/users";
import { AuthUserDetailsFragment } from "../../../../../__generated__/graphql";
import AuthUserEditor from "./AuthUserEditor";

interface EditUserProps {
  params: { id: string };
}

export default function EditUser(props: EditUserProps) {
  const id = props.params.id === "new" ? props.params.id : parseInt(props.params.id);

  return <>{id === "new" ? <CreateUser /> : <UpdateUser id={id} />}</>;
}

interface UpdateUserProps {
  id: number;
}

function UpdateUser({ id }: UpdateUserProps) {
  const router = useRouter();
  const { data } = useQuery(getAuthUser, {
    variables: { id },
  });

  const [updateVenueMutation] = useMutation(updateAuthUser, {
    refetchQueries: [{ query: searchAuthUsers, variables: { search: "%%" } }],
  });

  const saveUser = async (user: AuthUserDetailsFragment) => {
    updateVenueMutation({
      variables: {
        id,
        data: user,
      },
    }).then((_) => router.back());
  };

  if (!data) return null;

  return data && data.authUser && <AuthUserEditor userData={data.authUser} done={saveUser} />;
}

function CreateUser() {
  const router = useRouter();

  const [createVenueMutation] = useMutation(createAuthUser, {
    refetchQueries: [{ query: searchAuthUsers, variables: { search: "%%" } }],
  });

  const saveUser = (user: AuthUserDetailsFragment) => {
    createVenueMutation({
      variables: {
        data: user,
      },
    }).then((_) => router.back());
  };

  return <AuthUserEditor done={saveUser} />;
}

const getAuthUser = graphql(`
  query getAuthUser($id: Int!) {
    authUser(id: $id) {
      id
      ...AuthUserDetails
    }
  }
`);

const updateAuthUser = graphql(`
  mutation updateAuthUser($id: Int!, $data: AuthUserUpdateInput!) {
    updateAuthUser(id: $id, data: $data) {
      ...AuthUserDetails
    }
  }
`);
