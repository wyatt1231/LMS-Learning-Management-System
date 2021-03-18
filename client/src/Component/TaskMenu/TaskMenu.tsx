import { Badge, IconButton, Popover, useTheme } from "@material-ui/core";
import AssignmentRoundedIcon from "@material-ui/icons/AssignmentRounded";
import React from "react";
import { StyledTaskMenu, StyledTaskMenuPopOver } from "./styles";

const TaskMenu = () => {
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
    <StyledTaskMenu>
      <IconButton
        aria-describedby={id}
        color="inherit"
        size="small"
        onClick={handleClick}
        className="icon-header"
      >
        <Badge badgeContent={5} showZero={true} color="secondary">
          <AssignmentRoundedIcon />
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
        <StyledTaskMenuPopOver theme={theme} className="content-container">
          <div className="content-header">
            <div className="title">Tasks</div>
            <div className="subtitle">
              You have <strong>5</strong> on-going tasks
            </div>
          </div>
          <div className="content-body">
            <div className="content-title">MENUS</div>
          </div>
        </StyledTaskMenuPopOver>
      </Popover>
    </StyledTaskMenu>
  );
};

export default TaskMenu;
