"use client";

import { useLazyQuery, useMutation } from "@apollo/react-hooks";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getDateStr, parseDateYYYYMMDD } from "../../../../utils";
import { FragmentType, getFragmentData, graphql } from "../../../../__generated__";

export default function MembershipExpiryNotifications() {
  const router = useRouter();
  const today = new Date();
  const start = new Date();
  const [endDate, setEndDate] = useState(today);
  start.setMonth(today.getMonth() - 6);
  const [startDate, setStartDate] = useState(start);
  const [memberships, setMemberships] = useState<FragmentType<typeof membershipExpiryDetails>[]>(
    []
  );

  const [expiryNotifications] = useLazyQuery(membershipExpiry);
  const [sendExpiryNotificationEmail] = useMutation(emailExpiryNotifications);
  const [error, setError] = useState(false);

  function changeStartDate(e: React.ChangeEvent<HTMLInputElement>) {
    setStartDate(parseDateYYYYMMDD(e.target.value));
  }

  function changeEndDate(e: React.ChangeEvent<HTMLInputElement>) {
    setEndDate(parseDateYYYYMMDD(e.target.value));
  }

  useEffect(() => {
    let fetchActive = true;
    const fetchData = async () => {
      const { data, loading } = await expiryNotifications({
        variables: { start: getDateStr(startDate), end: getDateStr(endDate) },
      });
      if (fetchActive && data?.memberships) {
        setMemberships(data?.memberships);
      }
    };
    fetchData();
    return () => {
      fetchActive = false;
    };
  }, [startDate, endDate]);

  function sendExpiryNotification(e: React.MouseEvent<HTMLButtonElement>) {
    sendExpiryNotificationEmail({ variables: { fromDate: startDate, toDate: endDate } })
      .then(() => {
        setError(false);
        router.back();
      })
      .catch((e) => {
        console.log(e);
        setError(true);
      });
  }

  return (
    <div className="main-container">
      <h1 className="row">Send membership expiry notifications</h1>
      <div className="row">
        <input
          className="simple-input w-40 mr-4"
          type="date"
          value={getDateStr(startDate)}
          onChange={(date) => changeStartDate(date)}
        />
        <input
          className="simple-input w-40"
          type="date"
          value={getDateStr(endDate)}
          onChange={(date) => changeEndDate(date)}
        />
        <button
          className="text-white bg-green-600 hover:bg-green-700 sm:ml-8 max-xs:mt-2"
          onClick={sendExpiryNotification}
        >
          Send
        </button>
        {error && <div className="text-red-500 p-2">Could not send email</div>}
      </div>

      <div className="grid grid-cols-2 font-bold border-b mt-4 pb-1">
        <div className="pl-1">Member Name</div>
        <div className="pl-1">Expiration date</div>
      </div>
      {memberships &&
        memberships.map((m) => {
          const membership = getFragmentData(membershipExpiryDetails, m);
          return (
            <div className="grid grid-cols-2 border-b pt-1 pb-1" key={membership.id}>
              <div className="pl-1">{`${membership.authUser.firstName} ${membership.authUser.lastName}`}</div>
              <div className="pl-1">{membership.expiry}</div>
            </div>
          );
        })}
    </div>
  );
}

const membershipExpiryDetails = graphql(`
  fragment MembershipExpiryDetails on Membership {
    id
    authUser {
      firstName
      lastName
    }
    spouseFirstName
    spouseLastName
    expiry
  }
`);

const membershipExpiry = graphql(`
  query membershipExpiry($start: LocalDate, $end: LocalDate) {
    memberships(
      where: { expiry: { gt: $start, lt: $end } }
      orderBy: { authUser: { firstName: ASC } }
    ) {
      ...MembershipExpiryDetails
    }
  }
`);

const emailExpiryNotifications = graphql(`
  mutation emailExpiryNotifications($fromDate: LocalDate!, $toDate: LocalDate!) {
    emailExpiryNotifications(fromDate: $fromDate, toDate: $toDate)
  }
`);
