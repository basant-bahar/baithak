import { ApolloClient, createHttpLink, InMemoryCache } from '@apollo/client';
import { generatePersistedQueryIdsFromManifest } from "@apollo/persisted-query-lists";
import { createPersistedQueryLink } from "@apollo/client/link/persisted-queries";

const defaultOptions = {
  watchQuery: {
    fetchPolicy: 'no-cache',
    errorPolicy: 'all',
  },
  query: {
    fetchPolicy: 'no-cache',
    errorPolicy: 'all',
  },
  mutate: {
    fetchPolicy: 'no-cache',
    errorPolicy: 'all',
  },
};

const httpLink = createHttpLink({
  uri: process.env.NEXT_PUBLIC_API_URL,
  fetchOptions: { cache: "no-cache" }
});

const persistedQueryLink = createPersistedQueryLink(
  generatePersistedQueryIdsFromManifest({
    loadManifest: () => import("/persisted-query-manifest.json"),
  })
);

export const ssrApolloClient = new ApolloClient({
  ssrMode: true,
  link: persistedQueryLink.concat(httpLink),
  cache: new InMemoryCache(),
  defaultOptions
});
