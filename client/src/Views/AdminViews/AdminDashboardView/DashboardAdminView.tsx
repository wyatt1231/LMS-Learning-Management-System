import {
  Avatar,
  Container,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
} from "@material-ui/core";
import ClassRoundedIcon from "@material-ui/icons/ClassRounded";
import LocalLibraryRoundedIcon from "@material-ui/icons/LocalLibraryRounded";
import MeetingRoomRoundedIcon from "@material-ui/icons/MeetingRoomRounded";
import MenuBookRoundedIcon from "@material-ui/icons/MenuBookRounded";
import SupervisedUserCircleRoundedIcon from "@material-ui/icons/SupervisedUserCircleRounded";
import WcRoundedIcon from "@material-ui/icons/WcRounded";
import React, { FC, memo, useEffect } from "react";
import { useDispatch } from "react-redux";
import { NavLink } from "react-router-dom";
import { Bar, Doughnut, Line, Pie } from "react-chartjs-2";
import LinearGraph from "../../../Component/LinearGraph";
import { setPageLinks } from "../../../Services/Actions/PageActions";
import { StyledDashboardItem } from "../../../Styles/GlobalStyles";
import "chartjs-plugin-labels";
import CustomAvatar from "../../../Component/CustomAvatar";
import StarRateRoundedIcon from "@material-ui/icons/StarRateRounded";

interface IDashboardAdminView {}

export const DashboardAdminView: FC<IDashboardAdminView> = memo(() => {
  const dispatch = useDispatch();
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
    return () => (mounted = false);
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
                  <div className="stat-value">235</div>
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
                  <NavLink to="/admin/tutors" className="label">
                    Total Tutors
                  </NavLink>
                  <div className="stat-value">17</div>
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
                  <NavLink to="/admin/tutors" className="label">
                    Total Administrators
                  </NavLink>
                  <div className="stat-value">5</div>
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
                  <NavLink to="/admin/tutors" className="label">
                    Total Courses
                  </NavLink>
                  <div className="stat-value">5</div>
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
                  <NavLink to="/admin/tutors" className="label">
                    Total Rooms
                  </NavLink>
                  <div className="stat-value">5</div>
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
                  <NavLink to="/admin/tutors" className="label">
                    Total Classes
                  </NavLink>
                  <div className="stat-value">5</div>
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
            }}
          >
            <div className="container-title">Class Statistics</div>

            <Grid container justify="center">
              <Grid item xs={12} style={{ padding: ` 1em` }}>
                <Pie
                  type="pie"
                  height={115}
                  data={{
                    labels: ["closed", "open", "dissolved"],
                    datasets: [
                      {
                        labels: ["closed", "open", "dissolved"],
                        data: [50, 20, 2],
                        backgroundColor: ["#f44336", "#2196f3", "#9e9e9e"],
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
            </Grid>
          </div>
        </Grid>

        <Grid item xs={12} md={8}>
          <div
            style={{
              backgroundColor: `#fff`,
              borderRadius: 7,
            }}
          >
            <div className="container-title">
              Open Classes <small>(10 classes are currently opened)</small>
            </div>

            <TableContainer
              style={{
                padding: `1em`,
                paddingTop: 0,
                height: 260,
                maxHeight: 260,
              }}
            >
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell width="30%">Class Description</TableCell>
                    <TableCell width="40%">Tutor</TableCell>
                    <TableCell width="30%">Session Progress</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell>
                      <NavLink to="/admin/class/12">
                        Math is easy 1 - Math 503
                      </NavLink>{" "}
                    </TableCell>
                    <TableCell>
                      <div className="table-profile">
                        <CustomAvatar src="" errorMessage="JD" />
                        <NavLink to="/admin/tutor/12">Mark Sunner</NavLink>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Tooltip title="3 of 10" arrow>
                        <div>
                          <LinearGraph progress_count={4} total={10} />
                        </div>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        </Grid>

        <Grid item xs={12} lg={4}>
          <div
            style={{
              backgroundColor: `#fff`,
              borderRadius: 7,
            }}
          >
            <div className="container-title">Status of Open Classes</div>

            <Grid container justify="center">
              <Grid item xs={12} style={{ padding: ` 1em` }}>
                <Doughnut
                  height={155}
                  data={{
                    labels: ["pending", "started"],
                    datasets: [
                      {
                        labels: ["pending", "started"],
                        data: [50, 20],
                        backgroundColor: ["#f44336", "#2196f3"],
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
            </Grid>
          </div>
        </Grid>

        <Grid item xs={12} md={8}>
          <div
            style={{
              backgroundColor: `#fff`,
              borderRadius: 7,
            }}
          >
            <div className="container-title">
              Ratings of closed classes this year
            </div>
            <Grid container justify="center" style={{ padding: `1em` }}>
              <Bar
                type="line"
                height={90}
                data={{
                  labels: [
                    "Math 501",
                    "Math 502",
                    "Math 503",
                    "Math 504",
                    "Math 505",
                    "Math 506",

                    "Geometry 501",
                    "Geometry 502",
                    "Geometry 503",
                    "Geometry 504",
                    "Geometry 505",
                    "Geometry 506",
                  ],
                  datasets: [
                    {
                      label: "Classes",
                      yAxesGroup: "1",
                      fill: true,
                      // fillColor: "blue",
                      // strokeColor: "blue",
                      // highlightFill: "blue",
                      // highlightStroke: "blue",
                      // borderColor: "blue",
                      backgroundColor: [
                        "#2196f3",
                        "#f44336",
                        "#2196f3",
                        "#f44336",
                        "#2196f3",
                        "#f44336",
                        "#2196f3",
                        "#f44336",
                        "#2196f3",
                        "#f44336",
                        "#2196f3",
                        "#f44336",
                      ],
                      scales: {
                        yAxes: [
                          {
                            stacked: true,
                          },
                        ],
                      },
                      data: [1.1, 3, 5, 4, 2, 1, 3, 5, 4, 2.2, 3.5, 3],
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
            </Grid>
          </div>
        </Grid>

        <Grid item xs={12} md={4}>
          <div
            style={{
              backgroundColor: `#fff`,
              borderRadius: 7,
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
                height: 315,
                maxHeight: 315,
              }}
            >
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell width="80%">Tutor</TableCell>
                    <TableCell width="20%">Rating</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell>
                      <div className="table-profile">
                        <CustomAvatar src="" errorMessage="JD" />
                        <NavLink to="/admin/tutor/12">Mark Sunner</NavLink>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div
                        style={{
                          display: `grid`,
                          alignItems: `center`,
                          alignContent: `center`,
                          gridAutoFlow: `column`,
                          fontWeight: 700,
                        }}
                      >
                        <span>4.5</span>
                        <StarRateRoundedIcon
                          style={{ color: `yellow`, fontSize: `3em` }}
                        />
                      </div>
                    </TableCell>
                  </TableRow>
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
