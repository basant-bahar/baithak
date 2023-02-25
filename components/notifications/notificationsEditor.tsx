import React, { useState } from "react";
import { FragmentType, getFragmentData } from "../../__generated__";
import PageHeader from "../common/pageHeader";
import { notificationDetails } from "../../graphql/notifications";
import { NotificationConcertsQuery } from "../../__generated__/graphql";

interface NotificationEditorProps {
  notification?: FragmentType<typeof notificationDetails>;
  concerts: NotificationConcertsQuery["concerts"];
  done: Function;
}

const newNotification = {
  subject: "",
  message: "",
  postMessage: "",
  concert: null,
};

export default function NotificationEditor(props: NotificationEditorProps) {
  const notification = getFragmentData(notificationDetails, props.notification);
  const concerts = props.concerts;
  const [notificationData, setNotificationData] = useState(
    notification ? notification : newNotification
  );

  const subjectChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNotificationData({ ...notificationData, subject: e.currentTarget.value });
  };

  const messageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNotificationData({ ...notificationData, message: e.currentTarget.value });
  };

  const concertChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = parseInt(e.currentTarget.value);
    const concert = concerts.find((c) => c.id === id);
    const title = concert ? concert.title : "";

    setNotificationData({
      ...notificationData,
      concert: {
        id,
        title,
      },
    });
  };

  const postMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNotificationData({ ...notificationData, postMessage: e.currentTarget.value });
  };

  const saveNotification = async () => {
    props.done(notificationData);
  };

  return (
    <div className="main-container">
      <PageHeader title={"Notification"} />
      <div className="flex-auto p-4 max-lg:p-0">
        <div className="form-row">
          <label className="form-label">Subject</label>
          <input
            className="simple-input col-span-2"
            placeholder="Subject"
            value={notificationData.subject}
            onChange={subjectChange}
          />
        </div>
        <div className="form-row">
          <label className="form-label">Select Concert</label>
          <select
            className="col-span-2 mr-2 border-b"
            value={notificationData.concert ? notificationData.concert.id : ""}
            onChange={concertChange}
          >
            <option value="">--Select concert--</option>
            {concerts.map((concert) => (
              <option key={concert.id} value={concert.id}>
                {concert.title}
              </option>
            ))}
          </select>
        </div>
        <div className="form-row">
          <label className="form-label self-start pt-2">Message</label>
          <textarea
            className="col-span-3 border p-2"
            rows={5}
            placeholder="Message"
            onChange={messageChange}
            value={notificationData.message}
          />
        </div>
        <div className="form-row">
          <label className="form-label self-start pt-2">Post Message</label>
          <textarea
            className="col-span-3 border p-2"
            rows={5}
            placeholder="Post message"
            onChange={postMessageChange}
            value={notificationData.postMessage}
          />
        </div>
        <div className="grid mb-4 max-lg:grid-cols-4 lg:grid-cols-8">
          <button
            className="text-white bg-green-600 hover:bg-green-700 col-start-3 max-lg:col-start-2"
            onClick={() => saveNotification()}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
