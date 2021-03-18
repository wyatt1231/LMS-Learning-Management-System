import { Popover } from "@material-ui/core";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import clsx from "clsx";
import React, { memo } from "react";
import { NavLink } from "react-router-dom";
import styled from "styled-components";

interface INavHeaderDropdown {
  isActive: boolean;
  label: string;
  navLinks: Array<any>;
}

const NavHeaderDropdown: React.FC<INavHeaderDropdown> = memo(
  ({ isActive, label, navLinks }) => {
    const [anchorEl, setAnchorEl] = React.useState(null);

    const handlePopoverOpen = (event: any) => {
      setAnchorEl(event.currentTarget);
    };

    const handlePopoverClose = () => {
      setAnchorEl(null);
    };

    const open = Boolean(anchorEl);
    return (
      <StyledDropdownNavLink>
        <div
          className={clsx("nav-item-button", {
            "active-parent": isActive,
          })}
          aria-owns={open ? "mouse-over-popover" : undefined}
          aria-haspopup="true"
          onClick={handlePopoverOpen}
        >
          <div className="nav-item-label">{label}</div>
          <ArrowDropDownIcon className="nav-item-arrow" fontSize="small" />
        </div>

        <StyledPopOver
          id="mouse-over-popover"
          open={open}
          anchorEl={anchorEl}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "left",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "left",
          }}
          onClose={handlePopoverClose}
          disableRestoreFocus
          style={{ marginTop: "1em" }}
        >
          <div className="dropdown-content">
            {navLinks.map((link, index) => (
              <NavLink
                to={link.to}
                activeClassName="dropdown-link-item-active"
                key={index}
                className="dropdown-link-item"
                onClick={handlePopoverClose}
              >
                {link.label}
              </NavLink>
            ))}
          </div>
        </StyledPopOver>
      </StyledDropdownNavLink>
    );
  }
);

const StyledDropdownNavLink = styled.div`
  align-self: end;
  justify-self: start;
  display: grid;
  align-content: end;
  justify-content: start;

  .nav-item-button {
    transition: 0.5s all ease-in-out;
    justify-self: center;
    display: grid;
    text-align: center;
    align-items: center;
    align-content: center;
    justify-items: center;
    justify-content: center;
    color: #fff !important;
    font-weight: 500;
    grid-template-areas: "label btn-arrow";
    grid-auto-columns: 1fr auto;
    &:hover {
      cursor: pointer;
    }
    &.active-parent {
      transition: 0.2s all ease-in-out;
      color: #f4fa9c !important;
    }

    .nav-item-label {
      grid-area: label;
      font-size: 0.87em;
    }
    .nav-item-arrow {
      grid-area: btn-arrow;
      color: #fff;
    }
  }
`;

const StyledPopOver = styled(Popover)`
  .dropdown-content {
    .dropdown-link-item {
      color: black;
      font-size: 0.85em !important;
      font-weight: 500 !important;
      padding: 0.7em;

      &:hover {
        background-color: rgba(0, 0, 0, 0.1);
        cursor: pointer;
        color: blue;
      }
    }
    .dropdown-link-item-active {
      color: blue;
    }
    display: grid;
    grid-gap: 0.5em;
    min-width: 200px;
    margin: 0.3em 0;
  }
`;

export default NavHeaderDropdown;
