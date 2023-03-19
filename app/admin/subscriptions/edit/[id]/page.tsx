"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation } from "@apollo/react-hooks";
import { getFragmentData, graphql } from "../../../../../__generated__";
import {
  SearchSubscriptionDocument,
  SubscriptionDetailsFragment,
} from "../../../../../__generated__/graphql";
import SubscriptionEditor from "../../../../../components/subscriptions/subscriptionEditor";

interface EditSubscriptionProps {
  params: { id: string };
}

export default function EditSubscription(props: EditSubscriptionProps) {
  const id = props.params.id === "new" ? props.params.id : parseInt(props.params.id);

  return <>{id === "new" ? <CreateSubscription /> : <UpdateSubscription id={id} />}</>;
}

interface UpdateSubscriptionProps {
  id: number;
}

function UpdateSubscription({ id }: UpdateSubscriptionProps) {
  const router = useRouter();

  let { data, loading } = useQuery(getSubscription, {
    variables: { id },
  });

  const [updateSubscriptionMutation] = useMutation(updateSubscription);

  const saveSubscription = async (subscription: SubscriptionDetailsFragment) => {
    updateSubscriptionMutation({
      variables: {
        id,
        data: subscription,
      },
    }).then(() => router.back());
  };

  if (!data || !data.subscription || loading) {
    return <>Loading...</>;
  }
  const subscription = getFragmentData(subscriptionDetails, data?.subscription);

  return (
    <>
      subscription && (
      <SubscriptionEditor id={id} subscription={subscription} done={saveSubscription} />
    </>
  );
}

function CreateSubscription() {
  const router = useRouter();

  const [addSubscription] = useMutation(createSubscription, {
    refetchQueries: [{ query: SearchSubscriptionDocument, variables: { search: "%%" } }],
  });

  const saveSubscription = (subscription: SubscriptionDetailsFragment) => {
    addSubscription({
      variables: {
        data: subscription,
      },
    }).then((data) => router.back());
  };

  return <SubscriptionEditor done={saveSubscription} />;
}

const subscriptionDetails = graphql(`
  fragment SubscriptionDetails on Subscription {
    email
    group
  }
`);

const getSubscription = graphql(`
  query getSubscription($id: Int!) {
    subscription(id: $id) {
      id
      ...SubscriptionDetails
    }
  }
`);

const updateSubscription = graphql(`
  mutation updateSubscription($id: Int!, $data: SubscriptionUpdateInput!) {
    updateSubscription(id: $id, data: $data) {
      id
      ...SubscriptionDetails
    }
  }
`);

const createSubscription = graphql(`
  mutation createSubscription($data: SubscriptionCreationInput!) {
    createSubscription(data: $data) {
      id
      ...SubscriptionDetails
    }
  }
`);
