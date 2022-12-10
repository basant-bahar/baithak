import React, { FC, RefObject } from "react";
import { AuthUser } from "../auth/authProvider";
import { UserIcon } from "@heroicons/react/20/solid";
import { useDropdown } from "./useDropdown";

type UserPictureProps = {
  user: AuthUser | undefined;
};

const UserPicture: FC<UserPictureProps> = ({ user }: UserPictureProps) => {
  if (user?.picture) {
    const name = `${user.firstName} ${user.lastName}`;
    return <img className="h-8 w-8 rounded-full" src={user.picture} alt={name} />;
  } else {
    return <UserIcon className="h-8 w-8 rounded-full" color="white" />;
  }
};

type LoginMenuProps = {
  user?: AuthUser;
  logout: Function;
  isDrawer?: boolean;
};

export const LoginMenu: FC<LoginMenuProps> = ({ user, logout, isDrawer }: LoginMenuProps) => {
  const [containerRef, actionRef, isOpen, close] = useDropdown();

  const hideLogin = (e: React.MouseEvent) => {
    close();
    logout();
  };
  const subNav = (
    <a
      onClick={hideLogin}
      className={`nav-link nav-item ${!isDrawer ? "nav-sub-link" : ""}`}
      role="menuitem"
      tabIndex={-1}
      id="user-menu-item-0"
    >
      Sign out
    </a>
  );

  return (
    <>
      {isDrawer && subNav}
      {!isDrawer && (
        <div className="nav-sub-wrapper" ref={containerRef as RefObject<HTMLDivElement>}>
          <button
            type="button"
            className="user-button"
            id="user-menu-button"
            aria-expanded="false"
            aria-haspopup="true"
            ref={actionRef as RefObject<HTMLButtonElement>}
          >
            <UserPicture user={user} />
          </button>
          {isOpen && (
            <div
              className="navbar-sub login min-h-0"
              role="menu"
              aria-orientation="vertical"
              aria-labelledby="user-menu-button"
              tabIndex={-1}
            >
              {subNav}
            </div>
          )}
        </div>
      )}
    </>
  );
};
