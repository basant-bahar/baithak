import React, { useState } from "react";
import PageHeader from "../../../../../components/common/pageHeader";
import { authUserDetails } from "../../../../../graphql/users";
import { FragmentType, getFragmentData } from "../../../../../__generated__";
import { AuthUserDetailsFragment } from "../../../../../__generated__/graphql";

interface AuthUserEditorProps {
  userData?: FragmentType<typeof authUserDetails>;
  done: Function;
}

const newAuthUser: AuthUserDetailsFragment = {
  firstName: "",
  lastName: "",
  email: "",
};

export default function AuthUserEditor(props: AuthUserEditorProps) {
  const user = getFragmentData(authUserDetails, props.userData);
  const [userData, setUserData] = useState(user ? user : newAuthUser);

  function changeFirstName(e: React.ChangeEvent<HTMLInputElement>) {
    setUserData({ ...userData, firstName: e.currentTarget.value });
  }

  function changeLastName(e: React.ChangeEvent<HTMLInputElement>) {
    setUserData({ ...userData, lastName: e.currentTarget.value });
  }

  function changeEmail(e: React.ChangeEvent<HTMLInputElement>) {
    setUserData({ ...userData, email: e.currentTarget.value });
  }

  const saveUser = async () => {
    props.done(userData);
  };

  return (
    <div className="main-container">
      <PageHeader title={"User"} />
      <div className="form-row">
        <label className="form-label">Name</label>
        <input
          className="simple-input mr-1"
          placeholder="First name"
          value={userData.firstName}
          onChange={changeFirstName}
        />
        <input
          className="simple-input"
          placeholder="Last name"
          value={userData.lastName}
          onChange={changeLastName}
        />
      </div>
      <div className="form-row">
        <label className="form-label">Email</label>
        <input
          className="simple-input"
          placeholder="Email address"
          value={userData.email ? userData.email : ""}
          onChange={changeEmail}
        />
      </div>
      <div className="grid grid-cols-8 mt-4 mb-4">
        <button
          className="text-white bg-green-600 hover:bg-green-700 col-start-3"
          onClick={() => saveUser()}
        >
          Save
        </button>
      </div>
    </div>
  );
}
