import React from "react";
import { useEffect } from "react";
import { AuthUser, useAuth } from "../../components/auth/authProvider";
import { usePathname, useRouter } from "next/navigation";

export enum AccessResult {
  AuthNeeded = "auth-needed",
  InsufficientPrivileges = "insufficient-privileges",
  Allowed = "allowed",
}

interface ProtectedProps {
  checkAccess?: (user: AuthUser | undefined) => AccessResult;
  children: React.ReactNode;
}

function checkAuthUser(user: AuthUser | undefined): AccessResult {
  return user === undefined ? AccessResult.AuthNeeded : AccessResult.Allowed;
}

export default function Protected({ checkAccess = checkAuthUser, children }: ProtectedProps) {
  const [user] = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const accessFailureCode = checkAccess(user);
  const haveAccess = accessFailureCode === AccessResult.Allowed;

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!haveAccess) router.push(`/login?reason=${accessFailureCode}&redirectUrl=${pathname}`);
    }, 1000);
    return () => clearTimeout(timeout);
  }, [router]);

  return <>{haveAccess && <>{children}</>}</>;
}
