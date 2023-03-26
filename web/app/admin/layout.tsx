"use client";

import { AuthUser, isAdmin } from "components/auth/authProvider";
import Protected, { AccessResult } from "components/auth/protected";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  function checkAdminUser(user: AuthUser | undefined): AccessResult {
    return user === undefined
      ? AccessResult.AuthNeeded
      : isAdmin(user)
      ? AccessResult.Allowed
      : AccessResult.InsufficientPrivileges;
  }

  return <Protected checkAccess={checkAdminUser}>{children}</Protected>;
}
