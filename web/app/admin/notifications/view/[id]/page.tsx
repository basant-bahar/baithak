"use client";

import React from "react";
import { useQuery } from "@apollo/react-hooks";
import Link from "next/link";
import { getFragmentData } from "__generated__";
import NotificationView from "components/notifications/notificationView";
import {
  formattedNotification,
  getNotification,
  notificationDetails,
} from "../../../../../graphql/notifications";

interface NotificationProps {
  params: { id: string };
}

export default function ViewNotification({ params: { id } }: NotificationProps) {
  const { data, loading } = useQuery(getNotification, {
    variables: { id },
  });
  const { data: formattedNotificationData, loading: formattedNotificationLoading } = useQuery(
    formattedNotification,
    {
      variables: { id },
    }
  );

  if (
    loading ||
    formattedNotificationLoading ||
    !data ||
    !formattedNotificationData ||
    !data.notification
  ) {
    return null;
  }
  const notification = getFragmentData(notificationDetails, data.notification);

  return (
    <div className="main-container mb-2">
      <NotificationView
        subject={notification.subject}
        formatedBody={formattedNotificationData.formatNotification}
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
