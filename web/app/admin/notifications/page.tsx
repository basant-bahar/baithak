"use client";

import React from "react";
import { graphql } from "__generated__";
import EntityList, { EntityInfo } from "components/common/entityList";
import { getNotifications } from "../../../graphql/notifications";
import { NotificationShortDetailsFragment } from "__generated__/graphql";

export default function NotificationList() {
  const descFn = (notification: NotificationShortDetailsFragment) => {
    return notification.subject;
  };

  return (
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
          true
        )
      }
      descFn={descFn}
    />
  );
}

const deleteNotification = graphql(`
  mutation deleteNotification($id: Uuid!) {
    deleteNotification(id: $id) {
      id
    }
  }
`);
