import { graphql } from "../__generated__";

export const getNotifications = graphql(`
  query getNotifications($search: String) {
    notifications(
      where: {
        or: [
          { subject: { ilike: $search } }
          {
            concert: {
              or: [
                { title: { ilike: $search } }
                { concertArtists: { artist: { name: { ilike: $search } } } }
              ]
            }
          }
        ]
      }
      orderBy: { concert: { startTime: DESC } }
    ) {
      ...NotificationShortDetails
    }
  }
`);

export const notificationShortDetails = graphql(`
  fragment NotificationShortDetails on Notification {
    id
    subject
    concert {
      id
      title
    }
  }
`);

export const notificationDetails = graphql(`
  fragment NotificationDetails on Notification {
    subject
    message
    postMessage
    concert {
      id
      title
    }
  }
`);

// Get all concerts so we can show them in the dropdown when creating a notification
export const notificationConcerts = graphql(`
  query notificationConcerts {
    concerts(orderBy: { startTime: DESC }, limit: 12) {
      id
      title
    }
  }
`);

export const getNotification = graphql(`
  query getNotification($id: Uuid!) {
    notification(id: $id) {
      id
      ...NotificationDetails
    }
  }
`);

export const formatedNotification = graphql(`
  query formatedNotification($id: Uuid!) {
    formatNotification(concertNotificationId: $id)
  }
`);
