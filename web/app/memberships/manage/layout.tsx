"use client";

import { useUser } from "@clerk/clerk-react";
import Protected from "components/auth/protected";

export default function MembershipLayout({ children }: { children: React.ReactNode }) {
  const { isSignedIn } = useUser();

  return <Protected checkAccess={() => isSignedIn || false}>{children}</Protected>;
}
