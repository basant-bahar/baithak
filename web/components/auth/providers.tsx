"use client";

import { ApolloProvider } from "@apollo/react-hooks";
import { ApolloClient, createHttpLink, InMemoryCache } from "@apollo/client";
import { generatePersistedQueryIdsFromManifest } from "@apollo/persisted-query-lists";
import { createPersistedQueryLink } from "@apollo/client/link/persisted-queries";
import { setContext } from "@apollo/client/link/context";
import { ClerkProvider, ClerkLoaded, useAuth, useUser } from "@clerk/clerk-react";
import { useMemo } from "react";

if (!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key");
}
const clerkPubKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider publishableKey={clerkPubKey} signInUrl="/signin" signUpUrl="/signup">
      <ClerkLoaded>
        <ClerkApolloProvider>{children}</ClerkApolloProvider>
      </ClerkLoaded>
    </ClerkProvider>
  );
}

const httpLink = createHttpLink({
  uri: process.env.NEXT_PUBLIC_API_URL,
});

const persistedQueryLink = createPersistedQueryLink(
  generatePersistedQueryIdsFromManifest({
    loadManifest: () => import("/persisted-query-manifest.json"),
  })
);

function ClerkApolloProvider({ children }: { children: React.ReactNode }) {
  const { getToken } = useAuth();

  const client = useMemo(() => {
    const authLink = setContext(async (_, { headers }) => {
      const token = await getToken({ template: "ExoUser", skipCache: true });

      return {
        headers: {
          ...headers,
          authorization: token ? `Bearer ${token}` : "",
        },
      };
    });

    return new ApolloClient({
      link: persistedQueryLink.concat(authLink.concat(httpLink)),
      cache: new InMemoryCache(),
      connectToDevTools: !!process.env.NEXT_PUBLIC_APOLLO_CONNECT_TO_DEV_TOOLS,
    });
  }, [getToken]);

  return <ApolloProvider client={client}>{children}</ApolloProvider>;
}

export function useIsAdmin() {
  const { user } = useUser();

  return user?.publicMetadata.role === "admin";
}
