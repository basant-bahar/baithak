"use client";

import { useMutation } from "@apollo/react-hooks";
import { useSearchParams } from "next/navigation";
import React, { useState } from "react";
import PageHeader from "components/common/pageHeader";
import { graphql } from "__generated__";
import { ResetPasswordDocument } from "__generated__/graphql";

interface ResetQueryParam {
  email?: string;
  code?: string;
}

export default function ResetPassword() {
  const [verified, setVerified] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | undefined>();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordMismatch, setPasswordMismatch] = useState(false);
  const [resetPasswordMutation] = useMutation(ResetPasswordDocument);
  const searchParams = useSearchParams();
  const email = searchParams?.get("email");
  const code = searchParams?.get("code");

  const changePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    setPasswordMismatch(false);
  };

  const changeConfirmPassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(e.target.value);
    setPasswordMismatch(false);
  };

  const resetPassword = async () => {
    if (!email || !code) {
      setErrorMessage("Invalid link");
    } else {
      if (password === confirmPassword) {
        const { data, errors } = await resetPasswordMutation({
          variables: {
            email,
            password,
            code,
          },
        });
        if (data) {
          setVerified(true);
        } else if (errors && errors.length > 0) {
          setErrorMessage(errors[0].message);
        } else {
          setErrorMessage("Something went wrong, please try again.");
        }
      } else {
        setPasswordMismatch(true);
      }
    }
  };

  return (
    <div className="main-container">
      <PageHeader title="Reset Password" />
      {!verified && !errorMessage && (
        <div className="flex flex-col items-center">
          <input
            className="w-1/3 mt-2 mb-2 simple-input"
            type="password"
            placeholder="Password (minimum 8 characters)"
            minLength={8}
            onChange={changePassword}
          />
          <input
            className="w-1/3 mt-2 mb-2 simple-input"
            type="password"
            placeholder="Confirm Password"
            minLength={8}
            onChange={changeConfirmPassword}
          />
          {passwordMismatch && (
            <div className="text-center text-red-500 pt-2">
              Password and confirm password doesn&apos;t match
            </div>
          )}
          <button className="btn-blue py-1 px-4 mt-4" onClick={resetPassword}>
            Reset
          </button>
        </div>
      )}
      {verified && !errorMessage && (
        <div className="text-center">Your Password has been reseted!</div>
      )}
      {errorMessage && <div className="text-center">{errorMessage}</div>}
    </div>
  );
}

const resetPassword = graphql(`
  mutation resetPassword($email: String!, $password: String!, $code: String!) {
    resetPassword(email: $email, password: $password, code: $code)
  }
`);
