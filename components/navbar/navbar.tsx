"use client";

import React, { FC, useRef } from "react";
import { NavItem } from "./navItem";
import Link from "next/link";
import { Logo } from "./logo";
import { Memberships } from "./membershipsMenu";
import { About } from "./aboutMenu";
import { LoginMenu } from "./loginMenu";
import { AuthUser, isAdmin, useAuth } from "../auth/authProvider";
import { Admin } from "./adminMenu";

const NavBar = ({ children }: { children: React.ReactNode }) => {
  const [user, _login, logout] = useAuth();
  const container = useRef(null);
  const drawerInput = useRef<HTMLInputElement | null>(null);

  const hideDrawer = () => {
    if (drawerInput.current) drawerInput.current.checked = false;
  };

  return (
    <div className="drawer">
      <input id="sidebar" type="checkbox" className="drawer-toggle" ref={drawerInput} />
      <div className="drawer-content flex flex-col">
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
        <main>{children}</main>
      </div>
      <div className="drawer-side">
        <label htmlFor="sidebar" className="drawer-overlay"></label>
        <ul className="w-80 navbar-drawer" onClick={hideDrawer}>
          <div className="block lg:hidden w-auto p-2">
            <Logo />
          </div>
          <MenuElements isDrawer={true} user={user} logout={logout} />
        </ul>
      </div>
    </div>
  );
};

interface MenuElementsProps {
  isDrawer: boolean;
  user: AuthUser | undefined;
  logout: () => void;
}
const MenuElements: FC<MenuElementsProps> = ({ isDrawer, user, logout }: MenuElementsProps) => {
  return (
    <>
      <li>
        <NavItem href="/" isLeaf={true} name="Home" />
      </li>
      <li>
        <NavItem href="/concerts/calendar" isLeaf={true} name="Concert Calendar" />
      </li>
      <li>
        <NavItem href="/subscriptions" name="Mailing List" />
      </li>
      <li>
        <Memberships isDrawer={isDrawer} />
      </li>
      <li>
        <About isDrawer={isDrawer} />
      </li>
      {user && isAdmin(user) && (
        <li>
          <Admin isDrawer={isDrawer} />
        </li>
      )}
      {!user && (
        <li>
          <Link href="/login" className="nav-link nav-item" aria-current="page">
            Login
          </Link>
        </li>
      )}
      {user && (
        <li>
          <LoginMenu user={user} logout={logout} isDrawer={isDrawer} />
        </li>
      )}
    </>
  );
};

export default NavBar;
