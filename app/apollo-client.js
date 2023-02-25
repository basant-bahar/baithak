import { ApolloClient, createHttpLink, InMemoryCache } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

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

const httpLink = createHttpLink({
  uri: "http://localhost:9876/graphql",
});

const authLink = setContext((_, { headers }) => {
  if (localStorage) {
    // get the authentication token from local storage if it exists
    const token = localStorage.getItem("token");
    // return the headers to the context so httpLink can read them
    return {
      headers: {
        ...headers,
        authorization: token ? `Bearer ${token}` : "",
      }
    }
  }
});

export const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
  connectToDevTools: process.env.NEXT_PUBLIC_APOLLO_CONNECT_TO_DEV_TOOLS,
});
