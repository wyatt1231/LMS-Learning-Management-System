import { Container, Grid } from "@material-ui/core";
import React, { FC, memo, useEffect } from "react";
import { useDispatch } from "react-redux";
import { NavLink } from "react-router-dom";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Label,
  LabelList,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { setPageLinks } from "../../../Services/Actions/PageActions";
import {
  StyledBox,
  StyledDashboardItem,
  StyledOpenClasses,
} from "../../../Styles/GlobalStyles";

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
    <Container maxWidth="lg">
      <StyledBox style={{ marginBottom: `2.5em` }}>
        <div className="box-body">
          <Grid container spacing={2} justify="space-evenly">
            <Grid item>
              <StyledDashboardItem>
                <div className="value">10</div>
                <NavLink to="/admin/student" className="label">
                  Students
                </NavLink>
              </StyledDashboardItem>
            </Grid>
            <Grid item>
              <StyledDashboardItem>
                <div className="value">10</div>
                <NavLink to="/admin/student" className="label">
                  Tutors
                </NavLink>
              </StyledDashboardItem>
            </Grid>
            <Grid item>
              <StyledDashboardItem>
                <div className="value">10</div>
                <NavLink to="/admin/student" className="label">
                  Administrators
                </NavLink>
              </StyledDashboardItem>
            </Grid>
            <Grid item>
              <StyledDashboardItem>
                <div className="value">10</div>
                <NavLink to="/admin/student" className="label">
                  Courses
                </NavLink>
              </StyledDashboardItem>
            </Grid>
            <Grid item>
              <StyledDashboardItem>
                <div className="value">10</div>
                <NavLink to="/admin/student" className="label">
                  Rooms
                </NavLink>
              </StyledDashboardItem>
            </Grid>
          </Grid>
        </div>
      </StyledBox>

      <Grid container spacing={3} alignContent="flex-start">
        <Grid
          item
          xs={12}
          md={3}
          alignContent="flex-start"
          spacing={2}
          container
        >
          <Grid item xs={12}>
            <div
              style={{
                fontSize: `.87em`,
                fontWeight: 900,
                letterSpacing: `.3pt`,
                wordSpacing: `.3pt`,
                opacity: 0.67,
              }}
            >
              Open Classes - 3
            </div>
          </Grid>
          <div
            style={{
              height: `auto`,
              maxHeight: 800,
              overflow: `hidden`,
              overflowY: `auto`,
              padding: `.5em`,
            }}
          >
            <Grid item container spacing={2}>
              <Grid
                container
                alignItems="flex-start"
                alignContent="flex-start"
                justify="center"
                spacing={1}
              >
                <Grid item>
                  <StyledOpenClasses>
                    <div className="class-item">
                      <div className="label">Class Title</div>
                      <NavLink to="/admin/class/someid" className="value">
                        Fun learning Math w/ Grade 12
                      </NavLink>
                    </div>
                    <div className="class-item">
                      <div className="label">No. of Students</div>
                      <div className="value">10</div>
                    </div>
                    <div className="class-item">
                      <div className="label">No. of Sessions</div>
                      <div className="value">3 of 5</div>
                    </div>
                  </StyledOpenClasses>
                </Grid>
                <Grid item>
                  <StyledOpenClasses>
                    <div className="class-item">
                      <div className="label">Class Title</div>
                      <NavLink to="/admin/class/someid" className="value">
                        Fun learning Math w/ Grade 12
                      </NavLink>
                    </div>
                    <div className="class-item">
                      <div className="label">No. of Students</div>
                      <div className="value">10</div>
                    </div>
                    <div className="class-item">
                      <div className="label">No. of Sessions</div>
                      <div className="value">3 of 5</div>
                    </div>
                  </StyledOpenClasses>
                </Grid>
                <Grid item>
                  <StyledOpenClasses>
                    <div className="class-item">
                      <div className="label">Class Title</div>
                      <NavLink to="/admin/class/someid" className="value">
                        Fun learning Math w/ Grade 12
                      </NavLink>
                    </div>
                    <div className="class-item">
                      <div className="label">No. of Students</div>
                      <div className="value">10</div>
                    </div>
                    <div className="class-item">
                      <div className="label">No. of Sessions</div>
                      <div className="value">3 of 5</div>
                    </div>
                  </StyledOpenClasses>
                </Grid>
                <Grid item>
                  <StyledOpenClasses>
                    <div className="class-item">
                      <div className="label">Class Title</div>
                      <NavLink to="/admin/class/someid" className="value">
                        Fun learning Math w/ Grade 12
                      </NavLink>
                    </div>
                    <div className="class-item">
                      <div className="label">No. of Students</div>
                      <div className="value">10</div>
                    </div>
                    <div className="class-item">
                      <div className="label">No. of Sessions</div>
                      <div className="value">3 of 5</div>
                    </div>
                  </StyledOpenClasses>
                </Grid>
                <Grid item>
                  <StyledOpenClasses>
                    <div className="class-item">
                      <div className="label">Class Title</div>
                      <NavLink to="/admin/class/someid" className="value">
                        Fun learning Math w/ Grade 12
                      </NavLink>
                    </div>
                    <div className="class-item">
                      <div className="label">No. of Students</div>
                      <div className="value">10</div>
                    </div>
                    <div className="class-item">
                      <div className="label">No. of Sessions</div>
                      <div className="value">3 of 5</div>
                    </div>
                  </StyledOpenClasses>
                </Grid>
                <Grid item>
                  <StyledOpenClasses>
                    <div className="class-item">
                      <div className="label">Class Title</div>
                      <NavLink to="/admin/class/someid" className="value">
                        Fun learning Math w/ Grade 12
                      </NavLink>
                    </div>
                    <div className="class-item">
                      <div className="label">No. of Students</div>
                      <div className="value">10</div>
                    </div>
                    <div className="class-item">
                      <div className="label">No. of Sessions</div>
                      <div className="value">3 of 5</div>
                    </div>
                  </StyledOpenClasses>
                </Grid>
              </Grid>
            </Grid>
          </div>
        </Grid>
        <Grid item xs={12} md={9} alignContent="flex-start">
          <Grid item xs={12}>
            <div
              style={{
                fontSize: `.87em`,
                fontWeight: 900,
                letterSpacing: `.3pt`,
                wordSpacing: `.3pt`,
                opacity: 0.67,
              }}
            >
              Closed Classes This Year - 19
            </div>
          </Grid>

          <Grid item xs={12} container justify="center">
            <div
              style={{
                height: 800,
                width: `100%`,
                overflow: `auto`,
              }}
            >
              <ResponsiveContainer minWidth={500}>
                <BarChart
                  margin={{ top: 50, right: 50, left: 50, bottom: 50 }}
                  barGap={20}
                  data={[
                    {
                      name: "Math Quiz Bee training",
                      uv: 3.3,
                    },
                    {
                      name: "MDAS Mock up class",
                      uv: 5,
                    },
                    {
                      name: "Special Geometry 311 Tutorial",
                      uv: 4,
                    },
                    {
                      name: "Special Algebra 501 Tutorial",
                      uv: 4.2,
                    },
                    {
                      name: "Math competition training",
                      uv: 4,
                    },
                    {
                      name: "Math Quiz Bee training",
                      uv: 3.3,
                    },
                    {
                      name: "MDAS Mock up class",
                      uv: 5,
                    },
                    {
                      name: "Face to face tutorial w/ grade 10",
                      uv: 3.3,
                    },
                    {
                      name: "Special Math 501 Tutorial",
                      uv: 2.1,
                    },
                    {
                      name: "Special Geometry 311 Tutorial",
                      uv: 4,
                    },
                    {
                      name: "Special Algebra 501 Tutorial",
                      uv: 4.2,
                    },
                    {
                      name: "Math competition training",
                      uv: 4,
                    },
                    {
                      name: "Math Quiz Bee training",
                      uv: 3.3,
                    },
                    {
                      name: "MDAS Mock up class",
                      uv: 5,
                    },
                    {
                      name: "Face to face tutorial w/ grade 10",
                      uv: 3.3,
                    },
                    {
                      name: "Special Math 501 Tutorial",
                      uv: 2.1,
                    },
                    {
                      name: "Special Geometry 311 Tutorial",
                      uv: 4,
                    },
                    {
                      name: "Special Algebra 501 Tutorial",
                      uv: 4.2,
                    },
                    {
                      name: "MDAS Mock up class",
                      uv: 5,
                    },
                  ]}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    height={200}
                    dataKey="name"
                    type="category"
                    angle={-45}
                    interval={0}
                    textAnchor="end"
                    style={{
                      fontSize: `.8em`,
                      color: `black`,
                      fontWeight: 900,
                      letterSpacing: `.3pt`,
                      wordSpacing: `.3pt`,
                    }}
                  >
                    <Label
                      style={{
                        padding: `1em`,
                        fontWeight: 900,
                        fontSize: `.87em`,
                      }}
                      value="Closed Tutorial Classes"
                      offset={0}
                      position="insideBottom"
                    />
                  </XAxis>

                  <YAxis
                    dataKey="uv"
                    domain={[1, 5]}
                    ticks={[1, 2, 3, 4, 5]}
                    label={{
                      value: "Ratings (1-5)",
                      angle: -90,
                      position: "insideLeft",
                      textAnchor: "middle",
                    }}
                  />
                  <Tooltip />
                  <Bar dataKey="uv" fill="#64b5f6">
                    <LabelList dataKey="uv" data={null} />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Grid>
        </Grid>
      </Grid>
    </Container>
  );
});

export default DashboardAdminView;
