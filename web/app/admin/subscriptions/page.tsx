"use client";

import React from "react";
import EntityList, { EntityInfo } from "components/common/entityList";
import { graphql } from "__generated__";
import { SubscriptionDetailsFragment } from "__generated__/graphql";

export default function Subscriptions() {
  const descFn = (subscription: SubscriptionDetailsFragment) => {
    const group = subscription.group ? subscription.group : "All";
    return `${subscription.email} (${group})`;
  };

  return (
    <EntityList
      entityInfo={
        new EntityInfo<SubscriptionDetailsFragment>(
          "Subscription",
          "Subscriptions",
          "subscriptions",
          searchSubscription,
          deleteSubscription
        )
      }
      descFn={descFn}
    />
  );
}

const deleteSubscription = graphql(`
  mutation deleteSubscription($id: Int!) {
    deleteSubscription(id: $id) {
      id
    }
  }
`);

const searchSubscription = graphql(`
  query searchSubscription($search: String) {
    subscriptions(where: { email: { like: $search } }, orderBy: { email: ASC }) {
      id
      ...SubscriptionDetails
    }
  }
`);
