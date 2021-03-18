import {
  Avatar,
  Drawer,
  IconButton,
  useMediaQuery,
  useTheme,
} from "@material-ui/core";
import MenuOpenIcon from "@material-ui/icons/MenuOpen";
import React, { memo, useEffect } from "react";
import { NavLink, useHistory } from "react-router-dom";
import logo from "../../Assets/Images/Logo/app_logo.png";
import NavSidebarDropDown from "../../Component/NavLinks/NavSidebarDropDown";
import { APP_NAME } from "../../Helpers/AppConfig";
import { IPageNavLinks } from "./Layout";
import styled from "styled-components";
interface IMobileSidebar {
  PageNavLinks: Array<IPageNavLinks>;
  isOpenMobileSidebar: boolean;
  handleCloseMobileSidebar: () => void;
  user: any;
}

const MobileSidebar: React.FC<IMobileSidebar> = memo(
  ({ PageNavLinks, isOpenMobileSidebar, handleCloseMobileSidebar, user }) => {
    const theme = useTheme();
    const mobile = useMediaQuery(theme.breakpoints.down("sm"));
    const history = useHistory();

    useEffect(() => {
      let mounted = true;

      if (mounted) {
        handleCloseMobileSidebar();
      }

      return () => {
        mounted = false;
      };
    }, [handleCloseMobileSidebar, mobile]);

    return (
      <StyledMobileSidebar
        theme={theme}
        open={isOpenMobileSidebar}
        PaperProps={{
          className: "sidebar-container",
        }}
        onClose={handleCloseMobileSidebar}
      >
        <div className="brand">
          <Avatar src={logo} className="brand-logo" alt="" />
          <div className="brand-name">{process.env.REACT_APP_CLIENT}</div>
          <div className="app-name">{APP_NAME}</div>

          <IconButton
            className="btn-close-drawer"
            color="primary"
            onClick={handleCloseMobileSidebar}
          >
            <MenuOpenIcon />
          </IconButton>
        </div>

        <nav className="nav">
          {PageNavLinks.map((nav, index) =>
            nav.hasSubLinks ? (
              <NavSidebarDropDown
                isActive={history.location.pathname
                  .toLowerCase()
                  .includes(nav.parentKey ? nav.parentKey.toLowerCase() : "")}
                text={nav.text}
                navLinks={nav.navLinks ? nav.navLinks : []}
                key={index}
              />
            ) : (
              <NavLink
                key={index}
                activeClassName="dropdown-link-item-active"
                to={nav.to}
                className="nav-item"
              >
                <div className="nav-item-label">{nav.text}</div>
              </NavLink>
            )
          )}
        </nav>
      </StyledMobileSidebar>
    );
  }
);

export default MobileSidebar;

export const StyledMobileSidebar = styled(Drawer)`
  .sidebar-container {
    width: ${(p) => p.theme.sidebar.maxWidth}px;
    min-width: ${(p) => p.theme.sidebar.maxWidth}px;
    display: grid;
    grid-auto-rows: ${(p) => p.theme.header.height}px 1fr;

    .brand {
      display: grid;
      grid-auto-flow: column;
      width: ${(p) => p.theme.sidebar.maxWidth}px;
      align-content: center;
      align-items: center;
      justify-items: start;
      justify-content: start;
      padding: 0 0.5em;
      background-color: ${(p) => p.theme.header.backgroundColor};
      color: ${(p) => p.theme.header.color};
      grid-template-areas: "logo app icon" "logo name icon";
      grid-auto-columns: auto 1fr auto;

      .brand-logo {
        grid-area: logo;
        height: 40px;
        width: 40px;
        margin-right: 10px;
      }
      .app-name {
        align-self: end;
        justify-self: center;
        grid-area: app;
        white-space: nowrap;
        justify-self: start;
        font-weight: 600;
        white-space: pre-wrap;
        text-transform: capitalize;
      }

      .brand-name {
        grid-area: name;
        font-weight: 400;
        font-size: 0.8em;
        align-self: start;
        white-space: pre-wrap;
        text-transform: capitalize;
      }

      .btn-close-drawer {
        justify-self: end;
        grid-area: icon;
      }
    }

    .nav {
      width: 100%;
      display: grid;
      grid-auto-flow: row;
      align-items: start;
      align-content: start;
      padding: 1em 0.5em;
      grid-gap: 0.5em;
      text-transform: uppercase;

      .nav-item {
        transition: 0.2s all ease-in-out;
        display: grid;
        grid-auto-flow: column;
        align-items: center;
        align-content: center;
        grid-gap: 0.5em;
        padding: 0.7em 0.3em;
        width: 100%;
        grid-auto-columns: 1fr;
        border-radius: 10px;
        justify-items: start;
        font-weight: 600;
        text-transform: capitalize;
        font-size: 1em;
        color: black !important;
        .nav-item-label {
          font-size: 0.87em !important;
          text-transform: capitalize;
        }

        &:hover {
          cursor: pointer;
          color: #3443e5 !important;
        }

        &.dropdown-link-item-active {
          color: #3443e5 !important;
        }
      }
    }
  }
`;
