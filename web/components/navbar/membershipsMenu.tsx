import React, { RefObject } from "react";
import Link from "next/link";
import { useDropdown } from "./useDropdown";
import SubNavArrow from "./subNavArrow";
import { usePathname } from "next/navigation";

interface MembershipsProps {
  isSelected: boolean;
  isDrawer?: boolean;
}

export default function Memberships({ isSelected, isDrawer }: MembershipsProps) {
  const [containerRef, actionRef, isOpen, close] = useDropdown();

  const hideMembership = (e: React.MouseEvent) => {
    close();
  };

  const subLinks = (
    <>
      <Link
        href="/memberships/manage"
        onClick={hideMembership}
        className="nav-link nav-item nav-sub-link"
        role="menuitem"
        tabIndex={-1}
        id="user-menu-item-0"
      >
        Manage/Signup
      </Link>
      <Link
        href="/memberships/info"
        onClick={hideMembership}
        className="nav-link nav-item nav-sub-link"
        role="menuitem"
        tabIndex={-1}
        id="user-menu-item-1"
      >
        Information
      </Link>
    </>
  );
  const selectedClass = isSelected ? "selected" : "";
  const mainClassName = `nav-sub-wrapper ${selectedClass} ${isDrawer ? " p-0 h-fit" : ""}`;
  const membershipLabelClass = `nav-sub-name ${isDrawer ? " pl-3" : ""}`;

  return (
    <div className={mainClassName} ref={containerRef as RefObject<HTMLDivElement>}>
      <a className={membershipLabelClass} ref={actionRef as RefObject<HTMLAnchorElement>}>
        Memberships
        {isDrawer && <SubNavArrow />}
      </a>
      {isOpen && !isDrawer && (
        <div
          className="navbar-sub"
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="user-menu-button"
          tabIndex={-1}
        >
          {subLinks}
        </div>
      )}
      {isDrawer && <div className="w-full">{subLinks}</div>}
    </div>
  );
}
