"use client";

import { AuthProvider } from "../components/auth/authProvider";
import { ApolloProvider } from "@apollo/react-hooks";
import { client } from "./apollo-client";
import NavBar from "../components/navbar/navbar";
import "./global.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <head>
        <title>Concert Management App</title>
        <meta name="description" content="A concert management app" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body>
        <AuthProvider>
          <ApolloProvider client={client}>
            <NavBar>{children}</NavBar>
          </ApolloProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
