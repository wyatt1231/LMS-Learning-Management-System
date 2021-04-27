import { Badge, IconButton, Popover, useTheme } from "@material-ui/core";
import NotificationsIcon from "@material-ui/icons/Notifications";
import clsx from "clsx";
import moment from "moment";
import React, { memo, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import UserActions from "../../Services/Actions/UserActions";
import { RootStore } from "../../Services/Store";
import LinearLoadingProgress from "../LinearLoadingProgress";
import { StyledNotification, StyledNotificationPopOver } from "./styles";

const ringtone = require("../../Assets/Sounds/ringtone.mp3");

const audio = new Audio(ringtone);

const Notification = memo(() => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const theme = useTheme();
  const history = useHistory();
  const dispatch = useDispatch();

  const [notif_len, set_notif_len] = useState<number>(0);
  const [unchecked_notif, set_unchecked_notif] = useState<number>(0);

  const user_notif = useSelector(
    (store: RootStore) => store.UserReducer.user_notif
  );

  const fetch_user_notif = useSelector(
    (store: RootStore) => store.UserReducer.fetch_user_notif
  );

  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget);
    set_notif_len((p) => p + 1);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  useEffect(() => {
    try {
      if (user_notif) {
        if (user_notif?.length > notif_len) {
          audio.muted = false;
          audio.play();
        }
      }
    } catch (error) {}

    set_notif_len(user_notif?.length);
  }, [user_notif]);

  useEffect(() => {
    if (!!user_notif) {
      const unchecked_notifs = user_notif.filter((n) => n.checked === "n");
      set_unchecked_notif(unchecked_notifs.length);
    }
  }, [user_notif]);

  return (
    <StyledNotification>
      <IconButton
        aria-describedby={id}
        color="inherit"
        size="small"
        onClick={handleClick}
        className="icon-header"
      >
        <Badge badgeContent={unchecked_notif} showZero={true} color="secondary">
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
              You have <strong>{unchecked_notif}</strong> unread notifications
            </div>
          </div>
          <div className="content-body">
            <LinearLoadingProgress show={fetch_user_notif} />
            {user_notif?.length <= 0 && (
              <div style={{ color: `green` }}>No notification yet!!!</div>
            )}
            <div className="notif-item-ctnr">
              {user_notif?.map((n, i) => (
                <div
                  key={i}
                  className="notif-item"
                  onClick={async () => {
                    dispatch(UserActions.checkUserNotif(n.notif_user_pk));
                    history.push(n.link);
                  }}
                >
                  <div className="body">{n.body}</div>
                  <div
                    className={clsx("dt", {
                      checked: n.checked === "n",
                    })}
                  >
                    {moment(n.encoded_at).fromNow()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </StyledNotificationPopOver>
      </Popover>
    </StyledNotification>
  );
});

export default Notification;
