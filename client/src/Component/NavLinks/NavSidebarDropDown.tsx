import { Collapse } from "@material-ui/core";
import ArrowDropDownRoundedIcon from "@material-ui/icons/ArrowDropDownRounded";
import clsx from "clsx";
import React, { FC, useState } from "react";
import { NavLink } from "react-router-dom";
import styled, { useTheme } from "styled-components";

interface INavSidebarDropDown {
  isActive: boolean;
  text: string;
  navLinks: Array<any>;
}

const NavSidebarDropDown: FC<INavSidebarDropDown> = ({
  isActive,
  text,
  navLinks,
}) => {
  const [open, setOpen] = useState(false);
  const theme = useTheme();

  return (
    <StyledNavSidebarDropdown
      theme={theme}
      className={clsx("nav-item-collapse", {
        "dropdown-link-item-active": isActive,
      })}
    >
      <div className="header" onClick={() => setOpen((prev) => !prev)}>
        <div className="nav-item-label">{text}</div>
        <ArrowDropDownRoundedIcon className="nav-item-btn" color="primary" />
      </div>
      <Collapse in={open}>
        <div className="body">
          {navLinks.map((link, index) => (
            <NavLink
              className="sub-link"
              activeClassName="nav-item-active"
              to={link.to}
              key={index}
            >
              {link.label}
            </NavLink>
          ))}
        </div>
      </Collapse>
    </StyledNavSidebarDropdown>
  );
};

const StyledNavSidebarDropdown = styled.div`
  &.dropdown-link-item-active {
    color: #3443e5 !important;
    .nav-item-icon,
    .nav-item-label {
      color: #3443e5 !important;
    }
  }
  .header {
    transition: 0.2s all ease-in-out;
    padding: 0.7em 0.3em;
    width: 100%;
    border-radius: 10px;
    grid-auto-columns: 30px 1fr 50px;
    justify-items: start;
    grid-template-areas: "text collapse";
    grid-auto-flow: column;
    align-items: center;
    align-content: center;
    display: grid;
    font-weight: 500;
    grid-gap: 0.5em;
    color: rgba(0, 0, 0, 0.7);
    text-transform: capitalize;

    &:hover {
      cursor: pointer;
      color: #3443e5 !important;
    }

    .nav-item-label {
      grid-area: text;
      font-size: 0.87em !important;
    }
    .nav-item-btn {
      justify-self: end;
      grid-area: collapse;
      transition: 0.2s all ease-in-out;
      border-radius: 50%;
      &:hover {
        cursor: pointer;
        transition: 0.2s all ease-in-out;
        color: #3443e5 !important;
      }
    }
  }

  .body {
    border-left: 2px solid #97b7fc;
    padding-left: 35px;
    margin-left: 12px;
    display: grid;
    grid-auto-flow: row;
    grid-gap: 0.5em;
    font-size: 0.87em;

    .sub-link {
      padding: 0.5em 0;
      text-transform: capitalize;
      font-weight: 500;
      &:hover {
        color: #3443e5 !important;
      }
    }
    .nav-item-active {
      color: #3443e5;
    }
  }
`;

export default NavSidebarDropDown;
