"use client";

import React from "react";
import NavItem from "./navItem";
import Memberships from "./membershipsMenu";
import About from "./aboutMenu";
import Admin from "./adminMenu";
import { useUser } from "@clerk/clerk-react";
import { useIsAdmin } from "components/auth/providers";
import { usePathname } from "next/navigation";

interface MenuElementsProps {
  isDrawer: boolean;
}
export default function MenuElements({ isDrawer }: MenuElementsProps) {
  const isAdmin = useIsAdmin();
  const { isSignedIn } = useUser();
  const pathname = usePathname();
  const menuItemStyle = isDrawer ? "hover:bg-primary-dark" : "";
  const menuWithSubItemsStyle = isDrawer ? "pt-2" : "justify-center";

  return (
    <ul className={`menu ${isDrawer ? "pt-1" : "menu-horizontal"} p-0`}>
      <li className={menuItemStyle}>
        <NavItem href="/" isLeaf={true} name="Home" />
      </li>
      <li className={menuItemStyle}>
        <NavItem href="/concerts/calendar" isLeaf={true} name="Concert Calendar" />
      </li>
      <li className={menuItemStyle}>
        <NavItem href="/subscriptions" name="Mailing List" />
      </li>
      <li className={menuWithSubItemsStyle}>
        <Memberships isDrawer={isDrawer} isSelected={pathname?.startsWith("/memberships")} />
      </li>
      <li className={menuWithSubItemsStyle}>
        <About isDrawer={isDrawer} isSelected={pathname?.startsWith("/about")} />
      </li>
      {isSignedIn && isAdmin && (
        <li className={menuWithSubItemsStyle}>
          <Admin isDrawer={isDrawer} isSelected={pathname?.startsWith("/admin")} />
        </li>
      )}
    </ul>
  );
}
