import FullCalendar from "@fullcalendar/react";
import resourceTimeGridPlugin from "@fullcalendar/resource-timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import "@fullcalendar/timegrid/main.css";
import "@fullcalendar/daygrid/main.css";
import "../../../Component/Calendar/calendar.css";
import {
  Avatar,
  Button,
  CircularProgress,
  Grid,
  useMediaQuery,
  useTheme,
} from "@material-ui/core";
import React, { memo, FC, useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import CustomAvatar from "../../../Component/CustomAvatar";
import { setPageLinks } from "../../../Services/Actions/PageActions";
import { StyledDashboardTutor } from "./styles";
import { StyledDashboardItem } from "../../../Styles/GlobalStyles";
import { Rating } from "@material-ui/lab";
import LocalLibraryRoundedIcon from "@material-ui/icons/LocalLibraryRounded";
import ChangePasswordDialog from "../../SharedViews/ChangePasswordDialog";
import EditTutorBiography from "./EditTutorBiography";
import EditTutorPicture from "./EditTutorPicture";
import TutorActions from "../../../Services/Actions/TutorActions";
import { RootStore } from "../../../Services/Store";
import { StringEmptyToDefault } from "../../../Hooks/UseStringFormatter";
import ClassActions from "../../../Services/Actions/ClassActions";
import ClassSessionActions from "../../../Services/Actions/ClassSessionActions";
import LinearLoadingProgress from "../../../Component/LinearLoadingProgress";
import CircularLoadingProgress from "../../../Component/CircularLoadingProgress";

interface IDashboardTutorView {}
export const DashboardTutorView: FC<IDashboardTutorView> = memo(() => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const desktop = useMediaQuery(theme.breakpoints.up("md"));

  const [open_change_pass, set_open_change_pass] = useState(false);

  const handleOpenChangePass = useCallback(() => {
    set_open_change_pass(true);
  }, []);

  const handleCloseChangePass = useCallback(() => {
    set_open_change_pass(false);
  }, []);

  const [open_edit_picture, set_open_edit_picture] = useState(false);

  const handleOpenEditPicture = useCallback(() => {
    set_open_edit_picture(true);
  }, []);

  const handleCloseEditPicture = useCallback(() => {
    set_open_edit_picture(false);
  }, []);

  const [open_edit_bio, set_open_edit_bio] = useState(false);

  const handleOpenEditBio = useCallback(() => {
    set_open_edit_bio(true);
  }, []);

  const handleCloseEditBio = useCallback(() => {
    set_open_edit_bio(false);
  }, []);

  const loggedin_tutor = useSelector(
    (store: RootStore) => store.TutorReducer.loggedin_tutor
  );
  const fetch_loggedin_tutor = useSelector(
    (store: RootStore) => store.TutorReducer.fetch_loggedin_tutor
  );

  const total_tutor_class_stats = useSelector(
    (store: RootStore) => store.ClassReducer.total_tutor_class_stats
  );
  const fetch_total_tutor_class_stats = useSelector(
    (store: RootStore) => store.ClassReducer.fetch_total_tutor_class_stats
  );

  const logged_in_tutor_session_cal = useSelector(
    (store: RootStore) => store.ClassSessionReducer.logged_in_tutor_session_cal
  );

  const fetch_logged_in_tutor_session_cal = useSelector(
    (store: RootStore) =>
      store.ClassSessionReducer.fetch_logged_in_tutor_session_cal
  );

  useEffect(() => {
    dispatch(TutorActions.getLoggedInTutor());
  }, [dispatch]);

  useEffect(() => {
    dispatch(ClassActions.getTotalTutorClassStats());
  }, [dispatch]);

  useEffect(() => {
    dispatch(ClassSessionActions.getLoggedInTutorSessionCalendar());
  }, [dispatch]);

  useEffect(() => {
    let mounted = true;

    const settingPageLinks = () => {
      dispatch(
        setPageLinks([
          {
            link: "/tutor/dashboard",
            title: "Dashboard",
          },
        ])
      );
    };

    mounted && settingPageLinks();
    return () => {
      mounted = false;
    };
  }, [dispatch]);
  return (
    <>
      <StyledDashboardTutor theme={theme}>
        <Grid container spacing={4}>
          <Grid item xs={12}>
            {fetch_loggedin_tutor && !loggedin_tutor ? (
              <CircularLoadingProgress />
            ) : (
              <Grid
                container
                style={{
                  backgroundColor: `#fff`,
                  borderRadius: 10,
                  padding: `1em`,
                }}
              >
                <Grid item xs={12} md={10}>
                  <div className="profile-container">
                    <div className="prof-pic">
                      <CustomAvatar
                        heightSpacing={15}
                        widthSpacing={15}
                        src={loggedin_tutor?.picture}
                        errorMessage={`${loggedin_tutor?.firstname?.charAt(
                          0
                        )} ${loggedin_tutor?.lastname?.charAt(0)}`}
                      />
                    </div>
                    <div className="greeting">
                      Greetings, {loggedin_tutor?.position}{" "}
                      {loggedin_tutor?.firstname} {loggedin_tutor?.lastname}{" "}
                      {loggedin_tutor?.suffix}
                    </div>
                    <div className="bio">
                      {StringEmptyToDefault(
                        loggedin_tutor?.bio,
                        "Nothing to show"
                      )}
                    </div>
                    <div className="info-group-container">
                      <div className="info-group">
                        <div className="label">Ratings</div>
                        <div className="value">
                          {loggedin_tutor?.average_rating} stars
                          <Rating
                            name="rating"
                            value={loggedin_tutor?.average_rating}
                            precision={0.1}
                            readOnly
                          />
                        </div>
                      </div>
                      <div className="info-group">
                        <div className="label">Favorited By</div>
                        <div className="value">
                          {loggedin_tutor?.fav_count}{" "}
                          {loggedin_tutor?.fav_count > 1
                            ? "Students"
                            : "Student"}
                        </div>
                      </div>
                    </div>
                  </div>
                </Grid>
                <Grid item xs={12} md={2}>
                  <div
                    style={{
                      display: `grid`,
                      gridGap: `.5em`,
                      alignContent: `center`,
                      alignItems: `center`,
                      justifyContent: `center`,
                      justifyItems: `center`,
                      borderLeft: desktop ? `.01em solid rgba(0,0,0,.1)` : 0,
                      borderTop: !desktop ? `.01em solid rgba(0,0,0,.1)` : 0,
                      height: `100%`,
                    }}
                  >
                    <Button
                      color="primary"
                      onClick={() => {
                        handleOpenEditBio();
                      }}
                    >
                      Edit Biography
                    </Button>
                    <Button
                      color="primary"
                      onClick={() => {
                        handleOpenEditPicture();
                      }}
                    >
                      Change Picture
                    </Button>
                    <Button
                      color="primary"
                      onClick={() => {
                        handleOpenChangePass();
                      }}
                    >
                      Change Password
                    </Button>
                  </div>
                </Grid>
              </Grid>
            )}
          </Grid>

          {fetch_total_tutor_class_stats && !total_tutor_class_stats ? (
            <Grid item xs={12}>
              <CircularProgress />
            </Grid>
          ) : (
            <>
              {total_tutor_class_stats?.map((s, i) => (
                <Grid item md={4} key={i}>
                  <StyledDashboardItem>
                    <div className="label" style={{ color: `#333` }}>
                      {s.label}
                    </div>
                    <div className="stat-value">
                      {fetch_total_tutor_class_stats ? (
                        <CircularProgress size={20} />
                      ) : (
                        s.value
                      )}
                    </div>
                    <Avatar
                      className="avatar"
                      style={{
                        backgroundColor: "#ffebee",
                        color: "#b71c1c",
                      }}
                    >
                      <LocalLibraryRoundedIcon />
                    </Avatar>
                  </StyledDashboardItem>
                </Grid>
              ))}
            </>
          )}
          <Grid item xs={12}>
            <div className="schedule-container">
              <div className="container-title">Schedule</div>
              <LinearLoadingProgress show={fetch_logged_in_tutor_session_cal} />

              {logged_in_tutor_session_cal && (
                <FullCalendar
                  schedulerLicenseKey={
                    "CC-Attribution-NonCommercial-NoDerivatives"
                  }
                  initialView={"timeGridFourDay"}
                  plugins={[resourceTimeGridPlugin, interactionPlugin]}
                  views={{
                    timeGridFourDay: {
                      type: "timeGrid",
                      duration: { days: 5 },
                      buttonText: "5 day",
                    },
                  }}
                  events={logged_in_tutor_session_cal}
                  eventMinHeight={70}
                  expandRows={true}
                  stickyHeaderDates={true}
                  slotMinTime="07:00"
                  slotMaxTime="21:00"
                  contentHeight={700}
                  height={700}
                  allDaySlot={false}
                  eventContent={(e) => {
                    const data = e.event;

                    return (
                      <div
                        style={{
                          boxShadow: `0 1px 2px rgba(0,0,0,.1)`,
                          backgroundColor: data.backgroundColor,
                          color: data.textColor,
                          padding: `.5em`,
                          fontSize: `.9em`,
                          display: `grid`,
                          gridAutoFlow: `column`,
                          justifyContent: `start`,
                          alignItems: `center`,
                          alignContent: `center`,
                          gridGap: `.87em`,
                          borderRadius: 5,
                          border: `.01em solid rgba(0,0,0,.1)`,
                          letterSpacing: `.3pt`,
                          wordSpacing: `.3pt`,
                        }}
                      >
                        <div
                          style={{
                            fontWeight: 900,
                            textTransform: `uppercase`,
                            color: data.backgroundColor,
                            backgroundColor: data.textColor,
                            padding: `5px`,
                            borderRadius: `50%`,
                            height: 20,
                            width: 20,
                            textAlign: `center`,
                            display: `grid`,
                            alignItems: `center`,
                            alignContent: `center`,
                            fontSize: `.8em`,
                          }}
                        >
                          {data.extendedProps.sts_pk}
                        </div>
                        <div
                          style={{
                            fontWeight: 600,
                            fontSize: `1em`,
                          }}
                        >
                          {data.title}
                        </div>
                      </div>
                    );
                  }}
                />
              )}
            </div>
          </Grid>
        </Grid>

        {open_change_pass && (
          <ChangePasswordDialog
            handleClose={handleCloseChangePass}
            open={open_change_pass}
          />
        )}

        {loggedin_tutor && open_edit_picture && (
          <EditTutorPicture
            initial_form_values={loggedin_tutor}
            handleClose={handleCloseEditPicture}
            open={open_edit_picture}
          />
        )}

        {loggedin_tutor && open_edit_bio && (
          <EditTutorBiography
            initial_form_values={loggedin_tutor}
            handleClose={handleCloseEditBio}
            open={open_edit_bio}
          />
        )}
      </StyledDashboardTutor>
    </>
  );
});

export default DashboardTutorView;
