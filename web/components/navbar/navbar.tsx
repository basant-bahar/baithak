"use client";

import React, { useRef } from "react";
import Link from "next/link";
import Logo from "./logo";
import { useAuth } from "../auth/authProvider";
import MenuElements from "./MenuElements";

export default function NavBar() {
  const [user, _login, logout] = useAuth();
  const container = useRef(null);
  const drawerInput = useRef<HTMLInputElement | null>(null);

  const hideDrawer = () => {
    if (drawerInput.current) drawerInput.current.checked = false;
  };

  return (
    <div className="w-full navbar" ref={container}>
      <div className="flex-none lg:hidden">
        <label
          htmlFor="sidebar"
          className="w-12 h-12 flex items-center justify-center cursor-pointer"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            className="inline-block w-6 h-6 stroke-secondary outline-none"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16M4 18h16"
            ></path>
          </svg>
        </label>
      </div>
      <div className="flex-1 px-2 mx-2">
        <Link href="/">
          <div className="flex-shrink-0 flex items-center">
            <div className="block lg:hidden w-auto">
              <Logo />
            </div>
            <div className="hidden lg:block w-auto">
              <Logo />
            </div>
          </div>
        </Link>
      </div>
      <div className="flex-none hidden lg:block">
        <ul className="menu menu-horizontal">
          <MenuElements isDrawer={false} user={user} logout={logout} />
        </ul>
      </div>
    </div>
  );
}
