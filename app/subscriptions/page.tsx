"use client";

import { useMutation } from "@apollo/react-hooks";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import PageHeader from "../../components/common/pageHeader";
import Verify from "../../components/subscriptions/verify";
import { graphql } from "../../__generated__";

interface SubscriptionProps {
  searchParams: {
    action?: string;
    email?: string;
    code?: string;
  };
}

export default function Subscriptions(props: SubscriptionProps) {
  const confirmationMessage =
    "A confirmation email has been sent. Please follow the instructions in it.";
  const [email, setEmail] = useState("");
  const [subscribeSuccessful, setSubscribeSuccessful] = useState<boolean | undefined>();
  const [unsubscribeSuccessful, setUnsubscribeSuccessful] = useState<boolean | undefined>();
  const [errorMessage, setErrorMessage] = useState<string | undefined>();
  const [initiateSubscribeMutation] = useMutation(initiateSubscribe);
  const [initiateUnsubscriptionMutation] = useMutation(initiateUnsubscribe);

  const action = props.searchParams.action;
  const isVerifySubscription = action === "subscribe";
  const isVerifyUnsubscribe = action === "unsubscribe";
  const verifyFunc = isVerifySubscription ? verifySubscribe : verifyUnsubscribe;
  const emailParam = props.searchParams.email;
  const codeParam = props.searchParams.code;
  const showVerify = (isVerifySubscription || isVerifyUnsubscribe) && emailParam && codeParam;

  const showEmailInput = !subscribeSuccessful && !unsubscribeSuccessful && !errorMessage && !action;

  const emailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.currentTarget.value);
  };

  const subscribe = async (e: React.MouseEvent<HTMLElement>) => {
    const result = await initiateSubscribeMutation({
      variables: {
        email,
      },
    });
    result && result?.data?.initiateSubscribe === "OK" && setSubscribeSuccessful(true);
  };

  const unsubscribe = async (e: React.MouseEvent<HTMLElement>) => {
    const result = await initiateUnsubscriptionMutation({
      variables: {
        email: email,
      },
    });
    result && result?.data?.initiateUnsubscribe === "OK" && setUnsubscribeSuccessful(true);
  };

  return (
    <div className="main-container">
      <PageHeader title={"Mailing List"} />
      {subscribeSuccessful && <div className="text-center">{confirmationMessage}</div>}
      {unsubscribeSuccessful && <div className="text-center">{confirmationMessage}</div>}
      {errorMessage && <div className="text-center">{errorMessage}</div>}
      {showVerify && (
        <Verify
          email={emailParam}
          code={codeParam}
          action={action}
          setErrorMessage={setErrorMessage}
          verifyFunc={verifyFunc}
        />
      )}
      {showEmailInput && (
        <>
          <div className="form-row">
            <label className="form-label">Email address</label>
            <input
              className="simple-input"
              placeholder="Email address"
              type="email"
              value={email}
              onChange={emailChange}
            />
          </div>
          <div className="grid mb-4 max-lg:grid-cols-4 lg:grid-cols-8">
            <button
              className="bg-green-400 hover:bg-green-500 disabled:opacity-50 mr-2 col-start-3 max-lg:col-start-2"
              onClick={subscribe}
            >
              Subscribe
            </button>
            <button
              className="bg-blue-400 hover:bg-blue-500 disabled:opacity-50"
              onClick={unsubscribe}
            >
              Unsubscribe
            </button>
          </div>
        </>
      )}
    </div>
  );
}

const initiateSubscribe = graphql(`
  mutation initiateSubscribe($email: String!) {
    initiateSubscribe(email: $email)
  }
`);

const verifySubscribe = graphql(`
  mutation verifySubscribe($email: String!, $code: String!) {
    verifySubscribe(email: $email, code: $code)
  }
`);

const initiateUnsubscribe = graphql(`
  mutation initiateUnsubscribe($email: String!) {
    initiateUnsubscribe(email: $email)
  }
`);

const verifyUnsubscribe = graphql(`
  mutation verifyUnsubscribe($email: String!, $code: String!) {
    verifyUnsubscribe(email: $email, code: $code)
  }
`);
