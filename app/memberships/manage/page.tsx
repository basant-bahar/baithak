"use client";

import React, { useEffect, useState } from "react";
import { useLazyQuery, useMutation } from "@apollo/client";
import MembershipEditor, { MemberAuthInfo } from "../../../components/memberships/membershipEditor";
import { useAuth } from "../../../components/auth/authProvider";
import { client } from "../../apollo-client";
import {
  MembershipOnlyDetailsFragment,
  MembershipOnlyDetailsFragmentDoc,
} from "../../../__generated__/graphql";
import Protected from "../../../components/auth/protected";
import PageHeader from "../../../components/common/pageHeader";
import { membershipOnlyDetails, updateMembership } from "../../../graphql/memberships";
import { getFragmentData, graphql } from "../../../__generated__";

export default function ManageMembership() {
  const newMembership = {
    phone: "",
    spouseFirstName: "",
    spouseLastName: "",
    spouseEmail: "",
    type: "",
    expiry: null,
  };
  console.log("ManageMembership ");

  const [user] = useAuth();
  const [membership, setMembership] = useState<MembershipOnlyDetailsFragment | undefined>();
  const [membershipId, setMembershipId] = useState<number | undefined>();
  const [memberAuthInfo, setMemberAuthInfo] = useState<MemberAuthInfo | undefined>();

  let [getMembership, { loading, error, data }] = useLazyQuery(getMembershipByAuthId);
  const [updateMembershipMutation] = useMutation(updateMembership);
  const [createMembershipMutation] = useMutation(createMembership);
  console.log("user ", user);
  useEffect(() => {
    if (user) {
      setMemberAuthInfo({ firstName: user.firstName, lastName: user.lastName, email: user.email });
      getMembership({ variables: { authId: user.sub } });
    }
  }, [user]);

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
            phone: membershipToSave.phone,
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
                id: user.sub,
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
    <Protected>
      <div className="main-container">
        <PageHeader title={membershipId ? "Manage Membership" : "Create Membership"} />
        <MembershipEditor
          membershipId={membershipId}
          membership={membership}
          authId={user ? user.sub : undefined}
          authUser={memberAuthInfo}
          done={saveMembership}
          manage={true}
        />
      </div>
    </Protected>
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
  query getMembershipByAuthId($authId: Int!) {
    memberships(where: { authUser: { id: { eq: $authId } } }) {
      id
      ...MembershipOnlyDetails
    }
  }
`);
