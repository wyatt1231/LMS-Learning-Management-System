import { Grid } from "@material-ui/core";
import { createStyles, Theme, withStyles } from "@material-ui/core/styles";
import Tab from "@material-ui/core/Tab";
import Tabs from "@material-ui/core/Tabs";
import React, { memo, useEffect, useState } from "react";
import { useHistory } from "react-router";
import styled from "styled-components";

export interface ITab {
  label: string;
  link: string;
}

interface StyledTabsProps {
  value: number;
  onChange: (event: React.ChangeEvent<{}>, newValue: number) => void;
}

interface ILinkTabs {
  tabs: Array<ITab>;
  RenderSwitchComponent: any;
}

interface StyledTabProps {
  label: any;
}

const AntTabs = withStyles({
  root: {
    borderBottom: "1px solid #e8e8e8",
  },
  indicator: {
    backgroundColor: "#1890ff",
  },
})(Tabs);

const AntTab = withStyles((theme: any) =>
  createStyles({
    root: {
      textTransform: "none",
      minWidth: 72,
      fontWeight: theme.typography.fontWeightRegular,
      marginRight: theme.spacing(4),
      "&:hover": {
        color: "#40a9ff",
        opacity: 1,
      },
      "&$selected": {
        color: "#1890ff",
        fontWeight: theme.typography.fontWeightMedium,
      },
      "&:focus": {
        color: "#40a9ff",
      },
    },
    selected: {},
  })
)((props: any) => <Tab disableRipple {...props} />);

const LinkTabs: React.FC<ILinkTabs> = memo(
  ({ tabs, RenderSwitchComponent }) => {
    const history = useHistory();

    const [click_counter, set_click_counter] = useState(0);

    return (
      <StyledLinkTabs>
        <Grid container>
          <Grid item xs={12}>
            <AntTabs
              orientation={"horizontal"}
              variant="scrollable"
              value={tabs.findIndex((p) =>
                window.location.pathname
                  .toLowerCase()
                  .includes(p.link.toLowerCase())
              )}
              className="tabs"
              indicatorColor="primary"
              textColor="primary"
            >
              {tabs.map((value, index) => (
                <AntTab
                  label={value.label}
                  key={index}
                  value={index}
                  onClick={() => {
                    set_click_counter((prev) => prev + 1);
                    history.push(value.link);
                  }}
                ></AntTab>
              ))}
            </AntTabs>
          </Grid>
          <Grid item xs={12}>
            <div className="body" style={{ minHeight: 400, padding: `1em` }}>
              {RenderSwitchComponent}
            </div>
          </Grid>
        </Grid>
      </StyledLinkTabs>
    );
  }
);

export default LinkTabs;

const StyledLinkTabs = styled.div`
  width: 100%;
  height: 100%;

  span.PrivateTabIndicator-root-1.PrivateTabIndicator-colorPrimary-2.MuiTabs-indicator {
    border-bottom-color: blue !important;
  }
  .tabs {
    .Mui-selected {
      color: #2196f3 !important;
      border-bottom-color: #2196f3 !important;
    }

    .MuiTab-wrapper {
    }
  }
  .body {
    /* margin-top: 0.5em; */
    /* padding: 1em; */
    /* border: 0.01em solid rgb(0, 0, 0, 0.1); */
    border-radius: 7px;
  }
`;
