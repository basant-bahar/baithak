"use client";

import { AuthUser } from "components/auth/authProvider";
import Protected, { AccessResult } from "components/auth/protected";

function checkAuthUser(user: AuthUser | undefined): AccessResult {
  return user === undefined ? AccessResult.AuthNeeded : AccessResult.Allowed;
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <Protected checkAccess={checkAuthUser}>{children}</Protected>;
}
