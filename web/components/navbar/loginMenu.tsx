import { UserButton, useUser } from "@clerk/clerk-react";
import Link from "next/link";

export default function LoginMenu() {
  const { isSignedIn } = useUser();

  return (
    <div className="ml-auto">
      {isSignedIn ? (
        <UserButton afterSignOutUrl="/" />
      ) : (
        <Link href="/signin" className="nav-link nav-item" aria-current="page">
          Login
        </Link>
      )}
    </div>
  );
}
