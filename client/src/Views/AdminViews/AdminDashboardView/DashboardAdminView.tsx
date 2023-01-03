import {
  Avatar,
  CircularProgress,
  Container,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@material-ui/core";
import ClassRoundedIcon from "@material-ui/icons/ClassRounded";
import LocalLibraryRoundedIcon from "@material-ui/icons/LocalLibraryRounded";
import MeetingRoomRoundedIcon from "@material-ui/icons/MeetingRoomRounded";
import MenuBookRoundedIcon from "@material-ui/icons/MenuBookRounded";
import StarRateRoundedIcon from "@material-ui/icons/StarRateRounded";
import SupervisedUserCircleRoundedIcon from "@material-ui/icons/SupervisedUserCircleRounded";
import WcRoundedIcon from "@material-ui/icons/WcRounded";
import React, { FC, memo, useEffect, useState } from "react";
import { Bar, Pie } from "react-chartjs-2";
import { useDispatch, useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import CustomAvatar from "../../../Component/CustomAvatar";
import LinearGraph from "../../../Component/LinearGraph";
import ClassActions from "../../../Services/Actions/ClassActions";
import { setPageLinks } from "../../../Services/Actions/PageActions";
import AdminApi from "../../../Services/Api/AdminApi";
import ClassApi from "../../../Services/Api/ClassApi";
import CourseApi from "../../../Services/Api/CourseApi";
import RoomApi from "../../../Services/Api/RoomApi";
import StudentApi from "../../../Services/Api/StudentApi";
import TutorApi from "../../../Services/Api/TutorApi";
import { RootStore } from "../../../Services/Store";
import { StyledDashboardItem } from "../../../Styles/GlobalStyles";
import "chartjs-plugin-labels";
import TutorActions from "../../../Services/Actions/TutorActions";
import { Rating } from "@material-ui/lab";
import LinearLoadingProgress from "../../../Component/LinearLoadingProgress";
import UseNumbers from "../../../Hooks/UseNumbers";

interface IDashboardAdminView {}

interface TotalStatsModel {
  total: number;
  link: string;
  label: string;
}

export const DashboardAdminView: FC<IDashboardAdminView> = memo(() => {
  const dispatch = useDispatch();

  const open_class_progress_stats = useSelector(
    (store: RootStore) => store.ClassReducer.open_class_progress_stats
  );

  const class_summary_status = useSelector(
    (store: RootStore) => store.ClassReducer.class_summary_status
  );
  const fetch_class_summary_status = useSelector(
    (store: RootStore) => store.ClassReducer.fetch_class_summary_status
  );

  const most_rated_tutors = useSelector(
    (store: RootStore) => store.TutorReducer.most_rated_tutors
  );

  const fetch_most_rated_tutors = useSelector(
    (store: RootStore) => store.TutorReducer.fetch_most_rated_tutors
  );

  const ended_class_rating_stats = useSelector(
    (store: RootStore) => store.ClassReducer.ended_class_rating_stats
  );
  const fetch_ended_class_rating_stats = useSelector(
    (store: RootStore) => store.ClassReducer.fetch_ended_class_rating_stats
  );

  const [total_students, set_total_students] = useState<Array<number>>([]);
  const [loading_total_stats, set_loading_total_stats] = useState(false);

  useEffect(() => {
    let mounted = true;

    const fetch_data = async () => {
      set_loading_total_stats(true);
      const student_res = await StudentApi.getTotalStudents();
      const tutor_res = await TutorApi.getTotalTutors();
      const admin_res = await AdminApi.getTotalAdmin();
      const course_res = await CourseApi.getTotalCourses();
      const room_res = await RoomApi.getTotalRoom();
      const class_res = await ClassApi.getTotalClasses();
      set_loading_total_stats(false);

      const totals: Array<number> = [];

      if (student_res.success) {
        totals.push(student_res.data);
      }

      if (tutor_res.success) {
        totals.push(tutor_res.data);
      }

      if (admin_res.success) {
        totals.push(admin_res.data);
      }

      if (course_res.success) {
        totals.push(course_res.data);
      }
      if (room_res.success) {
        totals.push(room_res.data);
      }

      if (class_res.success) {
        totals.push(class_res.data);
      }

      set_total_students(totals);
    };

    mounted && fetch_data();
    return () => {
      mounted = false;
    };
  }, [dispatch]);

  useEffect(() => {
    dispatch(ClassActions.getOpenClassProgressStats());
    dispatch(ClassActions.getClassSummaryStats());
    dispatch(ClassActions.getEndedClassRatingStats());
    dispatch(TutorActions.getMostRatedTutors());
  }, [dispatch]);

  useEffect(() => {
    let mounted = true;

    const initializingState = () => {
      dispatch(
        setPageLinks([
          {
            link: "/admin/dashboard",
            title: "Dashboard",
          },
        ])
      );
    };

    mounted && initializingState();
    return () => {
      mounted = false;
    };
  }, [dispatch]);
  return (
    <Container maxWidth="xl">
      <Grid container spacing={4} alignItems="flex-start">
        <Grid item xs={12} lg={8}>
          <div>
            <Grid spacing={3} container justify="center">
              <Grid item xs={12} sm={6} md={4}>
                <StyledDashboardItem>
                  <NavLink to="/admin/student" className="label">
                    Total Students
                  </NavLink>
                  <div className="stat-value">
                    {loading_total_stats ? (
                      <CircularProgress size={20} />
                    ) : (
                      total_students[0]
                    )}
                  </div>
                  <Avatar
                    className="avatar"
                    style={{
                      backgroundColor: "#ffebee",
                      color: "#b71c1c",
                    }}
                  >
                    <WcRoundedIcon />
                  </Avatar>
                </StyledDashboardItem>
              </Grid>

              <Grid item xs={12} sm={6} md={4}>
                <StyledDashboardItem>
                  <NavLink to="/admin/tutor" className="label">
                    Total Tutors
                  </NavLink>
                  <div className="stat-value">
                    {loading_total_stats ? (
                      <CircularProgress size={20} />
                    ) : (
                      total_students[1]
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

              <Grid item xs={12} sm={6} md={4}>
                <StyledDashboardItem>
                  <NavLink to="/admin/co-administrator" className="label">
                    Total Administrators
                  </NavLink>
                  <div className="stat-value">
                    {loading_total_stats ? (
                      <CircularProgress size={20} />
                    ) : (
                      total_students[2]
                    )}
                  </div>
                  <Avatar
                    className="avatar"
                    style={{
                      backgroundColor: "#ffebee",
                      color: "#b71c1c",
                    }}
                  >
                    <SupervisedUserCircleRoundedIcon />
                  </Avatar>
                </StyledDashboardItem>
              </Grid>

              <Grid item xs={12} sm={6} md={4}>
                <StyledDashboardItem>
                  <NavLink to="/admin/course" className="label">
                    Total Courses
                  </NavLink>
                  <div className="stat-value">
                    {loading_total_stats ? (
                      <CircularProgress size={20} />
                    ) : (
                      total_students[3]
                    )}
                  </div>
                  <Avatar
                    className="avatar"
                    style={{
                      backgroundColor: "#ffebee",
                      color: "#b71c1c",
                    }}
                  >
                    <MenuBookRoundedIcon />
                  </Avatar>
                </StyledDashboardItem>
              </Grid>

              <Grid item xs={12} sm={6} md={4}>
                <StyledDashboardItem>
                  <NavLink to="/admin/room" className="label">
                    Total Rooms
                  </NavLink>
                  <div className="stat-value">
                    {loading_total_stats ? (
                      <CircularProgress size={20} />
                    ) : (
                      total_students[4]
                    )}
                  </div>
                  <Avatar
                    className="avatar"
                    style={{
                      backgroundColor: "#ffebee",
                      color: "#b71c1c",
                    }}
                  >
                    <MeetingRoomRoundedIcon />
                  </Avatar>
                </StyledDashboardItem>
              </Grid>

              <Grid item xs={12} sm={6} md={4}>
                <StyledDashboardItem>
                  <NavLink to="/admin/class" className="label">
                    Total Classes
                  </NavLink>
                  <div className="stat-value">
                    {loading_total_stats ? (
                      <CircularProgress size={20} />
                    ) : (
                      total_students[5]
                    )}
                  </div>
                  <Avatar
                    className="avatar"
                    style={{
                      backgroundColor: "#ffebee",
                      color: "#b71c1c",
                    }}
                  >
                    <ClassRoundedIcon />
                  </Avatar>
                </StyledDashboardItem>
              </Grid>
            </Grid>
          </div>
        </Grid>

        <Grid item xs={12} lg={4}>
          <div
            style={{
              backgroundColor: `#fff`,
              borderRadius: 7,
              padding: `1em`,
            }}
          >
            <div className="container-title">Class Statistics</div>

            <Grid container justify="center">
              {fetch_class_summary_status && !class_summary_status ? (
                <Grid
                  item
                  style={{
                    minHeight: 200,
                  }}
                >
                  <CircularProgress size={30} />
                </Grid>
              ) : (
                <Grid item xs={12} style={{ padding: ` 1em` }}>
                  <Pie
                    type="pie"
                    height={115}
                    data={{
                      labels: class_summary_status?.map(({ label }) => label),
                      datasets: [
                        {
                          labels: class_summary_status?.map(
                            ({ label }) => label
                          ),
                          data: class_summary_status?.map(({ value }) => value),
                          backgroundColor: class_summary_status?.map(
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
                </Grid>
              )}
            </Grid>
          </div>
        </Grid>

        <Grid item xs={12} md={8}>
          <Grid container spacing={4}>
            <Grid item xs={12}>
              <div
                style={{
                  backgroundColor: `#fff`,
                  borderRadius: 7,
                  height: `100%`,
                  width: `100%`,
                  padding: `1em`,
                }}
              >
                <div className="container-title">
                  Open Classes{" "}
                  <small>
                    (
                    {UseNumbers.toNumber(
                      open_class_progress_stats?.length,
                      -1
                    ) + 1}{" "}
                    classes are open)
                  </small>
                </div>

                <TableContainer
                  style={{
                    padding: `1em`,
                    paddingTop: 0,
                    height: 260,
                    maxHeight: 260,
                  }}
                >
                  <Table size="small" stickyHeader>
                    <TableHead>
                      <TableRow>
                        <TableCell width="30%">Class Description</TableCell>
                        <TableCell width="40%">Tutor</TableCell>
                        <TableCell width="30%">Session Progress</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {open_class_progress_stats?.map((c, i) => (
                        <TableRow key={i}>
                          <TableCell>
                            <NavLink to={`/admin/class/${c?.class_pk}`}>
                              {c?.class_desc}
                            </NavLink>
                          </TableCell>
                          <TableCell>
                            <div className="table-profile">
                              <CustomAvatar
                                src={c?.tutor_info?.picture}
                                errorMessage={c?.tutor_name?.charAt(0)}
                              />
                              <NavLink to={`/admin/tutor/${c?.tutor_pk}`}>
                                {c?.tutor_info?.firstname}{" "}
                                {c?.tutor_info?.middlename}{" "}
                                {c?.tutor_info?.lastname}
                              </NavLink>
                            </div>
                          </TableCell>
                          <TableCell>
                            <LinearGraph
                              progress_count={c?.ended_session}
                              total={c?.session_count}
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </div>
            </Grid>

            <Grid item xs={12}>
              <div
                style={{
                  backgroundColor: `#fff`,
                  borderRadius: 7,
                  height: `100%`,
                  width: `100%`,
                  padding: `1em`,
                }}
              >
                <div className="container-title">
                  Ratings of closed classes this year
                </div>
                <Grid container justify="center" style={{ padding: `1em` }}>
                  {fetch_ended_class_rating_stats &&
                  !ended_class_rating_stats ? (
                    <CircularProgress />
                  ) : (
                    <Bar
                      type="line"
                      height={90}
                      data={{
                        labels: ended_class_rating_stats?.map(
                          ({ label }) => label
                        ),
                        datasets: [
                          {
                            label: "Classes",
                            yAxesGroup: "1",
                            fill: true,
                            backgroundColor: ended_class_rating_stats?.map(
                              ({ backgroundColor }) => backgroundColor
                            ),
                            scales: {
                              yAxes: [
                                {
                                  stacked: true,
                                },
                              ],
                            },
                            data: ended_class_rating_stats?.map(
                              ({ value }) => value
                            ),
                          },
                        ],
                      }}
                      options={{
                        responsiveAnimationDuration: 1,
                        plugins: {
                          labels: {
                            render: () => {},
                          },
                        },
                        scales: {
                          yAxes: [
                            {
                              scaleLabel: {
                                display: true,
                                labelString: "Ratings",
                                lineHeight: 2,
                                fontColor: `#333`,
                              },
                              // ticks: {
                              //   userCallback: function (label, index, labels) {
                              //     if (Math.floor(label) === label) {
                              //       return label;
                              //     }
                              //   },
                              // },
                            },
                          ],
                        },
                      }}
                    />
                  )}
                </Grid>
              </div>
            </Grid>
          </Grid>
        </Grid>

        <Grid item xs={12} md={4}>
          <div
            style={{
              backgroundColor: `#fff`,
              borderRadius: 7,
              height: 730,
              padding: `1em`,
            }}
          >
            <div className="container-title">
              Most Rated Tutors
              <small> (Top 10)</small>
            </div>

            <TableContainer
              style={{
                padding: `1em`,
                paddingTop: 0,
                height: `93%`,
                maxHeight: `93%`,
              }}
            >
              <LinearLoadingProgress show={fetch_most_rated_tutors} />
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell width="80%">Tutor</TableCell>
                    <TableCell width="20%">Rating</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {most_rated_tutors?.length <= 0 && (
                    <TableRow>
                      <TableCell colSpan={2}>
                        <div className="empty-rows">No tutors to show!</div>
                      </TableCell>
                    </TableRow>
                  )}
                  {most_rated_tutors?.map((t, i) => (
                    <TableRow key={i}>
                      <TableCell>
                        <div className="table-profile">
                          <CustomAvatar
                            heightSpacing={4}
                            widthSpacing={4}
                            src={t?.picture}
                            errorMessage={t?.firstname.charAt(0)}
                          />
                          <NavLink
                            style={{
                              fontSize: `.87em`,
                            }}
                            to={`/admin/tutor/${t.tutor_pk}`}
                          >
                            {t?.position} {t?.firstname} {t?.middlename}{" "}
                            {t?.lastname}{" "}
                          </NavLink>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div
                          style={{
                            display: `grid`,
                            alignItems: `center`,
                            alignContent: `center`,
                            // gridAutoFlow: `column`,
                            fontWeight: 500,
                            justifyItems: `start`,
                            fontSize: `.87em`,
                          }}
                        >
                          <div
                            style={{
                              justifySelf: `end`,
                            }}
                          >
                            {UseNumbers.toDecimal(t?.average_rating, 1, 0)}{" "}
                            stars
                          </div>
                          <Rating
                            name="rating"
                            value={t?.average_rating}
                            precision={0.1}
                            readOnly
                          />
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        </Grid>
      </Grid>
    </Container>
  );
});

export default DashboardAdminView;
