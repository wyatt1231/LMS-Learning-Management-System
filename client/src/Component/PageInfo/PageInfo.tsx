import { Breadcrumbs, SvgIconTypeMap, useTheme } from "@material-ui/core";
import { OverridableComponent } from "@material-ui/core/OverridableComponent";
import PagesIcon from "@material-ui/icons/Pages";
import React, { memo } from "react";
import { NavLink } from "react-router-dom";
import { StyledPageInfo } from "./StyledPageInfo";
interface IPageInfo {
  links: Array<ILink>;
  pageTitle: string;
  Icon?: OverridableComponent<SvgIconTypeMap<{}, "svg">>;
}

export interface ILink {
  to: string;
  label: string;
}

const PageInfo: React.FC<IPageInfo> = memo(({ Icon, pageTitle, links }) => {
  const theme = useTheme();
  return (
    <StyledPageInfo theme={theme}>
      <div className="icon">{Icon ? <Icon /> : <PagesIcon />}</div>
      <Breadcrumbs className="breadcrumb">
        {links.map((value) => (
          <NavLink key={value.label} to={value.to}>
            {value.label}
          </NavLink>
        ))}
      </Breadcrumbs>
      <div className="title">{pageTitle}</div>
    </StyledPageInfo>
  );
});

export default PageInfo;
