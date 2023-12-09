import { UserButton, useUser } from "@clerk/clerk-react";
import Link from "next/link";

export default function LoginMenu() {
  const { isSignedIn } = useUser();

  return (
    <div className="ml-auto">
      {isSignedIn ? (
        <UserButton />
      ) : (
        <Link href="/login" className="nav-link nav-item" aria-current="page">
          Login
        </Link>
      )}
    </div>
  );
}
