import FullCalendar from "@fullcalendar/react";
import resourceTimeGridPlugin from "@fullcalendar/resource-timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import "@fullcalendar/timegrid/main.css";
import "@fullcalendar/daygrid/main.css";
import "../../../Component/Calendar/calendar.css";
import {
  Avatar,
  Button,
  Chip,
  CircularProgress,
  Grid,
  Table,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  useMediaQuery,
  useTheme,
} from "@material-ui/core";
import React, { memo, FC, useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import CustomAvatar from "../../../Component/CustomAvatar";
import { setPageLinks } from "../../../Services/Actions/PageActions";
import { StyledDashboardStudent } from "./styles";
import { StyledDashboardItem } from "../../../Styles/GlobalStyles";
import { Rating } from "@material-ui/lab";
import LocalLibraryRoundedIcon from "@material-ui/icons/LocalLibraryRounded";
import ChangePasswordDialog from "../../SharedViews/ChangePasswordDialog";
import EditTutorBiography, { EditStudentInfo } from "./EditStudentInfo";
import EditTutorPicture from "./EditStudentPicture";
import TutorActions from "../../../Services/Actions/TutorActions";
import { RootStore } from "../../../Services/Store";
import { StringEmptyToDefault } from "../../../Hooks/UseStringFormatter";
import ClassActions from "../../../Services/Actions/ClassActions";
import ClassSessionActions from "../../../Services/Actions/ClassSessionActions";
import LinearLoadingProgress from "../../../Component/LinearLoadingProgress";
import StudentActions from "../../../Services/Actions/StudentActions";
import { Bar, Pie } from "react-chartjs-2";
import "chartjs-plugin-labels";
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

  const [open_edit_student_info, set_open_edit_student_info] = useState(false);

  const handleOpenEditStudentInfo = useCallback(() => {
    set_open_edit_student_info(true);
  }, []);

  const handleCloseEditStudentInfo = useCallback(() => {
    set_open_edit_student_info(false);
  }, []);

  const logged_student_info = useSelector(
    (store: RootStore) => store.StudentReducer.logged_student_info
  );
  const fetch_logged_student_info = useSelector(
    (store: RootStore) => store.StudentReducer.fetch_logged_student_info
  );

  const total_student_class_stats = useSelector(
    (store: RootStore) => store.ClassReducer.total_student_class_stats
  );
  const fetch_total_student_class_stats = useSelector(
    (store: RootStore) => store.ClassReducer.fetch_total_student_class_stats
  );

  const logged_student_calendar = useSelector(
    (store: RootStore) => store.ClassSessionReducer.logged_student_calendar
  );

  const fetch_logged_student_calendar = useSelector(
    (store: RootStore) =>
      store.ClassSessionReducer.fetch_logged_student_calendar
  );

  useEffect(() => {
    dispatch(StudentActions.getLoggedStudentInfo());
  }, [dispatch]);

  useEffect(() => {
    dispatch(ClassActions.getTotalStudentClassStats());
  }, [dispatch]);

  useEffect(() => {
    dispatch(ClassSessionActions.getLoggedStudentCalendar());
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
    return () => (mounted = false);
  }, [dispatch]);
  return (
    <>
      <StyledDashboardStudent theme={theme}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={8}>
            <Grid container spacing={4}>
              {fetch_logged_student_info && !logged_student_info ? (
                <CircularProgress />
              ) : (
                <Grid item xs={12}>
                  <Grid
                    container
                    style={{
                      backgroundColor: `#fff`,
                      borderRadius: 10,
                      padding: `1em`,
                    }}
                  >
                    <Grid item xs={12} md={3}>
                      <div className="prof-pic">
                        <CustomAvatar
                          heightSpacing={15}
                          widthSpacing={15}
                          src={logged_student_info?.picture}
                          errorMessage={`${logged_student_info?.firstname?.charAt(
                            0
                          )} ${logged_student_info?.lastname?.charAt(0)}`}
                        />
                        <div
                          style={{
                            display: `grid`,
                            gridGap: `.5em`,
                            marginTop: `1em`,
                            alignContent: `center`,
                            alignItems: `center`,
                            justifyContent: `center`,
                            justifyItems: `center`,
                            borderTop: `.01em solid rgba(0,0,0,.1)`,
                            height: `100%`,
                          }}
                        >
                          <Button
                            color="primary"
                            onClick={() => {
                              handleOpenEditStudentInfo();
                            }}
                          >
                            Edit Basic Info
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
                      </div>
                    </Grid>

                    <Grid item xs={12} md={9}>
                      <div className="profile-container">
                        <div className="greeting">
                          Greetings, {logged_student_info?.firstname}{" "}
                          {logged_student_info?.lastname}{" "}
                          {logged_student_info?.suffix}
                        </div>

                        <div className="bio">
                          Grade {logged_student_info?.grade}
                        </div>

                        <div className="info-group-container">
                          <div className="info-group">
                            <div className="label">Gender</div>
                            <div className="value">
                              {logged_student_info?.gender === "m"
                                ? "Male"
                                : "Female"}
                            </div>
                          </div>
                          <div className="info-group">
                            <div className="label">Email Address</div>
                            <div className="value">
                              {logged_student_info?.email}
                            </div>
                          </div>
                          <div className="info-group">
                            <div className="label">Mobile Number</div>
                            <div className="value">
                              {logged_student_info?.mob_no}
                            </div>
                          </div>
                        </div>
                      </div>
                    </Grid>
                  </Grid>
                </Grid>
              )}

              {fetch_total_student_class_stats && !total_student_class_stats ? (
                <Grid item xs={12}>
                  <CircularProgress />
                </Grid>
              ) : (
                <>
                  <Grid item xs={12}>
                    <Grid container spacing={4}>
                      {total_student_class_stats?.map((s, i) => (
                        <Grid item xs={12} md={4} key={i}>
                          <StyledDashboardItem>
                            <div className="label" style={{ color: `#333` }}>
                              {s.label}
                            </div>
                            <div className="stat-value">
                              {fetch_total_student_class_stats ? (
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
                    </Grid>
                  </Grid>

                  <Grid item xs={12}>
                    <div
                      style={{
                        backgroundColor: `#fff`,
                        borderRadius: 10,
                        padding: `1em`,
                      }}
                    >
                      <Pie
                        type="pie"
                        height={70}
                        data={{
                          labels: total_student_class_stats?.map(
                            ({ label }) => label
                          ),
                          datasets: [
                            {
                              labels: total_student_class_stats?.map(
                                ({ label }) => label
                              ),
                              data: total_student_class_stats?.map(
                                ({ value }) => value
                              ),
                              backgroundColor: total_student_class_stats?.map(
                                ({ backgroundColor }) => backgroundColor
                              ),
                              borderColor: "#fff",
                            },
                          ],
                        }}
                        options={{
                          responsiveAnimationDuration: 1,
                          tooltips: {
                            enabled: false,
                          },
                          plugins: {
                            labels: {
                              render: "percentage",
                              precision: 0,
                              showZero: true,
                              fontSize: 12,
                              fontColor: "#fff",
                            },
                          },
                        }}
                      />
                    </div>
                  </Grid>
                </>
              )}
            </Grid>
          </Grid>

          <Grid item xs={12} md={4}>
            <div className="recommendation-cntr">
              <div className="container-title">Classes you may like</div>

              <div className="body">
                <div className="rec-class-item">
                  <div className="class">
                    <CustomAvatar
                      heightSpacing={4}
                      widthSpacing={4}
                      src=""
                      errorMessage="C"
                    />
                    <div className="title">Math 501</div>
                  </div>

                  <div className="class-sub">
                    <Chip className="status" label="Approved" />

                    <div className="rating">
                      <Tooltip title="4 stars">
                        <Rating
                          size="small"
                          readOnly
                          name="rating"
                          value={4}
                          precision={0.1}
                        />
                      </Tooltip>
                    </div>
                  </div>

                  <div className="tutor">
                    <CustomAvatar
                      src=""
                      heightSpacing={4}
                      widthSpacing={4}
                      errorMessage="JD"
                    />
                    <div className="name">John Doe</div>
                  </div>
                  <div className="info-group">
                    <div className="label">Date</div>
                    <div className="value">July 28, 1998</div>
                  </div>
                  <div className="info-group">
                    <div className="label">Time Interval</div>
                    <div className="value">09:00 am - 11:00 am</div>
                  </div>
                </div>

                <div className="rec-class-item">
                  <div className="class">
                    <CustomAvatar
                      heightSpacing={4}
                      widthSpacing={4}
                      src=""
                      errorMessage="C"
                    />
                    <div className="title">Math 501</div>
                  </div>

                  <div className="class-sub">
                    <Chip className="status" label="Approved" />

                    <div className="rating">
                      <Tooltip title="4 stars">
                        <Rating
                          size="small"
                          readOnly
                          name="rating"
                          value={4}
                          precision={0.1}
                        />
                      </Tooltip>
                    </div>
                  </div>

                  <div className="tutor">
                    <CustomAvatar
                      src=""
                      heightSpacing={4}
                      widthSpacing={4}
                      errorMessage="JD"
                    />
                    <div className="name">John Doe</div>
                  </div>
                  <div className="info-group">
                    <div className="label">Date</div>
                    <div className="value">July 28, 1998</div>
                  </div>
                  <div className="info-group">
                    <div className="label">Time Interval</div>
                    <div className="value">09:00 am - 11:00 am</div>
                  </div>
                </div>

                <div className="rec-class-item">
                  <div className="class">
                    <CustomAvatar
                      heightSpacing={4}
                      widthSpacing={4}
                      src=""
                      errorMessage="C"
                    />
                    <div className="title">Math 501</div>
                  </div>

                  <div className="class-sub">
                    <Chip className="status" label="Approved" />

                    <div className="rating">
                      <Tooltip title="4 stars">
                        <Rating
                          size="small"
                          readOnly
                          name="rating"
                          value={4}
                          precision={0.1}
                        />
                      </Tooltip>
                    </div>
                  </div>

                  <div className="tutor">
                    <CustomAvatar
                      src=""
                      heightSpacing={4}
                      widthSpacing={4}
                      errorMessage="JD"
                    />
                    <div className="name">John Doe</div>
                  </div>
                  <div className="info-group">
                    <div className="label">Date</div>
                    <div className="value">July 28, 1998</div>
                  </div>
                  <div className="info-group">
                    <div className="label">Time Interval</div>
                    <div className="value">09:00 am - 11:00 am</div>
                  </div>
                </div>

                <div className="rec-class-item">
                  <div className="class">
                    <CustomAvatar
                      heightSpacing={4}
                      widthSpacing={4}
                      src=""
                      errorMessage="C"
                    />
                    <div className="title">Math 501</div>
                  </div>

                  <div className="class-sub">
                    <Chip className="status" label="Approved" />

                    <div className="rating">
                      <Tooltip title="4 stars">
                        <Rating
                          size="small"
                          readOnly
                          name="rating"
                          value={4}
                          precision={0.1}
                        />
                      </Tooltip>
                    </div>
                  </div>

                  <div className="tutor">
                    <CustomAvatar
                      src=""
                      heightSpacing={4}
                      widthSpacing={4}
                      errorMessage="JD"
                    />
                    <div className="name">John Doe</div>
                  </div>
                  <div className="info-group">
                    <div className="label">Date</div>
                    <div className="value">July 28, 1998</div>
                  </div>
                  <div className="info-group">
                    <div className="label">Time Interval</div>
                    <div className="value">09:00 am - 11:00 am</div>
                  </div>
                </div>

                <div className="rec-class-item">
                  <div className="class">
                    <CustomAvatar
                      heightSpacing={4}
                      widthSpacing={4}
                      src=""
                      errorMessage="C"
                    />
                    <div className="title">Math 501</div>
                  </div>

                  <div className="class-sub">
                    <Chip className="status" label="Approved" />

                    <div className="rating">
                      <Tooltip title="4 stars">
                        <Rating
                          size="small"
                          readOnly
                          name="rating"
                          value={4}
                          precision={0.1}
                        />
                      </Tooltip>
                    </div>
                  </div>

                  <div className="tutor">
                    <CustomAvatar
                      src=""
                      heightSpacing={4}
                      widthSpacing={4}
                      errorMessage="JD"
                    />
                    <div className="name">John Doe</div>
                  </div>
                  <div className="info-group">
                    <div className="label">Date</div>
                    <div className="value">July 28, 1998</div>
                  </div>
                  <div className="info-group">
                    <div className="label">Time Interval</div>
                    <div className="value">09:00 am - 11:00 am</div>
                  </div>
                </div>

                <div className="rec-class-item">
                  <div className="class">
                    <CustomAvatar
                      heightSpacing={4}
                      widthSpacing={4}
                      src=""
                      errorMessage="C"
                    />
                    <div className="title">Math 501</div>
                  </div>

                  <div className="class-sub">
                    <Chip className="status" label="Approved" />

                    <div className="rating">
                      <Tooltip title="4 stars">
                        <Rating
                          size="small"
                          readOnly
                          name="rating"
                          value={4}
                          precision={0.1}
                        />
                      </Tooltip>
                    </div>
                  </div>

                  <div className="tutor">
                    <CustomAvatar
                      src=""
                      heightSpacing={4}
                      widthSpacing={4}
                      errorMessage="JD"
                    />
                    <div className="name">John Doe</div>
                  </div>
                  <div className="info-group">
                    <div className="label">Date</div>
                    <div className="value">July 28, 1998</div>
                  </div>
                  <div className="info-group">
                    <div className="label">Time Interval</div>
                    <div className="value">09:00 am - 11:00 am</div>
                  </div>
                </div>
              </div>
            </div>
          </Grid>

          <Grid item xs={12}>
            <div className="schedule-container">
              <div className="container-title">Schedule</div>
              <LinearLoadingProgress show={fetch_logged_student_calendar} />

              {logged_student_calendar && (
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
                  events={logged_student_calendar}
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

        {logged_student_info && open_edit_picture && (
          <EditTutorPicture
            initial_form_values={logged_student_info}
            handleClose={handleCloseEditPicture}
            open={open_edit_picture}
          />
        )}

        {logged_student_info && open_edit_student_info && (
          <EditStudentInfo
            initial_form_values={logged_student_info}
            handleClose={handleCloseEditStudentInfo}
            open={open_edit_student_info}
          />
        )}
      </StyledDashboardStudent>
    </>
  );
});

export default DashboardTutorView;
