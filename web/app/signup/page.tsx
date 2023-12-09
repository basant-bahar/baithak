"use client";

import { SignUp } from "@clerk/clerk-react";

export default function Signup() {
  return (
    <div className="main-container max-xs:p-4 p-16">
      <div className="mx-auto flex w-full flex-col items-center">
        <SignUp signInUrl="/login" afterSignUpUrl="/after-signup" redirectUrl="/after-signup" />
      </div>
    </div>
  );
}
