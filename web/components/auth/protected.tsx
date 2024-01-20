import React from "react";
import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

interface ProtectedProps {
  checkAccess: () => boolean;
  children: React.ReactNode;
}

export default function Protected({ checkAccess, children }: ProtectedProps) {
  const router = useRouter();
  const pathname = usePathname();
  const haveAccess = checkAccess();

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!haveAccess) router.push(`/signin?redirectUrl=${pathname}`);
    }, 1000);
    return () => clearTimeout(timeout);
  }, [router, haveAccess, pathname]);

  return <>{haveAccess && <>{children}</>}</>;
}
