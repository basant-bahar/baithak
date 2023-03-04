"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation, useLazyQuery } from "@apollo/react-hooks";
import Protected from "../../../../../components/auth/protected";
import { getFragmentData, graphql } from "../../../../../__generated__";
import PageHeader from "../../../../../components/common/pageHeader";
import {
  membershipDetails,
  searchMembership,
  updateMembership,
} from "../../../../../graphql/memberships";
import {
  MembershipDetailsFragment,
  MembershipUpdateInput,
} from "../../../../../__generated__/graphql";
import MembershipEditor, {
  MemberAuthInfo,
} from "../../../../../components/memberships/membershipEditor";
import { useAuth } from "../../../../../components/auth/authProvider";
import { createAuthUser } from "../../../../../graphql/users";

interface MembershipProps {
  params: { id: string };
}
export default function Membership(props: MembershipProps) {
  const router = useRouter();
  const id = props.params.id === "new" ? props.params.id : parseInt(props.params.id);

  return (
    <Protected>{id === "new" ? <CreateMembership /> : <UpdateMembership id={id} />}</Protected>
  );
}

interface UpdateMembershipProps {
  id: number;
}
function UpdateMembership({ id }: UpdateMembershipProps) {
  const router = useRouter();

  let { data, loading } = useQuery(getMembership, {
    variables: { id },
  });

  const [updateMembershipMutation] = useMutation(updateMembership);

  const saveMembership = async (membership: MembershipDetailsFragment) => {
    const updateMembershipData: MembershipUpdateInput = {
      phone: membership.phone,
      spouseFirstName: membership.spouseFirstName,
      spouseLastName: membership.spouseLastName,
      spouseEmail: membership.spouseEmail,
      type: membership.type,
      expiry: membership.expiry,
    };
    updateMembershipMutation({
      variables: {
        id,
        data: updateMembershipData,
      },
    }).then((_) => router.back());
  };

  if (loading || !data) {
    return <>Loading...</>;
  }

  const membership = getFragmentData(membershipDetails, data.membership);
  const membershipData = {
    type: membership.type,
    phone: membership.phone,
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

  return (
    <div className="main-container">
      <PageHeader title={"Membership"} />
      {data && data.membership && (
        <MembershipEditor
          membershipId={id}
          membership={membershipData}
          authId={authUserId}
          authUser={authUserInfo}
          done={saveMembership}
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
  id: number;
  email: string;
  firstName: string;
  lastName: string;
};

type WithNoEmailInfo = {
  __typename: "WithNoEmailInfo";
  firstName: string;
  lastName: string;
};

type MembershipEditorState = NewUser | HaveEmail | NoEmail | WithEmail | WithNoEmailInfo | WithInfo;

function CreateMembership() {
  const router = useRouter();
  const [user] = useAuth();
  const [userInfoState, setUserInfoState] = useState<MembershipEditorState>({
    __typename: "NewUser",
  });
  const [authUser, setAuthUser] = useState<{ id: number | undefined } & MemberAuthInfo>({
    id: undefined,
    firstName: "",
    lastName: "",
    email: "",
  });
  const newMembership = {
    phone: "",
    spouseFirstName: "",
    spouseLastName: "",
    spouseEmail: "",
    type: "",
    expiry: null,
  };

  const [createMembership] = useMutation(createMembershipAndUpdateAuthUser, {
    refetchQueries: [{ query: searchMembership, variables: { search: "%%" } }],
  });
  const [membershipByEmail] = useLazyQuery(getMembershipsByEmail);
  const [authUserQuery] = useLazyQuery(getAuthUserByEmail);
  const [authUserByNameQuery] = useLazyQuery(getAuthUserByFirstLastName);
  const [createAuthUserMutation] = useMutation(createAuthUser);

  useEffect(() => {
    if (userInfoState.__typename === "WithEmail") {
      findAuthUser(userInfoState.email);
    } else if (userInfoState.__typename === "WithNoEmailInfo") {
      findAuthUserByName(userInfoState.firstName, userInfoState.lastName);
    }
  }, [userInfoState]);

  async function addAuthUser(email: string | null, firstName: string, lastName: string) {
    const result = await createAuthUserMutation({
      variables: {
        data: {
          email,
          firstName,
          lastName,
          verified: true,
        },
      },
    });
    if (result.data?.createAuthUser.id && email) {
      setAuthUser({
        id: result?.data?.createAuthUser.id,
        firstName,
        lastName,
        email,
      });
      setUserInfoState({
        __typename: "WithInfo",
        id: result?.data?.createAuthUser.id,
        email,
        firstName,
        lastName,
      });
    }
  }

  const membershipDoesNotExists = async (membership: MembershipDetailsFragment) => {
    if (membership.authUser.email) {
      const result = await membershipByEmail({
        variables: { email: membership.authUser.email },
      });
      return !(result.data?.memberships && result.data.memberships.length > 0);
    }
  };

  const saveMembership = async (membership: MembershipDetailsFragment) => {
    await createMembership({
      variables: {
        membershipData: { ...membership, authUser: { id: membership.authUser.id } },
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

  const findAuthUser = async (email: string) => {
    const result = await authUserQuery({ variables: { email } });
    if (result?.data?.authUsers && result.data.authUsers.length > 0) {
      const authUser = result.data.authUsers[0];
      if (authUser.email) {
        setUserInfoState({
          __typename: "WithInfo",
          id: authUser.id,
          firstName: authUser.firstName,
          lastName: authUser.lastName,
          email: authUser.email,
        });
        setAuthUser({
          id: authUser.id,
          firstName: authUser.firstName,
          lastName: authUser.lastName,
          email: authUser.email,
        });
      }
    } else if (userInfoState.__typename === "WithEmail") {
      addAuthUser(userInfoState.email, "", "");
    }
  };

  const findAuthUserByName = async (firstName: string, lastName: string) => {
    const result = await authUserByNameQuery({ variables: { firstName, lastName } });
    if (result?.data?.authUsers && result.data.authUsers.length > 0) {
      const authUser = result.data.authUsers[0];
      if (authUser.email) {
        setUserInfoState({
          __typename: "WithInfo",
          id: authUser.id,
          firstName,
          lastName,
          email: authUser.email,
        });
      }
    } else if (userInfoState.__typename === "WithNoEmailInfo") {
      addAuthUser(null, userInfoState.firstName, userInfoState.lastName);
    }
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
            authId={authUser.id}
            authUser={authUser}
            done={saveMembership}
            validate={membershipDoesNotExists}
            allowAuthInfoUpdate={true}
          />
        );
    }
  };

  return (
    <>
      {user && newMembership && (
        <div className="main-container">
          <PageHeader title={"Membership"} />
          {getInnerComponent()}
        </div>
      )}
    </>
  );
}

interface UserComponentProps {
  changeUserInfo: (membership: MembershipEditorState) => void;
}
function NewUserComponent({ changeUserInfo }: UserComponentProps) {
  return (
    <div className="flex justify-center items-center mb-8">
      <label className="pl-4">Do you have new member's email?</label>
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
      <div className="row">
        <label className="bb-label">Name</label>
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
      <button className="btn-green ml-4" onClick={handleContinue}>
        Continue
      </button>
    </div>
  );
};

const getMembership = graphql(`
  query getMembership($id: Int!) {
    membership(id: $id) {
      id
      ...MembershipDetails
    }
  }
`);

const createMembershipAndUpdateAuthUser = graphql(`
  mutation createMembershipAndUpdateAuthUser(
    $membershipData: MembershipCreationInput!
    $authId: Int!
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
    authUsers(where: { email: { eq: $email } }) {
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