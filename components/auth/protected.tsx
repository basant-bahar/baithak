import React from "react";
import { useEffect } from "react";
import { useAuth } from "../../components/auth/authProvider";
import { useRouter } from "next/navigation";

interface ProtectedProps {
  children: React.ReactNode;
}

export default function Protected(props: ProtectedProps) {
  const [user] = useAuth();
  const router = useRouter();

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!user) router.push("/login");
    }, 1000);
    return () => clearTimeout(timeout);
  }, [user, router]);

  return <>{user && <>{props.children}</>}</>;
}
