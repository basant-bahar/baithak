"use client";

import { useMutation } from "@apollo/react-hooks";
import React, { useState } from "react";
import PageHeader from "../../../../components/common/pageHeader";
import { graphql } from "../../../../__generated__";
import { InitiateResetPasswordDocument } from "../../../../__generated__/graphql";

export default function ResetPasswordRequestPage() {
  const [username, setUsername] = useState("");
  const [resetSuccessful, setResetSuccessful] = useState<boolean | undefined>();
  const [initiateResetPasswordMutation] = useMutation(InitiateResetPasswordDocument);

  const changeUsername = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
  };

  const resetPassword = async (e: React.MouseEvent) => {
    const result = await initiateResetPasswordMutation({
      variables: {
        email: username,
      },
    });
    result && result?.data?.initiateResetPassword === "OK" && setResetSuccessful(true);
  };

  return (
    <div className="main-container">
      <PageHeader title="Reset Password Request" />
      <div className="w-9/12 mx-auto">
        {!resetSuccessful && (
          <>
            <div className="">
              Please enter your email address below and we will send you a password reset email
              soon.
            </div>
            <div className="w-3/12 text-center">
              <input
                className="w-full mt-2 mb-2 simple-input"
                type="text"
                placeholder="Email"
                onChange={changeUsername}
              />
            </div>
            <button className="btn-blue py-1 px-4 mt-4" onClick={resetPassword}>
              Send request
            </button>
          </>
        )}
        {resetSuccessful && (
          <div>
            An email with a link to reset password has been sent. Please follow the instructions in
            it.
          </div>
        )}
      </div>
    </div>
  );
}

const initiateResetPassword = graphql(`
  mutation initiateResetPassword($email: String!) {
    initiateResetPassword(email: $email)
  }
`);
