import React, { useState } from "react";
import { SubscriptionDetailsFragment } from "../../__generated__/graphql";
import PageHeader from "../common/pageHeader";

type SubscriptionEditorProps = {
  id?: string;
  subscription?: SubscriptionDetailsFragment;
  done: Function;
};

const newSubscription: SubscriptionDetailsFragment = {
  email: "",
  group: "",
};

export default function SubscriptionEditor(props: SubscriptionEditorProps) {
  const [subscription, setSubscription] = useState(
    props.subscription ? props.subscription : newSubscription
  );
  const group = subscription.group ? subscription.group : "All";

  const emailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSubscription({ ...subscription, email: e.currentTarget.value });
  };

  function groupChange(e: React.ChangeEvent<HTMLSelectElement>) {
    setSubscription({ ...subscription, group: e.currentTarget.value });
  }

  const saveSubscription = async () => {
    props.done(subscription);
  };

  return (
    <div className="main-container">
      <PageHeader title={"Subscription"} />
      <div className="flex-auto lg:p-6">
        <div className="form-row">
          <label className="form-label">Email address</label>
          <input
            className="simple-input"
            placeholder="Email address"
            type="email"
            value={subscription.email}
            onChange={emailChange}
          />
        </div>
        <div className="form-row">
          <label className="form-label">Group</label>
          <select className="mr-2 border-b" value={group} onChange={groupChange}>
            <option value="">--Select group--</option>
            <option value="test">Test</option>
            <option value="all">All</option>
          </select>
        </div>
        <div className="form-row mb-4">
          <div className="flex gap-2 col-start-2 max-xs:col-start-1">
            <button
              className="text-white bg-green-600 hover:bg-green-700"
              onClick={saveSubscription}
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
