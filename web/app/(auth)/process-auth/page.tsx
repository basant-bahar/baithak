"use client";

import { useMutation } from "@apollo/client";
import { useUser } from "@clerk/clerk-react";
import { graphql } from "__generated__";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";

export default function AfterSignup() {
  const [syncAuthUser] = useMutation(syncAuthUserMutation);
  const signupInProcess = useRef(false);
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirectUrl");
  const { isSignedIn, user } = useUser();
  const router = useRouter();

  useEffect(() => {
    async function handleSignUp() {
      if (!signupInProcess.current) {
        signupInProcess.current = true;
        await syncAuthUser();
        if (redirectUrl) {
          router.replace(redirectUrl);
        } else {
          router.replace("/");
        }
      }
    }
    if (isSignedIn && user) {
      handleSignUp();
    }
  }, [isSignedIn, user]);

  if (isSignedIn || user) {
    return null;
  }

  return <div></div>;
}

const syncAuthUserMutation = graphql(`
  mutation syncAuthUser {
    syncAuthUser
  }
`);
