"use client";

import React from "react";
import NavItem from "./navItem";
import Memberships from "./membershipsMenu";
import About from "./aboutMenu";
import Admin from "./adminMenu";
import { useUser } from "@clerk/clerk-react";
import { useIsAdmin } from "components/auth/providers";

interface MenuElementsProps {
  isDrawer: boolean;
}

export default function MenuElements({ isDrawer }: MenuElementsProps) {
  const isAdmin = useIsAdmin();
  const { isSignedIn } = useUser();

  return (
    <ul className="menu menu-horizontal p-0">
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
      {isSignedIn && isAdmin && (
        <li>
          <Admin isDrawer={isDrawer} />
        </li>
      )}
    </ul>
  );
}
