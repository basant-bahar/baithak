"use client";

import { useMutation } from "@apollo/react-hooks";
import React, { useState } from "react";
import { graphql } from "../../__generated__";
import { useUser } from "@clerk/clerk-react";

type ConcertRsvpProps = {
  concertId: string;
};

export const ConcertRsvp = (props: ConcertRsvpProps) => {
  const { user } = useUser();

  const email = (user && user.emailAddresses[0].emailAddress) || "";
  const [rsvp, setRsvp] = useState({ email, numTickets: 0 });
  const [rsvpDone, setRsvpDone] = React.useState(false);
  const disabledRSVP = rsvp.email.length === 0 || rsvp.numTickets < 1 || rsvp.numTickets > 8;
  const id = props.concertId;
  const [processRsvpMutation] = useMutation(processRsvp);

  const changeEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRsvp({ ...rsvp, email: e.target.value });
  };

  const changeRsvps = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRsvp({ ...rsvp, numTickets: parseInt(e.target.value) });
  };

  const save = () => {
    processRsvpMutation({
      variables: {
        concertId: id,
        ...rsvp,
      },
    }).then((data) => setRsvpDone(true));
  };

  return (
    <div className="mt-8 mb-1 text-center flex justify-center max-xs:gap-0 gap-2">
      {!rsvpDone && (
        <>
          <input
            className="simple-input mr-2 w-64 max-xs:w-48"
            placeholder="Your email"
            onChange={changeEmail}
            value={rsvp.email}
          />
          <input
            className="simple-input mr-2 w-16 min-w-0"
            id="rank"
            placeholder="Rsvps"
            type="number"
            name="rank"
            min="1"
            max="8"
            value={rsvp.numTickets ? rsvp.numTickets : ""}
            onChange={changeRsvps}
          />
          <button
            className="bg-green-600 hover:bg-green-700 max-xs:mt-2"
            onClick={() => save()}
            disabled={disabledRSVP}
          >
            Rsvp
          </button>
        </>
      )}
      {rsvpDone && (
        <div className="mb-4 text-center">Thanks for your RSVP. See you at the concert!</div>
      )}
    </div>
  );
};

const processRsvp = graphql(`
  mutation processRsvp($concertId: Uuid!, $email: String!, $numTickets: Int!) {
    processRsvp(concertId: $concertId, email: $email, numTickets: $numTickets)
  }
`);
