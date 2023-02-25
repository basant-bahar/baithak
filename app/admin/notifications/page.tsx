"use client";

import React from "react";
import { graphql } from "../../../__generated__";
import Protected from "../../../components/auth/protected";
import EntityList, { EntityInfo } from "../../../components/common/entityList";
import { getNotifications } from "../../../graphql/notifications";
import { NotificationShortDetailsFragment } from "../../../__generated__/graphql";

export default function NotificationList() {
  function cleanupNotifications(notifications: NotificationShortDetailsFragment[]) {
    // Currently Clay may return same entity multiple times for this query so create an array of unique elements
    return [...new Set(notifications)];
  }

  const descFn = (notification: NotificationShortDetailsFragment) => {
    return notification.subject;
  };

  return (
    <Protected>
      <EntityList
        entityInfo={
          new EntityInfo(
            "Notification",
            "Notifications",
            "notifications",
            getNotifications,
            deleteNotification,
            undefined,
            undefined,
            cleanupNotifications
            // deleteNotificationCacheUpdate
          )
        }
        descFn={descFn}
      />
    </Protected>
  );
}

const deleteNotification = graphql(`
  mutation deleteNotification($id: Int!) {
    deleteNotification(id: $id) {
      id
    }
  }
`);
