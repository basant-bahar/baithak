"use client";

import React, { useCallback, useEffect, useState } from "react";
import { GoogleButton, GoogleCredentialResponse } from "../../components/auth/googleButton";
import { useLazyQuery } from "@apollo/client";
import { useAuth } from "../../components/auth/authProvider";
import Link from "next/link";
import { graphql } from "../../__generated__";
import { LoginNormalDocument, LoginSocialDocument } from "../../__generated__/graphql";
import { AccessResult } from "../../components/auth/protected";

type LoginProps = {
  searchParams: { reason?: AccessResult; redirectUrl?: string };
};

export default function Login({ searchParams: { reason, redirectUrl } }: LoginProps) {
  const [user, login, logout] = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | undefined>();

  const [loginSocial, { loading: loadingSocial, error: errorSocial, data: socialLoginData }] =
    useLazyQuery(LoginSocialDocument);

  const [loginNormal, { loading: loadingNormal, error: errorNormal, data: normalLoginData }] =
    useLazyQuery(LoginNormalDocument);

  useEffect(() => {
    if (errorNormal) setError(errorNormal.message);
  }, [errorNormal]);

  const googleSignInCallback = useCallback(
    async (info: GoogleCredentialResponse) => {
      const { data } = await loginSocial({
        variables: { provider: "google", code: info.credential },
      });
      if (data) {
        login(data.loginSocial, redirectUrl);
      } else {
        console.log("Failed to login");
      }
    },
    [loginSocial]
  );

  const normalSignInCallback = async () => {
    const { data } = await loginNormal({ variables: { email: username, password: password } });
    if (data) {
      login(data.loginNormal, redirectUrl);
    } else {
      console.log("Failed to login");
    }
  };

  const changeUsername = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
  };

  const changePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    setError(undefined);
  };

  const insufficientMessage =
    "You do not have authorization to access the page you requested. Please login with appropriate credentials.";
  const authMessage = "Please login to access the page you requested.";
  const loginReason =
    reason === AccessResult.InsufficientPrivileges
      ? insufficientMessage
      : reason === AccessResult.AuthNeeded
      ? authMessage
      : undefined;

  return (
    <div className="main-container p-16">
      {loginReason && (
        <div className="border-b-2 pb-6 mb-8 text-center text-red-400">{loginReason}</div>
      )}
      <div className="flex gap-x-20 items-center p-2">
        <div className="w-2/4 text-center">
          For existing members with a Google or Facebook account as well as new members
        </div>
        <div>
          <GoogleButton onCredentialResponse={googleSignInCallback} />
        </div>
      </div>
      <div className="flex gap-x-16 items-center p-2 pt-12">
        <div className="w-2/4 text-center">
          Only for existing members without a Google or Facebook account. If you have any questions,
          please&nbsp;
          <Link href={"about/contact-us/email"} className="text-blue-500">
            contact us
          </Link>
          .
        </div>
        <div className="flex flex-col">
          <input
            className="mt-2 mb-2 simple-input w-full"
            type="text"
            placeholder="Email"
            onChange={changeUsername}
          />
          <input
            className="mt-2 mb-2 simple-input w-full"
            type="password"
            placeholder="Password"
            onChange={changePassword}
          />
          {error && <div className="text-red-500 pt-2">{error}</div>}
          <div className="flex items-center">
            <button
              className="bg-blue-400 hover:bg-blue-500 py-1 px-4 mt-4 mr-3"
              onClick={normalSignInCallback}
            >
              Sign In
            </button>
            <Link href={"login/reset/request"} className="mt-4 text-blue-500">
              Forgot password?
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

const loginSocial = graphql(`
  query loginSocial($provider: String!, $code: String!) {
    loginSocial(provider: $provider, code: $code)
  }
`);

const loginNormal = graphql(`
  query loginNormal($email: String!, $password: String!) {
    loginNormal(email: $email, password: $password)
  }
`);

const initiateResetPassword = graphql(`
  mutation initiateResetPassword($email: String!) {
    initiateResetPassword(email: $email)
  }
`);

const resetPassword = graphql(`
  mutation resetPassword($email: String!, $password: String!, $code: String!) {
    resetPassword(email: $email, password: $password, code: $code)
  }
`);
