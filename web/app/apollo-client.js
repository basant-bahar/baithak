import { ApolloClient, createHttpLink, InMemoryCache } from '@apollo/client';

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

export const ssrApolloClient = new ApolloClient({
  ssrMode: true,
  link: createHttpLink({
    uri: process.env.NEXT_PUBLIC_API_URL,
    fetchOptions: { cache: "no-store" }
  }),
  cache: new InMemoryCache(),
  defaultOptions
});
