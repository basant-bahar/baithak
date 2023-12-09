import React from "react";
import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { UserResource } from "@clerk/types/dist/user";
import { useUser } from "@clerk/clerk-react";

interface ProtectedProps {
  checkAccess: (user: UserResource | null | undefined) => boolean;
  children: React.ReactNode;
}

export default function Protected({ checkAccess, children }: ProtectedProps) {
  const { user } = useUser();
  const router = useRouter();
  const pathname = usePathname();
  const haveAccess = checkAccess(user);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!haveAccess) router.push(`/login?redirectUrl=${pathname}`);
    }, 1000);
    return () => clearTimeout(timeout);
  }, [router, haveAccess, pathname]);

  return <>{haveAccess && <>{children}</>}</>;
}
