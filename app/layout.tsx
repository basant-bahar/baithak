"use client";

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
        <NavBar children={children} />
      </body>
    </html>
  );
}
