import { Grid, useMediaQuery } from "@material-ui/core";
import { useTheme } from "@material-ui/core/styles";
import Tab from "@material-ui/core/Tab";
import Tabs from "@material-ui/core/Tabs";
import React, { memo } from "react";
import { useHistory } from "react-router";
import styled from "styled-components";

export interface ITab {
  label: String;
  link: string;
}

interface ILinkTabs {
  tabs: Array<ITab>;
  RenderSwitchComponent: any;
}

const LinkTabs: React.FC<ILinkTabs> = memo(
  ({ tabs, RenderSwitchComponent }) => {
    const theme = useTheme();
    const history = useHistory();
    const desktop = useMediaQuery(theme.breakpoints.up("md"));
    const [value, setValue] = React.useState(0);
    const handleChange = (event, newValue) => {
      setValue(newValue);
    };

    return (
      <StyledLinkTabs>
        <Grid container>
          <Grid item xs={12} md={3} lg={2}>
            <Tabs
              orientation={desktop ? "vertical" : "horizontal"}
              variant="scrollable"
              value={value}
              onChange={handleChange}
              className="tabs"
              indicatorColor="primary"
              textColor="primary"
              style={{
                // borderRight: desktop
                //   ? `1px solid ${theme.palette.divider}`
                //   : "",
                // borderBottom: !desktop
                //   ? `1px solid ${theme.palette.divider}`
                //   : "",
                height: "100%",
              }}
            >
              {tabs.map((value, index) => (
                <Tab
                  label={value.label}
                  key={index}
                  value={index}
                  color="primary"
                  onClick={() => {
                    history.push(value.link);
                  }}
                />
              ))}
            </Tabs>
          </Grid>
          <Grid item xs={12} md={9} lg={10}>
            <div className="body" style={{ minHeight: 600 }}>
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
  .tabs {
    .Mui-selected {
      /* color: #2196f3 !important; */
    }

    .MuiTab-wrapper {
      font-weight: 700 !important;
      letter-spacing: 0.3pt;
      word-spacing: 0.3pt;
    }
  }
  .body {
    /* margin-top: 0.5em; */
    /* padding: 1em; */
    /* border: 0.01em solid rgb(0, 0, 0, 0.1); */
    border-radius: 7px;
  }
`;
