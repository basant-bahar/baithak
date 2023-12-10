"use client";

import { SignIn } from "@clerk/clerk-react";

type LoginProps = {
  searchParams: { redirectUrl?: string };
};

export default function Login({ searchParams: { redirectUrl } }: LoginProps) {
  let withRedirect = "/process-auth";
  if (redirectUrl) {
    withRedirect += `?redirectUrl=${redirectUrl}`;
  } else {
    redirectUrl;
  }

  return (
    <div className="main-container flex justify-center p-16 max-xs:p-4">
      <SignIn afterSignUpUrl={withRedirect} afterSignInUrl={withRedirect} />
    </div>
  );
}
