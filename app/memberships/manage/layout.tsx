"use client";

import Protected from "../../../components/auth/protected";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <Protected>{children}</Protected>;
}
