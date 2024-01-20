"use client";

import Protected from "components/auth/protected";
import { UserResource } from "@clerk/types/dist/user";
import { useIsAdmin } from "components/auth/providers";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const isAdmin = useIsAdmin();

  function checkAdminUser(user: UserResource | null | undefined): boolean {
    return isAdmin;
  }

  return <Protected checkAccess={() => isAdmin}>{children}</Protected>;
}
