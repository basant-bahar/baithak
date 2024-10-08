"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation } from "@apollo/react-hooks";
import { graphql } from "__generated__";
import {
  formattedNotification,
  getNotification,
  getNotifications,
  notificationConcerts,
} from "../../../../../graphql/notifications";
import { NotificationCreationInput, NotificationDetailsFragment } from "__generated__/graphql";
import NotificationEditor from "components/notifications/notificationsEditor";

interface NotificationProps {
  params: { id: string };
}

export default function Notification(props: NotificationProps) {
  const id = props.params.id;

  return <>{id === "new" ? <CreateNotification /> : <UpdateNotification id={id} />}</>;
}

interface UpdateNotificationProps {
  id: string;
}

function UpdateNotification({ id }: UpdateNotificationProps) {
  const router = useRouter();

  let { data, loading } = useQuery(getNotification, {
    variables: { id },
  });
  const { data: concertsData, loading: concertsLoading } = useQuery(notificationConcerts);
  const [updateNotificationMutation] = useMutation(updateNotification, {
    refetchQueries: [
      { query: getNotification, variables: { id } },
      { query: formattedNotification, variables: { id } },
    ],
  });

  async function saveNotification(notificationUpdateData: NotificationDetailsFragment) {
    const updatedConcert = notificationUpdateData.concert
      ? {
          id: notificationUpdateData.concert?.id,
        }
      : null;
    const updatedNotificationData = {
      subject: notificationUpdateData.subject,
      message: notificationUpdateData.message,
      postMessage: notificationUpdateData.postMessage,
      concert: updatedConcert,
    };

    updateNotificationMutation({
      variables: {
        id,
        data: updatedNotificationData,
      },
    }).then((_) => router.back());
  }

  if (loading || concertsLoading || !data || !concertsData || !data.notification) {
    return null;
  }

  return (
    <NotificationEditor
      notification={data.notification}
      concerts={concertsData.concerts}
      done={saveNotification}
    />
  );
}

function CreateNotification() {
  const router = useRouter();

  const { data: concertsData, loading: concertsLoading } = useQuery(notificationConcerts);
  const [addNotification] = useMutation(createNotification, {
    refetchQueries: [{ query: getNotifications, variables: { search: "%%" } }],
  });

  const saveNotification = (notification: NotificationDetailsFragment) => {
    const notificationToSave: NotificationCreationInput = {
      ...notification,
      ...(notification.concert && {
        concert: {
          id: notification.concert?.id,
        },
      }),
    };
    addNotification({
      variables: {
        data: notificationToSave,
      },
    }).then((_) => router.back());
  };

  if (concertsLoading || !concertsData || !concertsData.concerts) {
    return <>Loading...</>;
  }

  return <NotificationEditor concerts={concertsData.concerts} done={saveNotification} />;
}

const createNotification = graphql(`
  mutation createNotification($data: NotificationCreationInput!) {
    createNotification(data: $data) {
      id
    }
  }
`);

const updateNotification = graphql(`
  mutation updateNotification($id: Uuid!, $data: NotificationUpdateInput!) {
    updateNotification(id: $id, data: $data) {
      id
      ...NotificationDetails
    }
  }
`);
