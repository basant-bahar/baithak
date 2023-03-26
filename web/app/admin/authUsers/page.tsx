"use client";

import React from "react";
import EntityList, { EntityInfo } from "components/common/entityList";
import { searchAuthUsers } from "../../../graphql/users";
import { graphql } from "__generated__";
import { AuthUserDetailsFragment } from "__generated__/graphql";

export default function VenueList() {
  const descFn = (user: AuthUserDetailsFragment) => {
    return `${user.firstName} ${user.lastName} (${user.email})`;
  };

  return (
    <EntityList
      entityInfo={
        new EntityInfo<AuthUserDetailsFragment>(
          "User",
          "Users",
          "authUsers",
          searchAuthUsers,
          deleteAuthUser
        )
      }
      descFn={descFn}
    />
  );
}

const deleteAuthUser = graphql(`
  mutation deleteAuthUser($id: Int!) {
    deleteAuthUser(id: $id) {
      id
    }
  }
`);
