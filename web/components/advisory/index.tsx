import React, { use } from "react";
import { ssrApolloClient } from "../../app/apollo-client";
import { advisoryDetails, getAdvisories } from "../../graphql/advisory";
import { getFragmentData } from "../../__generated__";
import Markdown from "../concert/markdown";
import { getAdvisoryClass } from "./util";

export function Advisory({ children }: { children: React.ReactNode }) {
  const advisoriesData = use(getAdvisory());
  const advisory = getFragmentData(advisoryDetails, advisoriesData);

  return (
    <>
      {advisory && (
        <div className={getAdvisoryClass(advisory.level)}>
          <Markdown>{advisory.message}</Markdown>
        </div>
      )}
      <div className={`main-container ${advisory ? "mt-4 mb-1" : ""}`}>{children}</div>
    </>
  );
}

export function AdvisoryFooter() {
  const advisoriesData = use(getAdvisory());
  const advisory = getFragmentData(advisoryDetails, advisoriesData);

  return (
    <>
      {advisory?.footer && advisory.footer.length > 0 && (
        <div className="bordered-container static bottom-0 mb-1">
          <Markdown>{advisory.footer}</Markdown>
        </div>
      )}
    </>
  );
}

async function getAdvisory() {
  const { data } = await ssrApolloClient.query({
    query: getAdvisories,
  });

  if (data && data.advisories && data.advisories.length > 0) {
    return data.advisories[0];
  } else {
    return null;
  }
}
