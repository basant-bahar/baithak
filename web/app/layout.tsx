"use client";

import "./globals.css";
import Drawer from "components/navbar/drawer";
import Providers from "components/auth/providers";
import { Footer } from "components/footer";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <head>
        <title>Concert Management App</title>
        <meta name="description" content="A concert management app" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body>
        <Providers>
          <Drawer>
            <main className="flex flex-col h-screen items-center gap-1">
              {children}
              <Footer />
            </main>
          </Drawer>
        </Providers>
      </body>
    </html>
  );
}
