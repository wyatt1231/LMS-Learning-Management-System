import { Button, CircularProgress, Grid } from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";
import React, { FC, memo, useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTheme } from "styled-components";
import CustomAvatar from "../../../Component/CustomAvatar";
import {
  InvalidDateTimeToDefault,
  InvalidDateToDefault,
} from "../../../Hooks/UseDateParser";
import AdminActions from "../../../Services/Actions/AdminActions";
import { setPageLinks } from "../../../Services/Actions/PageActions";
import UserActions from "../../../Services/Actions/UserActions";
import { RootStore } from "../../../Services/Store";
import ChangePasswordDialog from "../../SharedViews/ChangePasswordDialog";
import EditAdminImage from "./EditAdminImage";
import EditAdminInfoDialog from "./EditAdminInfoDialog";
import { StyledAdminProfile } from "./styles";

interface IAdminProfileView {}

export const AdminProfileView: FC<IAdminProfileView> = memo(() => {
  const dispatch = useDispatch();
  const theme = useTheme();

  const user_logs = useSelector(
    (store: RootStore) => store.UserReducer.user_logs
  );
  const fetch_user_logs = useSelector(
    (store: RootStore) => store.UserReducer.fetch_user_logs
  );

  const logged_admin = useSelector(
    (store: RootStore) => store.AdminReducer.logged_admin
  );

  console.log(`logged_admin`, logged_admin);

  const [open_change_image_dialog, set_open_change_image_dialog] =
    useState(false);

  const handleOpenChangeImageDialog = useCallback(() => {
    set_open_change_image_dialog(true);
  }, []);

  const handleCloseChangeImageDialog = useCallback(() => {
    set_open_change_image_dialog(false);
  }, []);

  const [open_edit_info, set_open_edit_info] = useState(false);

  const handleOpenEditInfo = useCallback(() => {
    set_open_edit_info(true);
  }, []);

  const handleCloseEditInfo = useCallback(() => {
    set_open_edit_info(false);
  }, []);

  const [open_change_pass, set_open_change_pass] = useState(false);

  const handleOpenChangePass = useCallback(() => {
    set_open_change_pass(true);
  }, []);

  const handleCloseChangePass = useCallback(() => {
    set_open_change_pass(false);
  }, []);

  const fetching_logged_admin = useSelector(
    (store: RootStore) => store.AdminReducer.fetching_logged_admin
  );

  useEffect(() => {
    dispatch(UserActions.getUserLogs());
    dispatch(AdminActions.getLoggedAdmin());
  }, [dispatch]);

  useEffect(() => {
    dispatch(
      setPageLinks([
        {
          link: "/admin/profile",
          title: "My Profile",
        },
      ])
    );
  }, [dispatch]);
  return (
    <>
      <StyledAdminProfile theme={theme} maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12} md={4} lg={3}>
            <div className="portion-container profile-container">
              {fetching_logged_admin && !logged_admin ? (
                <CircularProgress thickness={10} size={50} />
              ) : (
                <>
                  <CustomAvatar
                    style={{
                      height: 150,
                      width: 150,
                    }}
                    src={logged_admin?.picture}
                    errorMessage={logged_admin?.firstname.charAt(0)}
                  />

                  <div className="actions">
                    <Button
                      variant="outlined"
                      fullWidth
                      color="primary"
                      onClick={handleOpenChangeImageDialog}
                    >
                      Upload Image
                    </Button>
                    <Button
                      variant="outlined"
                      fullWidth
                      color="primary"
                      onClick={handleOpenEditInfo}
                    >
                      Edit Information
                    </Button>
                    <Button
                      variant="outlined"
                      fullWidth
                      color="primary"
                      onClick={handleOpenChangePass}
                    >
                      Change Password
                    </Button>
                  </div>

                  <div
                    className="form-group small row"
                    style={{
                      justifySelf: `start`,
                    }}
                  >
                    <div className="label">Registration Date</div>
                    <div className="value">
                      {InvalidDateTimeToDefault(logged_admin?.encoded_at, "-")}
                    </div>
                  </div>
                </>
              )}
            </div>
          </Grid>
          <Grid item xs={12} md={8} lg={6}>
            <div className="portion-container information-container">
              <Grid container spacing={1}>
                <Grid item xs={12}>
                  <div className="container-title">Personal Information</div>
                </Grid>

                <Grid item xs={12}>
                  <div className="form-group ">
                    <div className="label">Prefix </div>
                    <div className="value">{logged_admin?.prefix}</div>
                  </div>
                </Grid>
                <Grid item xs={12}>
                  <div className="form-group ">
                    <div className="label">First Name </div>
                    <div className="value">{logged_admin?.firstname}</div>
                  </div>
                </Grid>
                <Grid item xs={12}>
                  <div className="form-group ">
                    <div className="label">Middle Name </div>
                    <div className="value">{logged_admin?.middlename}</div>
                  </div>
                </Grid>
                <Grid item xs={12}>
                  <div className="form-group ">
                    <div className="label">Last Name </div>
                    <div className="value">{logged_admin?.lastname}</div>
                  </div>
                </Grid>
                <Grid item xs={12}>
                  <div className="form-group ">
                    <div className="label">Suffix </div>
                    <div className="value">{logged_admin?.suffix}</div>
                  </div>
                </Grid>
                <Grid item xs={12}>
                  <div className="form-group ">
                    <div className="label">Position </div>
                    <div className="value">{logged_admin?.position}</div>
                  </div>
                </Grid>
                <Grid item xs={12}>
                  <div className="form-group ">
                    <div className="label">Gender </div>
                    <div className="value">
                      {logged_admin?.gender === "f" ? "Female" : "Male"}
                    </div>
                  </div>
                </Grid>
                <Grid item xs={12}>
                  <div className="form-group ">
                    <div className="label">Date of Birth </div>
                    <div className="value">
                      {InvalidDateToDefault(logged_admin?.birth_date, "-")}
                    </div>
                  </div>
                </Grid>

                <Grid item xs={12}>
                  <div className="container-title">Contact Information</div>
                </Grid>
                <Grid item xs={12}>
                  <div className="form-group ">
                    <div className="label">Email Address</div>
                    <div className="value">{logged_admin?.email}</div>
                  </div>
                </Grid>
                <Grid item xs={12}>
                  <div className="form-group ">
                    <div className="label">Mobile Number</div>
                    <div className="value">{logged_admin?.mob_no}</div>
                  </div>
                </Grid>
              </Grid>
            </div>
          </Grid>

          <Grid item xs={12} md={12} lg={3}>
            <div className="portion-container activity-container">
              <div className="container-title">Your Activities</div>
              <div className="activities">
                {user_logs?.length <= 0 && (
                  <div
                    style={{
                      textAlign: `center`,
                      fontSize: `.85em`,
                    }}
                  >
                    No activity has been recorded yet
                  </div>
                )}
                {user_logs?.map((l, i) => (
                  <div key={i} className="activity-item">
                    <div className="time">
                      {InvalidDateTimeToDefault(l.encoded_at, "-")}
                    </div>
                    <div className="body">You have {l.activity}</div>
                  </div>
                ))}
              </div>
            </div>
          </Grid>
        </Grid>

        {logged_admin && (
          <>
            <EditAdminImage
              initial_form_values={logged_admin}
              open={open_change_image_dialog}
              handleClose={handleCloseChangeImageDialog}
            />

            <EditAdminInfoDialog
              initial_form_values={logged_admin}
              open={open_edit_info}
              handleClose={handleCloseEditInfo}
            />

            <ChangePasswordDialog
              open={open_change_pass}
              handleClose={handleCloseChangePass}
            />
          </>
        )}
      </StyledAdminProfile>
    </>
  );
});

export default AdminProfileView;
