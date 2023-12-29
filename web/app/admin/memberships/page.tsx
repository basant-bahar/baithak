"use client";

import React, { useEffect, useState } from "react";
import EntityList, { EntityInfo } from "components/common/entityList";
import { useLazyQuery } from "@apollo/react-hooks";
import Link from "next/link";
import { graphql, getFragmentData } from "__generated__";
import { membershipDetails, searchMembership } from "../../../graphql/memberships";
import { getServerDateOnly } from "utils";
import { MembershipDetailsFragment } from "__generated__/graphql";

export default function MembershipList() {
  const descFn = (membership: MembershipDetailsFragment) => {
    const name = `${membership.authUser.firstName} ${membership.authUser.lastName}`;
    const spouseName = `${membership.spouseFirstName} ${membership.spouseLastName}`;
    const spouse = membership.spouseFirstName !== "";

    return `${name}${spouse ? ", " + spouseName : ""}`;
  };

  return (
    <EntityList
      entityInfo={
        new EntityInfo<MembershipDetailsFragment>(
          "Membership",
          "Memberships",
          "memberships",
          searchMembership,
          deleteMembership,
          [],
          <AdditionalButtons />
        )
      }
      descFn={descFn}
    />
  );
}

const AdditionalButtons = () => {
  const [summaryVisible, setSummaryVisible] = useState(false);
  const [summaryMap, setSummaryMap] = useState<Map<string, number>>(new Map());
  const [membershipsForDeskPrintout] = useLazyQuery(deskPrintout);
  const [getActiveMembershipsQuery] = useLazyQuery(getActiveMemberships);

  async function showSummary(e: React.MouseEvent<HTMLButtonElement>) {
    setSummaryVisible(!summaryVisible);
  }

  useEffect(() => {
    const getMemberships = async () => {
      const { data } = await getActiveMembershipsQuery({
        variables: { expiry: getServerDateOnly(new Date()) },
      });
      const membershipMap = new Map();
      membershipMap.set("Couple", getFragmentData(membershipCount, data?.couple)?.id?.count);
      membershipMap.set("Life", getFragmentData(membershipCount, data?.life)?.id?.count);
      membershipMap.set("Family", getFragmentData(membershipCount, data?.family)?.id?.count);
      membershipMap.set(
        "Individual",
        getFragmentData(membershipCount, data?.individual)?.id?.count
      );
      setSummaryMap(membershipMap);
    };
    summaryVisible && getMemberships();
  }, [summaryVisible, getActiveMembershipsQuery]);

  async function createDeskPrintout(e: React.MouseEvent<HTMLButtonElement>) {
    const today = new Date();
    const start = new Date();
    start.setMonth(today.getMonth() - 6);
    const { data } = await membershipsForDeskPrintout({
      variables: { expiry: getServerDateOnly(start) },
    });

    const border = "1px solid gray";
    const firstCol = `border-right: ${border}; padding: 2px 0 2px 0;`;
    const secondCol = "padding-left: 5px;";
    const header = `<div style='border: ${border}; display: grid; grid-template-columns: 4fr 4fr 1fr 1fr; font-weight: bold;'>
      <div style="${firstCol}">&nbsp;Member Name</div>
      <div style="${firstCol}">&nbsp;Spouse Name</div>
      <div style="${firstCol}">&nbsp;Type</div>
      <div style="${secondCol}">Expires On</div>
      </div>
      <div style='border: ${border}; border-bottom: none; border-top: none; display: grid; grid-template-columns: 4fr 4fr 1fr 1fr;'>
      `;
    const formatedBody =
      data?.memberships.reduce((acc, membershipDetailsFragment) => {
        const membership = getFragmentData(membershipDetails, membershipDetailsFragment);
        return (
          acc +
          `
              <div style="border-bottom: ${border};${firstCol}">&nbsp;${membership.authUser.firstName} ${membership.authUser.lastName}</div>
              <div style="border-bottom: ${border};${firstCol}">&nbsp;${membership.spouseFirstName} ${membership.spouseLastName}</div>
              <div style="border-bottom: ${border};${firstCol}">&nbsp;${membership.type}</div>
              <div style="border-bottom: ${border};${secondCol}">${membership.expiry}</div>
            `
        );
      }, header) + "</div>";
    const newWindow = window.open("", "_blank");
    newWindow?.document.write(formatedBody);
  }

  const summaryComponent = () => {
    let total = 0;
    return (
      <div className="absolute border-2 p-4 bg-gray-100 mt-1">
        {Array.from(summaryMap).map(([type, count]) => {
          total += count;
          return (
            <div key={type} className="grid grid-cols-4 gap-4">
              <div className="col-span-3">{type}</div>
              <div className="col-span-1">{count}</div>
            </div>
          );
        })}
        <div key="total" className="grid grid-cols-4 gap-4 mt-2">
          <div className="font-bold col-span-3">Total active memberships</div>
          <div className="col-span-1">{total}</div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex justify-between mx-auto mb-2">
      <div>
        <button
          className="bg-orange-200 hover:bg-orange-300 mr-2 rounded-md flex items-center disabled:opacity-50 p-2 h-8 max-xs:h-fit max-xs:w-28 max-xs:mb-4"
          onClick={showSummary}
        >
          Membership Summary
        </button>
        {summaryVisible && summaryMap && summaryComponent()}
      </div>
      <div className="flex">
        <button
          className="bg-orange-200 hover:bg-orange-300 mr-2 rounded-md flex items-center disabled:opacity-50 p-2 h-8 max-xs:h-fit max-xs:w-28 max-xs:mb-4"
          onClick={createDeskPrintout}
        >
          Desk Printout
        </button>
        <Link
          className="bg-orange-200 hover:bg-orange-300 mr-2 rounded-md flex items-center disabled:opacity-50 p-2 h-8 max-xs:h-fit max-xs:w-28 max-xs:mb-4"
          href={`memberships/expiry-notifications`}
        >
          Send Expiry Notificaions
        </Link>
      </div>
    </div>
  );
};

const deskPrintout = graphql(`
  query deskPrintout($expiry: LocalDate) {
    memberships(where: { expiry: { gt: $expiry } }, orderBy: { authUser: { firstName: ASC } }) {
      id
      ...MembershipDetails
    }
  }
`);

const membershipCount = graphql(`
  fragment MembershipCount on MembershipAgg {
    id {
      count
    }
  }
`);

const getActiveMemberships = graphql(`
  query getMembershipAggs($expiry: LocalDate) {
    life: membershipsAgg(where: { and: [{ type: { eq: "Life" } }, { expiry: { gte: $expiry } }] }) {
      ...MembershipCount
    }
    couple: membershipsAgg(
      where: { and: [{ type: { eq: "Couple" } }, { expiry: { gte: $expiry } }] }
    ) {
      ...MembershipCount
    }
    family: membershipsAgg(
      where: { and: [{ type: { eq: "Family" } }, { expiry: { gte: $expiry } }] }
    ) {
      ...MembershipCount
    }
    individual: membershipsAgg(
      where: { and: [{ type: { eq: "Individual" } }, { expiry: { gte: $expiry } }] }
    ) {
      ...MembershipCount
    }
  }
`);

const deleteMembership = graphql(`
  mutation deleteMembership($id: Uuid!) {
    deleteMembership(id: $id) {
      id
    }
  }
`);
