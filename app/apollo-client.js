import { ApolloClient, createHttpLink, InMemoryCache } from '@apollo/client';

export const ssrApolloClient = new ApolloClient({
  ssrMode: true,
  link: createHttpLink({
    uri: 'http://localhost:9876/graphql',
    credentials: 'same-origin',
    headers: {
    },
  }),
  cache: new InMemoryCache(),
});
