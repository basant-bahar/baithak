"use client";

import React from "react";
import { useQuery } from "@apollo/react-hooks";
import Link from "next/link";
import { getFragmentData, graphql } from "__generated__";
import NotificationView from "components/notifications/notificationView";
import { getNotification, notificationDetails } from "../../../../../graphql/notifications";

interface NotificationProps {
  params: { id: string };
}

export default function ViewNotification({ params: { id: idStr } }: NotificationProps) {
  const id = parseInt(idStr);

  const { data, loading } = useQuery(getNotification, {
    variables: { id },
  });
  const { data: formatedNotificationData, loading: formatedNotificationLoading } = useQuery(
    formatedNotification,
    {
      variables: { id },
    }
  );

  if (loading || formatedNotificationLoading || !data || !formatedNotificationData) {
    return <>Loading...</>;
  }
  const notification = getFragmentData(notificationDetails, data.notification);

  return (
    <div className="main-container mb-2">
      <NotificationView
        subject={notification.subject}
        formatedBody={formatedNotificationData.formatNotification}
      />
      <div className="flex justify-center p-2">
        <Link
          href={`/admin/notifications/edit/${id}`}
          className="bg-blue-400 hover:bg-blue-500 w-16 h-8 mr-2 rounded-md flex justify-center items-center disabled:opacity-50"
        >
          Edit
        </Link>
        <Link
          href={`/admin/notifications/email/${id}`}
          className="bg-green-400 hover:bg-green-500 w-16 h-8 mr-2 rounded-md flex justify-center items-center disabled:opacity-50"
        >
          Email
        </Link>
      </div>
    </div>
  );
}

const formatedNotification = graphql(`
  query formatedNotification($id: Int!) {
    formatNotification(concertNotificationId: $id)
  }
`);
