import { graphql } from "../__generated__";

export const advisoryDetails = graphql(`
  fragment AdvisoryDetails on Advisory {
    id
    level
    message
  }
`);

export const getAdvisories = graphql(`
  query getAdvisories {
    advisories {
      ...AdvisoryDetails
    }
  }
`);
