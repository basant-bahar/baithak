"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation, useLazyQuery } from "@apollo/react-hooks";
import { getFragmentData, graphql } from "__generated__";
import PageHeader from "components/common/pageHeader";
import {
  getMembership,
  membershipDetails,
  membershipOnlyDetails,
  searchMembership,
  updateMembershipAndUpdateAuthUser,
} from "../../../../../graphql/memberships";
import {
  MembershipDetailsFragment,
  MembershipOnlyDetailsFragment,
  MembershipUpdateInput,
} from "__generated__/graphql";
import MembershipEditor, { MemberAuthInfo } from "components/memberships/membershipEditor";
import { createAuthUser } from "../../../../../graphql/users";

interface MembershipProps {
  params: { id: string };
}
export default function Membership(props: MembershipProps) {
  const id = props.params.id;

  return id === "new" ? <CreateMembership /> : <UpdateMembership id={id} />;
}

interface UpdateMembershipProps {
  id: string;
}

function UpdateMembership({ id }: UpdateMembershipProps) {
  const router = useRouter();

  let { data, loading } = useQuery(getMembership, {
    variables: { id },
  });

  const [updateMembershipAndUpdateAuthUserMutation] = useMutation(
    updateMembershipAndUpdateAuthUser,
    {
      refetchQueries: [{ query: searchMembership, variables: { search: "%%" } }],
    }
  );

  if (loading || !data || !data.membership) {
    return <>Loading...</>;
  }

  const membership = getFragmentData(membershipDetails, data.membership);
  const membershipData = {
    type: membership.type,
    spouseFirstName: membership.spouseFirstName,
    spouseLastName: membership.spouseLastName,
    spouseEmail: membership.spouseEmail,
    expiry: membership.expiry,
  };
  const authUser = membership.authUser;
  const authUserId = authUser.id;
  const authUserInfo = {
    firstName: authUser.firstName,
    lastName: authUser.lastName,
    email: authUser.email,
  };

  const updateMembership = async (membership: MembershipDetailsFragment) => {
    const updateMembershipData: MembershipUpdateInput = {
      spouseFirstName: membership.spouseFirstName,
      spouseLastName: membership.spouseLastName,
      spouseEmail: membership.spouseEmail,
      type: membership.type,
      expiry: membership.expiry,
    };
    updateMembershipAndUpdateAuthUserMutation({
      variables: {
        id,
        data: updateMembershipData,
        authId: authUserId,
        authUserData: { ...membership.authUser },
      },
    }).then((_) => router.back());
  };

  return (
    <div className="main-container">
      <PageHeader title={"Membership"} />
      {data && data.membership && (
        <MembershipEditor
          membershipId={id}
          membership={membershipData}
          authUserId={authUser.id}
          authUser={authUserInfo}
          done={updateMembership}
        />
      )}
    </div>
  );
}

type NewUser = {
  __typename: "NewUser";
};
type HaveEmail = {
  __typename: "HaveEmail";
};
type NoEmail = {
  __typename: "NoEmail";
};

type WithEmail = {
  __typename: "WithEmail";
  email: string;
};

type WithInfo = {
  __typename: "WithInfo";
  authUserId: string;
  email: string;
  firstName?: string | null;
  lastName?: string | null;
  membershipId?: string | null;
  membershipInfo?: MembershipOnlyDetailsFragment | null;
};

type WithNoEmailInfo = {
  __typename: "WithNoEmailInfo";
  firstName: string;
  lastName: string;
};

type MembershipEditorState = NewUser | HaveEmail | NoEmail | WithEmail | WithNoEmailInfo | WithInfo;

function CreateMembership() {
  const router = useRouter();
  const [userInfoState, setUserInfoState] = useState<MembershipEditorState>({
    __typename: "NewUser",
  });

  const [createMembership] = useMutation(createMembershipAndUpdateAuthUser, {
    refetchQueries: [{ query: searchMembership, variables: { search: "%%" } }],
  });
  const [membershipByEmail] = useLazyQuery(getMembershipsByEmail);
  const [authUserQuery] = useLazyQuery(getAuthUserByEmail);
  const [authUserByNameQuery] = useLazyQuery(getAuthUserByFirstLastName);
  const [createAuthUserMutation] = useMutation(createAuthUser);
  const [membershipByAuthUser] = useLazyQuery(getMembershipByAuthUser);

  const addAuthUser = useCallback(
    async (email: string | null, firstName: string, lastName: string) => {
      const result = await createAuthUserMutation({
        variables: {
          data: {
            email,
            firstName,
            lastName,
          },
        },
      });
      if (result.data?.createAuthUser.id) {
        setUserInfoState({
          __typename: "WithInfo",
          authUserId: result?.data?.createAuthUser.id,
          email: email ? email : "",
          firstName,
          lastName,
        });
      }
    },
    [createAuthUserMutation]
  );

  const findAuthUser = useCallback(
    async (email: string) => {
      const result = await authUserQuery({ variables: { email } });
      const authUser = result?.data?.authUserByEmail;
      if (authUser) {
        if (authUser.email) {
          const membership = await membershipByAuthUser({ variables: { authId: authUser.id } });
          if (membership) {
            const membershipData = getFragmentData(
              membershipOnlyDetails,
              membership.data?.membershipByAuthUser
            );
            setUserInfoState({
              __typename: "WithInfo",
              authUserId: authUser.id,
              firstName: authUser.firstName,
              lastName: authUser.lastName,
              email: authUser.email,
              membershipId: membership.data?.membershipByAuthUser?.id,
              membershipInfo: membershipData,
            });
          } else {
            setUserInfoState({
              __typename: "WithInfo",
              authUserId: authUser.id,
              firstName: authUser.firstName,
              lastName: authUser.lastName,
              email: authUser.email,
            });
          }
        }
      } else if (userInfoState.__typename === "WithEmail") {
        addAuthUser(userInfoState.email, "", "");
      }
    },
    [userInfoState, addAuthUser, authUserQuery, membershipByAuthUser]
  );

  const findAuthUserByName = useCallback(
    async (firstName: string, lastName: string) => {
      const result = await authUserByNameQuery({
        variables: { firstName, lastName },
      });
      if (result?.data?.authUsers && result.data.authUsers.length > 0) {
        const authUser = result.data.authUsers[0];
        if (authUser.email) {
          setUserInfoState({
            __typename: "WithInfo",
            authUserId: authUser.id,
            firstName,
            lastName,
            email: authUser.email,
          });
        }
      } else if (userInfoState.__typename === "WithNoEmailInfo") {
        addAuthUser(null, userInfoState.firstName, userInfoState.lastName);
      }
    },
    [userInfoState, addAuthUser, authUserByNameQuery]
  );

  useEffect(() => {
    if (userInfoState.__typename === "WithEmail") {
      findAuthUser(userInfoState.email);
    } else if (userInfoState.__typename === "WithNoEmailInfo") {
      findAuthUserByName(userInfoState.firstName, userInfoState.lastName);
    }
  }, [userInfoState, findAuthUser, findAuthUserByName]);

  const membershipDoesNotExists = async (
    membership: MembershipDetailsFragment
  ): Promise<boolean> => {
    if (membership.authUser.email) {
      const result = await membershipByEmail({
        variables: { email: membership.authUser.email },
      });
      return !(result.data?.memberships && result.data.memberships.length > 0);
    } else {
      return true;
    }
  };

  const saveMembership = async (membership: MembershipDetailsFragment) => {
    await createMembership({
      variables: {
        membershipData: {
          ...membership,
          authUser: { id: membership.authUser.id },
        },
        authId: membership.authUser.id,
        authUserData: {
          firstName: membership.authUser.firstName,
          lastName: membership.authUser.lastName,
          email: membership.authUser.email,
        },
      },
    });
    router.back();
  };

  const getInnerComponent = () => {
    switch (userInfoState.__typename) {
      case "NewUser":
        return <NewUserComponent changeUserInfo={setUserInfoState} />;
      case "HaveEmail":
        return <HaveEmailComponent changeUserInfo={setUserInfoState} />;
      case "NoEmail":
        return <UserDetailsComponent changeUserInfo={setUserInfoState} />;
      case "WithEmail":
        return <></>;
      case "WithInfo":
        return (
          <MembershipEditor
            membershipId={userInfoState.membershipId}
            membership={userInfoState.membershipInfo}
            authUserId={userInfoState.authUserId}
            authUser={{
              email: userInfoState.email,
              firstName: userInfoState.firstName,
              lastName: userInfoState.lastName,
            }}
            done={saveMembership}
            validate={membershipDoesNotExists}
            allowAuthInfoUpdate={true}
          />
        );
    }
  };

  return (
    <div className="main-container">
      <PageHeader title={"Membership"} />
      {getInnerComponent()}
    </div>
  );
}

interface UserComponentProps {
  changeUserInfo: (membership: MembershipEditorState) => void;
}
function NewUserComponent({ changeUserInfo }: UserComponentProps) {
  return (
    <div className="flex justify-center items-center mb-8">
      <label className="pl-4">{"Do you have new member's email?"}</label>
      <div>
        <button
          className="text-white bg-green-600 hover:bg-green-700 ml-4"
          onClick={() => changeUserInfo({ __typename: "HaveEmail" })}
        >
          Yes
        </button>
        <button
          className="text-white bg-red-400 hover:bg-red-500 ml-2"
          onClick={() => changeUserInfo({ __typename: "NoEmail" })}
        >
          No
        </button>
      </div>
    </div>
  );
}

const HaveEmailComponent = ({ changeUserInfo }: UserComponentProps) => {
  const [email, setEmail] = useState("");

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };
  const handleFindClick = () => {
    changeUserInfo({ __typename: "WithEmail", email });
  };

  return (
    <div className="flex justify-center items-center mb-8">
      <label className="form-label">Email</label>
      <input
        className="simple-input lg:w-80"
        placeholder="Email address"
        value={email}
        onChange={handleEmailChange}
      />
      <button className="text-white bg-green-600 hover:bg-green-700 ml-4" onClick={handleFindClick}>
        Find
      </button>
    </div>
  );
};

const UserDetailsComponent = ({ changeUserInfo }: UserComponentProps) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const changeFirstName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFirstName(e.target.value);
  };
  const changeLastName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLastName(e.target.value);
  };
  const handleContinue = () => {
    changeUserInfo({ __typename: "WithNoEmailInfo", firstName, lastName });
  };

  return (
    <div className="flex-auto p-6">
      <div className="flex justify-center items-center mb-8">
        <label className="form-label">Name</label>
        <input
          className="simple-input mr-1"
          placeholder="First name"
          value={firstName}
          onChange={changeFirstName}
        />
        <input
          className="simple-input"
          placeholder="Last name"
          value={lastName}
          onChange={changeLastName}
        />
      </div>
      <button className="text-white bg-green-600 hover:bg-green-700 ml-4" onClick={handleContinue}>
        Continue
      </button>
    </div>
  );
};

const createMembershipAndUpdateAuthUser = graphql(`
  mutation createMembershipAndUpdateAuthUser(
    $membershipData: MembershipCreationInput!
    $authId: Uuid!
    $authUserData: AuthUserUpdateInput!
  ) {
    createMembership(data: $membershipData) {
      ...MembershipDetails
    }
    updateAuthUser(id: $authId, data: $authUserData) {
      id
    }
  }
`);

const getMembershipsByEmail = graphql(`
  query getMembershipsByEmail($email: String!) {
    memberships(where: { authUser: { email: { eq: $email } } }) {
      ...MembershipDetails
    }
  }
`);

const getAuthUserByEmail = graphql(`
  query getAuthUserByEmail($email: String!) {
    authUserByEmail(email: $email) {
      id
      email
      firstName
      lastName
    }
  }
`);

const getAuthUserByFirstLastName = graphql(`
  query getAuthUserByFirstLastName($firstName: String!, $lastName: String!) {
    authUsers(
      where: { and: [{ firstName: { eq: $firstName } }, { lastName: { eq: $lastName } }] }
    ) {
      id
      email
    }
  }
`);

const getMembershipByAuthUser = graphql(`
  query getMembershipByAuthUser($authId: Uuid!) {
    membershipByAuthUser(authUser: { id: $authId }) {
      id
      ...MembershipOnlyDetails
    }
  }
`);
