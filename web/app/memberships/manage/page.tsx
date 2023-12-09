"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useLazyQuery, useMutation } from "@apollo/client";
import MembershipEditor, { MemberAuthInfo } from "components/memberships/membershipEditor";
import { useApolloClient } from "@apollo/client";
import {
  MembershipOnlyDetailsFragment,
  MembershipOnlyDetailsFragmentDoc,
} from "__generated__/graphql";
import PageHeader from "components/common/pageHeader";
import { membershipOnlyDetails, updateMembership } from "../../../graphql/memberships";
import { getFragmentData, graphql } from "__generated__";
import { useUser } from "@clerk/clerk-react";

const newMembership = {
  spouseFirstName: "",
  spouseLastName: "",
  spouseEmail: "",
  type: "",
  expiry: null,
};

export default function ManageMembership() {
  const { user } = useUser();
  const client = useApolloClient();

  const [membership, setMembership] = useState<MembershipOnlyDetailsFragment | undefined>();
  const [membershipId, setMembershipId] = useState<string | undefined>();
  const [memberAuthInfo, setMemberAuthInfo] = useState<MemberAuthInfo | undefined>();

  const [getMembership, { loading, error, data }] = useLazyQuery(getMembershipByAuthId);
  const [updateMembershipMutation] = useMutation(updateMembership);
  const [createMembershipMutation] = useMutation(createMembership);

  useEffect(() => {
    if (user) {
      const email = user?.emailAddresses[0].emailAddress;
      setMemberAuthInfo({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: email,
      });
      getMembership({ variables: { clerkId: user.id } });
    }
  }, [user, getMembership]);

  useEffect(() => {
    if (!loading && data) {
      if (data?.memberships.length > 0) {
        const membershipData = data.memberships[0];
        setMembership(getFragmentData(membershipOnlyDetails, membershipData));
        setMembershipId(membershipData.id);
      } else {
        setMembership(newMembership);
      }
    }
  }, [loading, data]);

  function afterCreate(data: any) {
    setMembership(data.data.createMembership);
    setMembershipId(data.data.createMembership.id);
    client.cache.modify({
      fields: {
        memberships(existingMemberships, { readField }) {
          const newMembershipRef = client.cache.writeFragment({
            data: data.data.createMembership,
            fragment: MembershipOnlyDetailsFragmentDoc,
          });
          return [...existingMemberships, newMembershipRef];
        },
      },
    });
  }

  const saveMembership = (membershipToSave: MembershipOnlyDetailsFragment) => {
    if (membershipId) {
      updateMembershipMutation({
        variables: {
          id: membershipId,
          data: {
            spouseFirstName: membershipToSave.spouseFirstName,
            spouseLastName: membershipToSave.spouseLastName,
            spouseEmail: membershipToSave.spouseEmail,
          },
        },
      });
    } else {
      if (user) {
        createMembershipMutation({
          variables: {
            data: {
              authUser: {
                id: user.id,
              },
              ...membershipToSave,
            },
          },
        }).then((data) => afterCreate(data));
      }
    }
  };

  if (loading || !membership || !memberAuthInfo) return <div>Loading...</div>;

  return (
    <div className="main-container">
      <PageHeader title={membershipId ? "Manage Membership" : "Create Membership"} />
      <MembershipEditor
        membershipId={membershipId}
        membership={membership}
        clerkId={user ? user.id : undefined}
        authUser={memberAuthInfo}
        done={saveMembership}
        manage={true}
      />
    </div>
  );
}

const createMembership = graphql(`
  mutation createMembership($data: MembershipCreationInput!) {
    createMembership(data: $data) {
      id
      ...MembershipOnlyDetails
    }
  }
`);

const getMembershipByAuthId = graphql(`
  query getMembershipByAuthId($clerkId: String!) {
    memberships(where: { authUser: { clerkId: { eq: $clerkId } } }) {
      id
      ...MembershipOnlyDetails
    }
  }
`);
