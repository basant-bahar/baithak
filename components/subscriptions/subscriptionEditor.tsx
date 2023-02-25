import React, { useState } from "react";
import { SubscriptionDetailsFragment } from "../../__generated__/graphql";
import PageHeader from "../common/pageHeader";

type SubscriptionEditorProps = {
  id?: number;
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
      <div className="flex-auto p-6">
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
            <option key="test">Test</option>
            <option key="all">All</option>
          </select>
        </div>
        <div className="grid mb-4 max-lg:grid-cols-4 lg:grid-cols-8">
          <button
            className="text-white bg-green-600 hover:bg-green-700 col-start-3 max-lg:col-start-2 lg:ml-2"
            onClick={saveSubscription}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
