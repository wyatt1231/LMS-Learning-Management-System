import { Badge, IconButton, Popover, useTheme } from "@material-ui/core";
import MessageIcon from "@material-ui/icons/Message";
import React from "react";
import { StyledMessage, StyledMessagePopOver } from "./styles";

const Message = () => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const theme = useTheme();
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;
  return (
    <StyledMessage>
      <IconButton
        aria-describedby={id}
        color="inherit"
        size="small"
        onClick={handleClick}
        className="icon-header"
      >
        <Badge badgeContent={0} showZero={true} color="secondary">
          <MessageIcon />
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
        <StyledMessagePopOver theme={theme} className="content-container">
          <div className="content-header">
            <div className="title">Messages</div>
            <div className="subtitle">
              You have <strong>21</strong> unread messages
            </div>
          </div>
          <div className="content-body">
            <div className="content-title">MENUS</div>
          </div>
        </StyledMessagePopOver>
      </Popover>
    </StyledMessage>
  );
};

export default Message;
