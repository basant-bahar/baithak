import React, { FC, RefObject } from "react";
import Link from "next/link";
import { useDropdown } from "./useDropdown";
import SubNavArrow from "./subNavArrow";

interface AboutProps {
  isDrawer?: boolean;
}

export const About = ({ isDrawer }: AboutProps) => {
  const [containerRef, actionRef, isOpen, close] = useDropdown();

  const hideAbout = (e: React.MouseEvent) => {
    close();
  };
  const mainClassName = `nav-sub-wrapper ${isDrawer ? " p-0 h-fit" : ""}`;
  const aboutLabelClass = `nav-sub-name ${isDrawer ? " pl-3" : ""}`;

  return (
    <div className={mainClassName} ref={containerRef as RefObject<HTMLDivElement>}>
      <a className={aboutLabelClass} ref={actionRef as RefObject<HTMLAnchorElement>}>
        About
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
          <AboutSubMenu hideAbout={hideAbout} />
        </div>
      )}
      {isDrawer && (
        <div className="w-full">
          <AboutSubMenu hideAbout={hideAbout} />
        </div>
      )}
    </div>
  );
};

interface AboutSubMenuProps {
  hideAbout: (e: React.MouseEvent) => void;
}
const AboutSubMenu: FC<AboutSubMenuProps> = ({ hideAbout }: AboutSubMenuProps) => {
  return (
    <>
      <Link
        href="/about/history"
        onClick={hideAbout}
        className="nav-link nav-item nav-sub-link"
        role="menuitem"
        tabIndex={-1}
        id="user-menu-item-0"
      >
        History
      </Link>
      <Link
        href="/about/featured-artists"
        onClick={hideAbout}
        className="nav-link nav-item nav-sub-link"
        role="menuitem"
        tabIndex={-1}
        id="user-menu-item-1"
      >
        Featured Artists
      </Link>
      <Link
        href="/about/past-concerts"
        onClick={hideAbout}
        className="nav-link nav-item nav-sub-link"
        role="menuitem"
        tabIndex={-1}
        id="user-menu-item-1"
      >
        Past Concerts
      </Link>
      <Link
        href="/about/contact-us/email"
        onClick={hideAbout}
        className="nav-link nav-item nav-sub-link"
        role="menuitem"
        tabIndex={-1}
        id="user-menu-item-1"
      >
        Contact Us
      </Link>
      <Link
        href="/about/"
        onClick={hideAbout}
        className="nav-link nav-item nav-sub-link"
        role="menuitem"
        tabIndex={-1}
        id="user-menu-item-1"
      >
        About Us
      </Link>
    </>
  );
};
