"use client";

import Protected from "components/auth/protected";
import { UserResource } from "@clerk/types/dist/user";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  function checkAdminUser(user: UserResource | null | undefined): boolean {
    return user?.publicMetadata.role === "admin";
  }

  return <Protected checkAccess={checkAdminUser}>{children}</Protected>;
}
