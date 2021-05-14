import {
  AppBar,
  Avatar,
  IconButton,
  useMediaQuery,
  useTheme,
} from "@material-ui/core";
import AssignmentRoundedIcon from "@material-ui/icons/AssignmentRounded";
import MenuIcon from "@material-ui/icons/Menu";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import clsx from "clsx";
import React, { memo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useHistory } from "react-router-dom";
import styled from "styled-components";
// import logo from "../../Assets/Images/Logo/app_logo.png";
import logo from "../../Assets/Images/Logo/school_logo.jpg";
import Notification from "../../Component/Notification/Notification";
import PageLinks from "../../Component/PageLinks";
import UserProfile from "../../Component/UserProfile/UserProfile";
import { APP_NAME } from "../../Helpers/AppConfig";
import {
  toggleActivitySidebar,
  toggleClassReqSidebar,
} from "../../Services/Actions/PageActions";
import { RootStore } from "../../Services/Store";
import { IPageNavLinks } from "./Layout";
import ListAltRoundedIcon from "@material-ui/icons/ListAltRounded";
interface IHeader {
  PageNavLinks: Array<IPageNavLinks>;
  isOpenMobileHeader: boolean;
  isOpenMobileSidebar: boolean;
  handleToggleHeader: () => void;
  handleToggleSidebar: () => void;
  user: any;
}

const Header: React.FC<IHeader> = memo(
  ({
    PageNavLinks,
    isOpenMobileHeader,
    handleToggleHeader,
    handleToggleSidebar,
    isOpenMobileSidebar,
    user,
  }) => {
    const theme = useTheme();
    const mobile = useMediaQuery(theme.breakpoints.down("sm"));
    const dispatch = useDispatch();
    const history = useHistory();

    const user_loading = useSelector(
      (store: RootStore) => store.UserReducer.userLoading
    );

    const page_links = useSelector(
      (store: RootStore) => store.PageReducer.page_links
    );

    return (
      <>
        <StyledHeader
          theme={theme}
          className={clsx("", {
            "mobile-menu-open": isOpenMobileHeader,
          })}
        >
          <IconButton
            color="inherit"
            className="btn-open-drawer"
            onClick={handleToggleSidebar}
          >
            <MenuIcon />
          </IconButton>

          <div
            className="brand"
            style={{
              opacity: isOpenMobileSidebar ? 0 : 1,
            }}
            onClick={() => {
              // window.location.href = "/admin/dashboard";
              history.push(`/${user?.user_type}/dashboard`);
            }}
          >
            <Avatar src={logo} className="brand-logo" alt="" />
            <div className="brand-name">{process.env.REACT_APP_CLIENT}</div>
            <div className="app-name">{APP_NAME}</div>
          </div>

          <nav className="nav">
            {PageNavLinks.map((nav, index) => (
              <NavLink
                key={index}
                activeClassName="nav-item-active"
                to={nav.to}
                className="nav-item"
              >
                {nav.text}
              </NavLink>
            ))}
          </nav>

          <section className="tools">
            {/* {user?.user_type === "tutor" && (
              <>
                <TaskMenu />
              </>
            )}

            <Message /> */}

            <Notification />

            {(user?.user_type === "admin" || user?.user_type === "student") && (
              <>
                <IconButton
                  color="inherit"
                  size="small"
                  onClick={() => {
                    dispatch(toggleClassReqSidebar(true));
                  }}
                  className="icon-header"
                >
                  <ListAltRoundedIcon />
                </IconButton>
                <IconButton
                  color="inherit"
                  size="small"
                  onClick={() => {
                    dispatch(toggleActivitySidebar(true));
                  }}
                  className="icon-header"
                >
                  <AssignmentRoundedIcon />
                </IconButton>
              </>
            )}

            {!user_loading && !!user && (
              <UserProfile
                user={user}
                variant={mobile ? "mobile" : "desktop"}
              />
            )}
          </section>

          <IconButton
            color="inherit"
            className="btn-open-menu"
            onClick={handleToggleHeader}
          >
            <MoreVertIcon />
          </IconButton>
        </StyledHeader>
        <PageLinks isOpenMobileHeader={isOpenMobileHeader} links={page_links} />
      </>
    );
  }
);

export default Header;

const StyledHeader = styled(AppBar)`
  height: ${(p) => p.theme.header.height}px;
  display: grid !important;
  grid-auto-flow: column !important;
  grid-auto-columns: ${(p) => p.theme.sidebar.maxWidth}px 1fr auto;
  grid-gap: 1.5em;
  padding: 0 1em;
  /* box-shadow: 0 0.125rem 0.625rem rgba(0, 0, 0, 0.1),
    0 0.0625rem 0.125rem rgba(0, 0, 0, 0.1) !important;
  border-bottom: 2px solid rgba(0, 0, 0, 0.1); */

  /* background: ${(p) => p.theme.header.backgroundColor} !important;
  color: ${(p) => p.theme.header.color} !important; */

  .brand {
    display: grid;
    grid-auto-flow: column;
    width: ${(p) => p.theme.sidebar.maxWidth}px;
    align-content: center;
    align-items: center;
    justify-items: start;
    justify-content: start;
    grid-template-areas: "logo app" "logo name";
    cursor: pointer;
    /* grid-gap: 0.3em; */
    .brand-logo {
      grid-area: logo;
      height: 2em;
      width: 2em;
      background-color: #fff;
      margin-right: 0.2em;
      box-shadow: 0 5px 10px -4px rgba(0, 0, 0, 0.56),
        0 2px 8px 0px rgba(0, 0, 0, 0.12), 0 2px 5px -3px rgba(0, 0, 0, 0.2);
    }

    .app-name {
      align-self: end;
      justify-self: center;
      grid-area: app;
      white-space: nowrap;
      justify-self: start;
      font-weight: 500;
      width: ${(p) => p.theme.sidebar.maxWidth - 50}px;
      white-space: pre-wrap;
    }

    .brand-name {
      width: ${(p) => p.theme.sidebar.maxWidth - 50}px;
      grid-area: name;
      font-weight: 500;
      font-size: 0.75em;
      align-self: start;
      white-space: pre-wrap;
      text-transform: capitalize;
    }
  }

  .nav {
    justify-self: start;
    display: grid;
    grid-auto-flow: column;
    justify-self: start;
    justify-content: start;
    align-items: center;
    align-content: center;
    grid-gap: 1em;
    .nav-item {
      transition: 0.5s all ease-in-out;
      justify-self: center;
      display: grid;
      text-align: center;
      align-items: center;
      align-content: center;
      align-self: center;
      justify-items: center;
      justify-content: center;

      font-weight: 500;
      font-size: 0.9em;
      color: rgba(255, 255, 255, 0.7);

      &.nav-item-active {
        transition: 0.2s all ease-in-out;
        color: ${(p) => p.theme.palette.primary.contrastText};
      }

      /* .nav-item-label {
        
      } */

      &:hover {
        transition: 0.2s all ease-in-out;
        color: ${(p) => p.theme.palette.primary.contrastText};
      }
    }
  }

  .tools {
    justify-self: end;
    display: grid;
    grid-gap: 1em;
    grid-auto-flow: column;
    align-items: center;
  }

  .btn-open-drawer,
  .btn-open-menu {
    display: none;
  }

  /* MOBILE SCREEN */
  @media screen and (max-width: ${(props) =>
      props.theme.breakpoints.values.md}px) {
    grid-gap: 0;
    grid-auto-columns: 40px 1fr 40px;
    grid-template-areas: "btn-drawer brand btn-menu" "menu menu menu";
    grid-auto-rows: ${(p) => p.theme.header.height}px
      ${(p) => p.theme.header.height}px;
    overflow: hidden;
    box-shadow: 0 0.125rem 0.625rem rgba(0, 0, 0, 0.1),
      0 0.0625rem 0.125rem rgba(0, 0, 0, 0.1) !important;
    align-items: center;
    /* align-content: center; */

    .btn-open-drawer {
      grid-area: btn-drawer;
      display: grid;
    }

    .btn-open-menu {
      grid-area: btn-menu;
      display: grid;
    }

    .brand {
      grid-area: brand;
      justify-self: center;
      align-content: center;
      align-items: center;
      justify-items: start;
      justify-content: start;
      width: unset !important;
      * {
        width: unset !important;
      }
    }
    .tools {
      grid-area: menu;
    }

    .nav {
      display: none;
    }

    &.mobile-menu-open {
      transition: 0.2s all ease-in-out !important;
      height: ${(p) => p.theme.header.height * 2}px;
    }
  }
`;
