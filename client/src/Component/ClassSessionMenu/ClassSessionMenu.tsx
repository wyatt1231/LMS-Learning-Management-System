import { Badge, IconButton, Popover, useTheme } from "@material-ui/core";
import LocalLibraryRoundedIcon from "@material-ui/icons/LocalLibraryRounded";
import React from "react";
import {
  StyledClassSessionMenu,
  StyledClassSessionMenuPopOver,
} from "./styles";

const ClassSessionMenu = () => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const theme = useTheme();

  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;
  return (
    <StyledClassSessionMenu>
      <IconButton
        aria-describedby={id}
        color="primary"
        size="small"
        onClick={handleClick}
        className="icon-header"
      >
        <Badge badgeContent={3} showZero={true} color="secondary">
          <LocalLibraryRoundedIcon />
        </Badge>
      </IconButton>

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
        <StyledClassSessionMenuPopOver
          theme={theme}
          className="content-container"
        >
          <div className="content-header">
            <div className="title">Tasks</div>
            <div className="subtitle">
              You have <strong>3</strong> on-going class sessions
            </div>
          </div>
          <div className="content-body">
            <div className="content-title">MENUS</div>
          </div>
        </StyledClassSessionMenuPopOver>
      </Popover>
    </StyledClassSessionMenu>
  );
};

export default ClassSessionMenu;
