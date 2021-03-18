import { Badge, IconButton, Popover, useTheme } from "@material-ui/core";
import NotificationsIcon from "@material-ui/icons/Notifications";
import React from "react";
import { StyledNotification, StyledNotificationPopOver } from "./styles";

const Notification = () => {
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
    <StyledNotification>
      <IconButton
        aria-describedby={id}
        color="inherit"
        size="small"
        onClick={handleClick}
        className="icon-header"
      >
        <Badge badgeContent={0} showZero={true} color="secondary">
          <NotificationsIcon />
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
        <StyledNotificationPopOver theme={theme} className="content-container">
          <div className="content-header">
            <div className="title">Notifications</div>
            <div className="subtitle">
              You have <strong>21</strong> unread notifacations
            </div>
          </div>
          <div className="content-body">
            <div className="content-title">MENUS</div>
          </div>
        </StyledNotificationPopOver>
      </Popover>
    </StyledNotification>
  );
};

export default Notification;
