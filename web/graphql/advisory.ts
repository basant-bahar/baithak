import { graphql } from "../__generated__";

export const advisoryDetails = graphql(`
  fragment AdvisoryDetails on Advisory {
    id
    level
    message
    footer
  }
`);

export const getAdvisories = graphql(`
  query getAdvisories {
    advisories {
      ...AdvisoryDetails
    }
  }
`);
