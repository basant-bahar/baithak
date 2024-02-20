"use client";

import Protected from "components/auth/protected";
import { useIsAdmin } from "components/auth/providers";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const isAdmin = useIsAdmin();

  return <Protected checkAccess={() => isAdmin}>{children}</Protected>;
}
