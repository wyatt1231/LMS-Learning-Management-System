import {
  Button,
  Popover,
  Tooltip,
  useMediaQuery,
  useTheme,
} from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ListIcon from "@material-ui/icons/List";
import React, { memo } from "react";
import styled from "styled-components";
interface IPageTools {}

const PageTools: React.FC<IPageTools> = memo(({ children }) => {
  const theme = useTheme();
  const mobile = useMediaQuery((theme: any) => theme.breakpoints.down("sm"));

  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;
  return (
    <StyledPageTools>
      {mobile ? (
        <div className="mobile-toolbars">
          <Tooltip title="show page tools">
            <Button
              size="small"
              aria-describedby={id}
              color="primary"
              variant="contained"
              startIcon={<ListIcon />}
              onClick={handleClick}
              endIcon={<ExpandMoreIcon />}
            >
              Page Tools
            </Button>
          </Tooltip>
          <Popover
            id={id}
            open={open}
            anchorEl={anchorEl}
            onClose={handleClose}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "center",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "center",
            }}
          >
            <StyledNotificationPopOver theme={theme}>
              <div className="content-body" onClick={handleClose}>
                {children}
              </div>
            </StyledNotificationPopOver>
          </Popover>
        </div>
      ) : (
        <div className="desktop-toolbars">{children}</div>
      )}
    </StyledPageTools>
  );
});

export default PageTools;

const StyledPageTools = styled.div`
  .mobile-toolbars {
    display: grid;
    justify-content: end;
  }
  .desktop-toolbars {
    display: grid;
    grid-auto-flow: column;
    grid-gap: 0.5em;
    justify-content: end;
  }
`;

export const StyledNotificationPopOver = styled.div`
  min-width: 180px;
  display: grid;
  justify-content: center;
  .content-body {
    padding: 1em;
    font-size: 0.87em;
    display: grid;
    grid-gap: 0.5em;
    align-items: start;
    align-content: start;
    justify-content: start;
    justify-content: start;
    .MuiButtonBase-root {
      justify-content: start;
      justify-content: start;
    }
  }
`;
