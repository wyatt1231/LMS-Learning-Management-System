import { AppBar, Breadcrumbs, useTheme } from "@material-ui/core";
import clsx from "clsx";
import React, { FC, memo } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
interface ILink {
  link: string;
  title: string;
}

interface IPageLinks {
  links: Array<ILink>;
  isOpenMobileHeader?: boolean;
}

const PageLinks: FC<IPageLinks> = memo(({ links, isOpenMobileHeader }) => {
  const theme = useTheme();
  return (
    <StyledPageLinks
      theme={theme}
      className={clsx("", {
        "expand-navlinks": isOpenMobileHeader,
      })}
    >
      <Breadcrumbs aria-label="breadcrumb" className="bread-crumb">
        {links.map((v, i) => (
          <Link
            key={i}
            style={{ color: `#333` }}
            to={v.link}
            className="navText"
          >
            {v.title}
          </Link>
        ))}
      </Breadcrumbs>
    </StyledPageLinks>
  );
});

export default PageLinks;

const StyledPageLinks = styled(AppBar)`
  padding: 0 1em;
  background-color: ${(p) => p.theme.body.backgroundColor} !important;
  height: 45px;
  max-height: 45px;
  display: grid !important;
  align-content: center !important;
  border: none !important;
  box-shadow: none !important;
  margin-top: ${(p) => p.theme.header.height}px !important;
  transition: 0.2s margin-top ease-in-out !important;
  &.expand-navlinks {
    transition: 0.2s margin-top ease-in-out !important;
    margin-top: ${(p) => p.theme.header.height * 2}px !important;
  }
  .bread-crumb {
    .navText {
      text-decoration: none !important;
      font-weight: 600 !important;
    }
  }
`;
