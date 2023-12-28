import React, { RefObject } from "react";
import Link from "next/link";
import SubNavArrow from "./subNavArrow";
import { useDropdown } from "./useDropdown";

interface AdminProps {
  isSelected: boolean;
  isDrawer?: boolean;
}

export default function Admin({ isSelected, isDrawer }: AdminProps) {
  const [containerRef, actionRef, isOpen, close] = useDropdown();

  const hideAdmin = (e: React.MouseEvent) => {
    close();
  };
  const selectedClass = isSelected ? "selected" : "";
  const mainClassName = `nav-sub-wrapper ${selectedClass} ${isDrawer ? " p-0 h-fit" : ""}`;
  const adminLabelClass = `nav-sub-name ${isDrawer ? " pl-3" : ""}`;

  return (
    <div className={mainClassName} ref={containerRef as RefObject<HTMLDivElement>}>
      <a className={adminLabelClass} ref={actionRef as RefObject<HTMLAnchorElement>}>
        Admin
        {isDrawer && <SubNavArrow />}
      </a>
      {isOpen && !isDrawer && (
        <div
          className="navbar-sub admin"
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="user-menu-button"
          tabIndex={-1}
        >
          <AdminSubMenu hideAdmin={hideAdmin} />
        </div>
      )}
      {isDrawer && (
        <div className="w-full">
          <AdminSubMenu isDrawer={isDrawer} hideAdmin={hideAdmin} />
        </div>
      )}
    </div>
  );
}

interface AdminSubMenuProps {
  isDrawer?: boolean;
  hideAdmin: (e: React.MouseEvent) => void;
}
function AdminSubMenu({ isDrawer = false, hideAdmin }: AdminSubMenuProps) {
  return (
    <>
      <Link
        href="/admin/venues"
        onClick={hideAdmin}
        className="nav-sub-link"
        role="menuitem"
        tabIndex={-1}
        id="user-menu-item-0"
      >
        Venues
      </Link>
      <Link
        href="/admin/artists"
        onClick={hideAdmin}
        className="nav-sub-link"
        role="menuitem"
        tabIndex={-1}
        id="user-menu-item-1"
      >
        Artists
      </Link>
      <Link
        href="/admin/concerts"
        onClick={hideAdmin}
        className="nav-sub-link"
        role="menuitem"
        tabIndex={-1}
        id="user-menu-item-2"
      >
        Concerts
      </Link>
      {!isDrawer && <hr className="nav-hr" />}
      <Link
        href="/admin/authUsers"
        onClick={hideAdmin}
        className="nav-sub-link"
        role="menuitem"
        tabIndex={-1}
        id="user-menu-item-3"
      >
        Users
      </Link>
      <Link
        href="/admin/memberships"
        onClick={hideAdmin}
        className="nav-sub-link"
        role="menuitem"
        tabIndex={-1}
        id="user-menu-item-3"
      >
        Memberships
      </Link>
      <Link
        href="/admin/subscriptions"
        onClick={hideAdmin}
        className="nav-sub-link"
        role="menuitem"
        tabIndex={-1}
        id="user-menu-item-4"
      >
        Subscriptions
      </Link>
      {!isDrawer && <hr className="nav-hr" />}
      <Link
        href="/admin/notifications"
        onClick={hideAdmin}
        className="nav-sub-link"
        role="menuitem"
        tabIndex={-1}
        id="user-menu-item-4"
      >
        Concert Notifications
      </Link>
      <Link
        href="/admin/rsvps"
        onClick={hideAdmin}
        className="nav-sub-link"
        role="menuitem"
        tabIndex={-1}
        id="user-menu-item-4"
      >
        Concert RSVPs
      </Link>
      {!isDrawer && <hr className="nav-hr" />}
      <Link
        href="/admin/advisory"
        onClick={hideAdmin}
        className="nav-sub-link"
        role="menuitem"
        tabIndex={-1}
        id="user-menu-item-4"
      >
        Advisory
      </Link>
    </>
  );
}
