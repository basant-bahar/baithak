"use client";

import React, { useEffect, useState } from "react";
import { useLazyQuery, useMutation, useQuery } from "@apollo/client";
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
  const { data: meData, loading: meLoading } = useQuery(me, {
    variables: { clerkId: user?.id as string },
  });
  const myAuthUser = meData?.authUsers[0];
  const myAuthUserId = myAuthUser?.id;

  useEffect(() => {
    if (user && myAuthUser) {
      const email = user?.emailAddresses[0].emailAddress;
      setMemberAuthInfo({
        firstName: myAuthUser?.firstName || user.firstName || "",
        lastName: myAuthUser?.lastName || user.lastName || "",
        email: email,
      });
      getMembership({ variables: { clerkId: user.id } });
    }
  }, [user, myAuthUser, getMembership]);

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
      if (user && meData && meData.authUsers.length === 1) {
        const myId = meData?.authUsers[0].id;
        createMembershipMutation({
          variables: {
            data: {
              ...membershipToSave,
              authUser: {
                id: myId,
              },
            },
          },
        }).then((data) => afterCreate(data));
      }
    }
  };

  if (loading || !membership || !memberAuthInfo || meLoading || !meData) {
    return null;
  }

  return (
    <div className="main-container">
      <PageHeader title={membershipId ? "Manage Membership" : "Create Membership"} />
      <MembershipEditor
        membershipId={membershipId}
        membership={membership}
        authUserId={myAuthUserId}
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

const me = graphql(`
  query me($clerkId: String!) {
    authUsers(where: { clerkId: { eq: $clerkId } }) {
      id
      firstName
      lastName
    }
  }
`);
