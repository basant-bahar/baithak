"use client";

import React from "react";
import { useMutation } from "@apollo/react-hooks";
import { graphql } from "__generated__";
import { useRouter } from "next/navigation";
import PageHeader from "components/common/pageHeader";

interface EmailNotificationProps {
  params: { id: string };
}
export default function EmailNotification({ params: { id } }: EmailNotificationProps) {
  const router = useRouter();
  const [emailTo, setEmailTo] = React.useState("Test");
  let [sendNotificationEmail] = useMutation(emailNotification);

  function changeEmailTo(e: React.ChangeEvent<HTMLSelectElement>) {
    setEmailTo(e.target.value);
  }

  function sendEmail() {
    sendNotificationEmail({
      variables: { id: parseInt(id), emailGroupName: emailTo },
    });
    router.replace("/admin/notifications");
  }

  return (
    <div className="main-container">
      <PageHeader title={"Send Concert Notification Email"} />
      <div className="flex justify-center mt-4">
        <label className="form-label">Email to</label>
        <select
          className="border-b bg-transparent focus:outline-none disabled:opacity-50"
          onChange={changeEmailTo}
          value={emailTo}
        >
          <option key="test" value="test">
            Test
          </option>
          <option key="all" value="all">
            All subscribers
          </option>
        </select>
      </div>
      <div className="flex justify-center p-10">
        <button
          className="bg-green-400 hover:bg-green-500 w-16 h-8 mr-2 rounded-md flex justify-center items-center disabled:opacity-50"
          onClick={() => sendEmail()}
        >
          Send
        </button>
      </div>
    </div>
  );
}

const emailNotification = graphql(`
  mutation emailNotification($id: Int!, $emailGroupName: String!) {
    emailNotification(concertNotificationId: $id, emailGroupName: $emailGroupName)
  }
`);
