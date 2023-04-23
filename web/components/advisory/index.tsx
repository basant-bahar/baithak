import React, { use } from "react";
import { ssrApolloClient } from "../../app/apollo-client";
import { advisoryDetails, getAdvisories } from "../../graphql/advisory";
import { getFragmentData } from "../../__generated__";
import Markdown from "../concert/markdown";

export default function Advisory() {
  const advisoriesData = use(getAdvisory());
  const advisory = getFragmentData(advisoryDetails, advisoriesData);

  if (!advisory) {
    return <>Loading...</>;
  }

  const getAdvisoryClass = () => {
    const advisoryClass =
      "flex-auto mx-auto max-w-screen-lg p-6 flex-auto rounded mt-24 border border-solid";

    switch (advisory.level) {
      case "Critical":
        return `${advisoryClass} red-600 bg-red-100 border-red-200`;
      case "Warning":
        return `${advisoryClass} amber-600 bg-amber-100 border-amber-200`;
      case "Info":
        return `${advisoryClass} green-600 bg-green-100 border-green-200`;
    }
  };

  return (
    <>
      {advisory && (
        <div className={getAdvisoryClass()}>
          <Markdown>{advisory.message}</Markdown>
        </div>
      )}
    </>
  );
}

export async function getAdvisory() {
  const { data } = await ssrApolloClient.query({
    query: getAdvisories,
  });

  if (data && data.advisories && data.advisories.length > 0) {
    return data.advisories[0];
  } else {
    return null;
  }
}