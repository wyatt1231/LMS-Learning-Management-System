import { Grid, useMediaQuery } from "@material-ui/core";
import { useTheme } from "@material-ui/core/styles";
import Tab from "@material-ui/core/Tab";
import Tabs from "@material-ui/core/Tabs";
import React, { memo } from "react";
import styled from "styled-components";

export interface ITab {
  label: String;
  RenderComponent: React.FC | JSX.Element;
}

interface ICustomTab {
  tabs: Array<ITab>;
}

const CustomTab: React.FC<ICustomTab> = memo(({ tabs }) => {
  const theme = useTheme();
  const desktop = useMediaQuery(theme.breakpoints.up("md"));
  const [value, setValue] = React.useState(0);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <StyledCustomTabs>
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
              borderRight: desktop ? `1px solid ${theme.palette.divider}` : "",
              borderBottom: !desktop
                ? `1px solid ${theme.palette.divider}`
                : "",
              height: "100%",
            }}
          >
            {tabs.map((value, index) => (
              <Tab
                label={value.label}
                key={index}
                value={index}
                color="primary"
              />
            ))}
          </Tabs>
        </Grid>
        <Grid item xs={12} md={9} lg={10}>
          <div className="body">{tabs[value].RenderComponent}</div>
        </Grid>
      </Grid>
    </StyledCustomTabs>
  );
});

export default CustomTab;

const StyledCustomTabs = styled.div`
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
    padding: 1em;
    padding-top: 0.5em;
  }
`;
