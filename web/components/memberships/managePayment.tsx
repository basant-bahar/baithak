import React from "react";
import { MembershipOnlyDetailsFragment } from "../../__generated__/graphql";

interface ManagePaymentProps {
  membership: MembershipOnlyDetailsFragment;
}
export default function ManagePayment(props: ManagePaymentProps) {
  return (
    <div className="pt-4 flex flex-col items-center">
      --------- Payment component goes here ---------
    </div>
  );
}
