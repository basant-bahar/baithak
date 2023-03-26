"use client";

import React from "react";
import { NavItem } from "./navItem";
import Link from "next/link";
import { Memberships } from "./membershipsMenu";
import { About } from "./aboutMenu";
import { LoginMenu } from "./loginMenu";
import { AuthUser, isAdmin } from "../auth/authProvider";
import { Admin } from "./adminMenu";

interface MenuElementsProps {
  isDrawer: boolean;
  user: AuthUser | undefined;
  logout: () => void;
}
export default function MenuElements({ isDrawer, user, logout }: MenuElementsProps) {
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
}
