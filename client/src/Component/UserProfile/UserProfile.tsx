import { Popover, useTheme } from "@material-ui/core";
import ExpandLessIcon from "@material-ui/icons/ExpandLess";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import React, { memo, useCallback } from "react";
import { NavLink } from "react-router-dom";
import { removeToken } from "../../Helpers/AppConfig";
import CustomAvatar from "../CustomAvatar";
import { StyledPopOverContent, StyledUserProfile } from "./styles";

interface IUserProfile {
  variant: "mobile" | "desktop";
  user: any;
}

const UserProfile: React.FC<IUserProfile> = memo(({ variant, user }) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const theme = useTheme();

  const handleClick = useCallback((event) => {
    setAnchorEl(event.currentTarget);
  }, []);

  const handleClose = useCallback(() => {
    setAnchorEl(null);
  }, []);

  const handleLogout = useCallback(() => {
    removeToken();
    window.location.href = "/login";
  }, []);

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  let ProfileLink;

  if (user?.user_type === "admin") {
    ProfileLink = (
      <NavLink to="/admin/profile" className="link">
        My Profile
      </NavLink>
    );
  } else if (user?.user_type === "tutor") {
    ProfileLink = (
      <NavLink to="/clinic/myprofile" className="link">
        My Profile
      </NavLink>
    );
  }

  return (
    <StyledUserProfile theme={theme}>
      <div className="header" aria-describedby={id} onClick={handleClick}>
        <CustomAvatar
          src={user?.picture}
          errorMessage={`${user?.fullname.charAt(0)}`}
          className="profile-image"
        />
        {open ? (
          <ExpandLessIcon className="icon" fontSize="small" />
        ) : (
          <ExpandMoreIcon className="icon" fontSize="small" />
        )}

        {variant === "mobile" ? null : (
          <div className="user">
            <div className="fullname">{user?.fullname}</div>
            <div className="designation">{user?.user_type}</div>
          </div>
        )}
      </div>
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
        <StyledPopOverContent theme={theme} className="content-container">
          <div className="content-header">
            <CustomAvatar
              src={user?.picture}
              errorMessage={`${user?.fullname.charAt(0)}`}
              className="content-header-image"
            />
            <div className="content-header-user">
              <div className="name">{user?.fullname}</div>
              <div className="designation">{user?.user_type}</div>
            </div>
          </div>
          <div className="content-body">
            <div className="content-title">MENUS</div>
            <div className="content-items">
              {ProfileLink}
              <div className="link" onClick={handleLogout}>
                Logout
              </div>
            </div>
          </div>
        </StyledPopOverContent>
      </Popover>
    </StyledUserProfile>
  );
});

export default UserProfile;
