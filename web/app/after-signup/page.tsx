"use client";

import { useMutation } from "@apollo/client";
import { useUser } from "@clerk/clerk-react";
import { graphql } from "__generated__";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

export default function AfterSignup() {
  const [signup] = useMutation(signupMutation);
  const signupInProcess = useRef(false);

  const { isSignedIn, user } = useUser();
  const router = useRouter();

  useEffect(() => {
    async function handleSignUp() {
      if (!signupInProcess.current) {
        signupInProcess.current = true;
        await signup();
        router.replace("/");
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

const signupMutation = graphql(`
  mutation signup {
    signup
  }
`);
