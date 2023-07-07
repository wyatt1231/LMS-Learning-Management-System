import { Chip, Container, Grid, useTheme } from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";
import React, { FC, memo, useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Switch, useParams } from "react-router";
import { Route } from "react-router-dom";
import CustomAvatar from "../../../Component/CustomAvatar";
import IconButtonPopper from "../../../Component/IconButtonPopper/IconButtonPopper";
import LinkTabs from "../../../Component/LinkTabs";
import { InvalidDateTimeToDefault } from "../../../Hooks/UseDateParser";
import {
  setGeneralPrompt,
  setPageLinks,
} from "../../../Services/Actions/PageActions";
import StudentActions, {
  setSelectedStudentAction,
} from "../../../Services/Actions/StudentActions";
import { RootStore } from "../../../Services/Store";
import RatedTutorClassView from "./RatedTutorClassView";
import StudentCalendarView from "./StudentCalendarView";
import StudentEnrollClassView from "./StudentEnrollClassView";
interface ManageStudentAdminProps {}

export const ManageStudentAdminView: FC<ManageStudentAdminProps> = memo(() => {
  const dispatch = useDispatch();
  const params = useParams<any>();
  const theme = useTheme();

  const user_type = useSelector(
    (store: RootStore) => store.UserReducer.user?.user_type
  );

  const selected_student = useSelector(
    (store: RootStore) => store.StudentReducer.selected_student
  );

  const fetching_selected_class = useSelector(
    (store: RootStore) => store.ClassReducer.fetching_selected_class
  );

  const handleApproveStudent = useCallback(() => {
    if (selected_student?.student_pk) {
      dispatch(
        setGeneralPrompt({
          open: true,
          continue_callback: () =>
            dispatch(
              StudentActions.approveStudent(
                selected_student.student_pk,
                (msg: string) => {
                  dispatch(
                    setSelectedStudentAction(
                      selected_student.student_pk.toString()
                    )
                  );
                }
              )
            ),
        })
      );
    }
  }, [dispatch, selected_student]);

  const handleBlockStudent = useCallback(() => {
    if (selected_student?.student_pk) {
      dispatch(
        setGeneralPrompt({
          open: true,
          continue_callback: () =>
            dispatch(
              StudentActions.blockStudent(
                selected_student.student_pk,
                (msg: string) => {
                  dispatch(
                    setSelectedStudentAction(
                      selected_student.student_pk.toString()
                    )
                  );
                }
              )
            ),
        })
      );
    }
  }, [dispatch, selected_student]);

  useEffect(() => {
    if (params.student_pk) {
      dispatch(setSelectedStudentAction(params.student_pk));
    }
  }, [dispatch, params.student_pk]);

  useEffect(() => {
    dispatch(
      setPageLinks([
        {
          link: "/admin/student",
          title: "Students",
        },
        {
          link: window.location.pathname,
          title: "Manage Student",
        },
      ])
    );
  }, [dispatch]);

  let ButtonOptions: any = [];

  if (user_type === "admin") {
    ButtonOptions = [
      {
        text: "Approve",
        color: "primary",
        disabled: selected_student?.sts_pk === "a",
        handleClick: () => {
          handleApproveStudent();
        },
      },
      {
        text: "Block",
        color: "primary",
        handleClick: () => {
          handleBlockStudent();
        },
        disabled: selected_student?.sts_pk === "x",
      },
    ];
  }

  return (
    <>
      <Container maxWidth="xl">
        <Grid container spacing={3}>
          <Grid item xs={12} md={4} lg={3}>
            <div className="manage-container">
              <Grid
                container
                spacing={2}
                alignItems="center"
                alignContent="center"
              >
                <Grid item xs={10}>
                  <div className="container-title">Student Information</div>
                </Grid>
                <Grid item xs={2}>
                  <IconButtonPopper
                    buttonColor="primary"
                    buttons={ButtonOptions}
                  />
                </Grid>
              </Grid>

              {fetching_selected_class && !selected_student ? (
                <Skeleton
                  variant="rect"
                  animation="wave"
                  width={`100%`}
                  height={500}
                />
              ) : (
                <>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <div className="profile">
                        <CustomAvatar
                          style={{
                            height: 200,
                            width: 200,
                          }}
                          variant="circle"
                          src={selected_student?.picture}
                          errorMessage="No image found!"
                        />

                        <div className="title">
                          {selected_student?.firstname}{" "}
                          {selected_student?.middlename}{" "}
                          {selected_student?.lastname}{" "}
                          {selected_student?.suffix}{" "}
                        </div>
                        <div className="sub-title">
                          Grade {selected_student?.grade}
                        </div>
                      </div>
                    </Grid>

                    <Grid item xs={12}>
                      <div className="info-container">
                        <div className="form-group">
                          <div className="label">Status</div>
                          <div className="value">
                            <Chip
                              label={selected_student?.status?.sts_desc}
                              style={{
                                color: selected_student?.status?.sts_color,
                                backgroundColor:
                                  selected_student?.status?.sts_bgcolor,
                              }}
                            />
                          </div>
                        </div>

                        <div className="form-group">
                          <div className="label">Email Address</div>
                          <div className="value">{selected_student?.email}</div>
                        </div>

                        <div className="form-group">
                          <div className="label">Gender</div>
                          <div className="value">
                            {selected_student?.gender === "m"
                              ? "Male"
                              : "Female"}
                          </div>
                        </div>

                        <div className="form-group">
                          <div className="label">Mobile Number</div>
                          <div className="value">
                            {selected_student?.mob_no}
                          </div>
                        </div>

                        <div className="form-group">
                          <div className="label">Home Address</div>
                          <div className="value">
                            {selected_student?.complete_address}
                          </div>
                        </div>

                        <div className="form-group">
                          <div className="label">Registered At</div>
                          <div className="value">
                            {InvalidDateTimeToDefault(
                              selected_student?.encoded_at,
                              "-"
                            )}
                          </div>
                        </div>
                      </div>
                    </Grid>
                  </Grid>
                </>
              )}
            </div>
          </Grid>

          <Grid item xs={12} md={8} lg={9}>
            <div className="manage-container ">
              <LinkTabs
                tabs={[
                  {
                    label: "Calendar",
                    link: `/${user_type}/student/${params.student_pk}/calendar`,
                  },
                  {
                    label: "Enrolled Classes",
                    link: `/${user_type}/student/${params.student_pk}/enrolled-classes`,
                  },
                  {
                    label: "Rated Tutors",
                    link: `/${user_type}/student/${params.student_pk}/rated-tutors`,
                  },
                ]}
                RenderSwitchComponent={
                  <Switch>
                    <Route
                      path={`/${user_type}/student/${params.student_pk}/calendar`}
                      exact
                    >
                      <StudentCalendarView student_pk={params.student_pk} />
                    </Route>
                    <Route
                      path={`/${user_type}/student/${params.student_pk}/enrolled-classes`}
                      exact
                    >
                      <StudentEnrollClassView student_pk={params.student_pk} />
                    </Route>
                    <Route
                      path={`/${user_type}/student/${params.student_pk}/rated-tutors`}
                      exact
                    >
                      <RatedTutorClassView student_pk={params.student_pk} />
                    </Route>
                  </Switch>
                }
              />
            </div>
          </Grid>
        </Grid>
      </Container>
    </>
  );
});

export default ManageStudentAdminView;
