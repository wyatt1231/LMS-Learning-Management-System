import {
  Avatar,
  Chip,
  CircularProgress,
  Grid,
  useTheme,
} from "@material-ui/core";
import { Rating, Skeleton } from "@material-ui/lab";
import React, { FC, memo, useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Switch, useParams } from "react-router";
import { Route } from "react-router-dom";
import CircularLoadingProgress from "../../../Component/CircularLoadingProgress";
import CustomAvatar from "../../../Component/CustomAvatar";
import IconButtonPopper from "../../../Component/IconButtonPopper/IconButtonPopper";
import LinkTabs, { ITab } from "../../../Component/LinkTabs";
import {
  InvalidDateToDefault,
  InvalidTimeToDefault,
} from "../../../Hooks/UseDateParser";
import UseNumbers from "../../../Hooks/UseNumbers";
import { StringEmptyToDefault } from "../../../Hooks/UseStringFormatter";
import ClassActions, {
  setSelectedClassAction,
} from "../../../Services/Actions/ClassActions";
import ClassStudentActions from "../../../Services/Actions/ClassStudentActions";
import {
  setGeneralPrompt,
  setPageLinks,
} from "../../../Services/Actions/PageActions";
import TutorActions from "../../../Services/Actions/TutorActions";
import { ClassRatingModel } from "../../../Services/Models/ClassRatingModel";
import { ClassStudentModel } from "../../../Services/Models/ClassStudentModel";
import { RootStore } from "../../../Services/Store";
import { StyledManageClassAdmin } from "../../AdminViews/AdminClassView/styles";
import ClassMaterialView from "./ClassMaterialView";
import ClassRatingView from "./ClassRatingView";
import ClassSessionView from "./ClassSessionView";
import ClassStudentView from "./ClassStudentView";
import ClassTaskView from "./ClassTaskView";
import EditClassAdminDialog from "./EditClassAdminDialog";
import EditClassStatusDialog from "./EditClassStatusDialog";
import RateClassDialog from "./RateClassDialog";
import no_book from "../../../Assets/Images/Icons/no_book.png";
interface IManageClassView {}

export const ManageClassView: FC<IManageClassView> = memo(() => {
  const dispatch = useDispatch();
  const params = useParams<any>();
  const theme = useTheme();

  const user_type = useSelector(
    (store: RootStore) => store.UserReducer.user?.user_type
  );

  const user_id = useSelector(
    (store: RootStore) => store.UserReducer.user.user_id
  );

  const set_notif = useSelector(
    (store: RootStore) => store.SocketReducer.set_notif
  );

  const selected_class = useSelector(
    (store: RootStore) => store.ClassReducer.selected_class
  );

  const fetching_selected_class = useSelector(
    (store: RootStore) => store.ClassReducer.fetching_selected_class
  );

  const [open_edit_class, set_open_edit_class] = useState(false);

  const handleOpenEditClass = useCallback(() => {
    set_open_edit_class(true);
  }, []);

  const handleCloseEditClass = useCallback(() => {
    set_open_edit_class(false);
  }, []);

  const [new_status, set_new_status] = useState<null | "a" | "d" | "e">(null);
  const [open_edit_class_status, set_open_edit_class_status] = useState(false);

  const handleOpenEditClassStatus = useCallback(() => {
    set_open_edit_class_status(true);
  }, []);

  const handleCloseEditClassStatus = useCallback(() => {
    set_open_edit_class_status(false);
  }, []);

  const [open_rating, set_open_rating] = useState(false);

  const handleOpenRating = useCallback(() => {
    set_open_rating(true);
  }, []);

  const handleCloseRating = useCallback(() => {
    set_open_rating(false);
  }, []);

  useEffect(() => {
    if (params.class_pk) {
      dispatch(setSelectedClassAction(params.class_pk));
    }
  }, [dispatch, params.class_pk]);

  useEffect(() => {
    dispatch(
      setPageLinks([
        {
          link: "/admin/class",
          title: "Class",
        },
        {
          link: window.location.pathname,
          title: "Manage Class",
        },
      ])
    );
  }, [dispatch]);

  let ButtonOptions: any = [];

  if (user_type === "admin") {
    ButtonOptions = [
      {
        text: "Edit Class Info",
        color: "primary",
        handleClick: handleOpenEditClass,
      },
      {
        text: "Cancel this Class",
        color: "primary",
        disabled: selected_class?.sts_pk !== "fa",
      },
    ];
  }

  if (user_type === "tutor") {
    if (selected_class?.sts_pk === "fa") {
      ButtonOptions.push({
        text: "Accept this class",
        color: "primary",
        handleClick: () => {
          set_new_status("a");
          handleOpenEditClassStatus();
        },
      });
      ButtonOptions.push({
        text: "Decline this class",
        color: "primary",
        handleClick: () => {
          set_new_status("d");
          handleOpenEditClassStatus();
        },
      });
    }

    if (selected_class?.sts_pk === "a") {
      ButtonOptions.push({
        text: "End this class",
        color: "primary",
        handleClick: () => {
          handleOpenEditClassStatus();
        },
      });
    }
  }

  if (user_type === "student") {
    ButtonOptions.push({
      text: "Join/Enroll Class",
      color: "primary",
      handleClick: () => {
        const payload: ClassStudentModel = {
          class_pk: selected_class.class_pk,
        };
        dispatch(
          setGeneralPrompt({
            open: true,
            continue_callback: () =>
              dispatch(
                ClassStudentActions.joinStudentToClassAction(
                  payload,
                  (msg: string) => {
                    dispatch(
                      setSelectedClassAction(
                        selected_class.class_pk,
                        selected_class.tutor_info.user_id,
                        set_notif
                      )
                    );
                  }
                )
              ),
          })
        );
      },
    });
  }

  let Tabs: Array<ITab> = [];

  if (user_type === "admin" || user_type === "student") {
    const t = [
      {
        label: "Sessions",
        link: `/${user_type}/class/${params.class_pk}/session`,
      },
      {
        label: "Students",
        link: `/${user_type}/class/${params.class_pk}/student`,
      },
      {
        label: "Materials",
        link: `/${user_type}/class/${params.class_pk}/material`,
      },
      {
        label: "Tasks",
        link: `/${user_type}/class/${params.class_pk}/task`,
      },
      {
        label: "Ratings",
        link: `/${user_type}/class/${params.class_pk}/rating`,
      },
    ];
    Tabs = t;
  } else if (user_type === "tutor") {
    Tabs.push({
      label: "Sessions",
      link: `/${user_type}/class/${params.class_pk}/session`,
    });

    if (
      selected_class?.sts_pk === "a" ||
      selected_class?.sts_pk === "s" ||
      selected_class?.sts_pk === "e"
    ) {
      Tabs.push({
        label: "Students",
        link: `/${user_type}/class/${params.class_pk}/student`,
      });
      Tabs.push({
        label: "Materials",
        link: `/${user_type}/class/${params.class_pk}/material`,
      });
      Tabs.push({
        label: "Tasks",
        link: `/${user_type}/class/${params.class_pk}/task`,
      });
    }
  }

  return (
    <>
      <StyledManageClassAdmin theme={theme} maxWidth="xl">
        <Grid container spacing={3}>
          <Grid item xs={12} md={4} lg={3}>
            <div className="container-body ">
              <Grid
                container
                spacing={2}
                alignItems="center"
                alignContent="center"
              >
                <Grid item xs={10}>
                  <div className="container-title">Class Information</div>
                </Grid>
                <Grid item xs={2}>
                  <IconButtonPopper
                    buttonColor="primary"
                    buttons={ButtonOptions}
                  />
                </Grid>
              </Grid>

              {fetching_selected_class && !selected_class ? (
                <Skeleton
                  variant="rect"
                  animation="wave"
                  width={`100%`}
                  height={250}
                />
              ) : (
                <>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <div className="class-profile">
                        {!!selected_class?.pic ? (
                          <CustomAvatar
                            style={{
                              height: 200,
                              width: `90%`,
                            }}
                            variant="square"
                            src={selected_class?.pic}
                            errorMessage="No image found!"
                          />
                        ) : (
                          <Avatar
                            style={{
                              height: 200,
                              width: `90%`,
                            }}
                            variant="square"
                            src={no_book}
                            alt=""
                          />
                        )}

                        <div className="title">
                          {selected_class?.class_desc}
                        </div>
                        <div className="sub-title">
                          {selected_class?.course_desc}
                        </div>
                        <div className="remarks">
                          {StringEmptyToDefault(
                            selected_class?.remarks,
                            "No remarks yet!"
                          )}
                        </div>
                      </div>
                    </Grid>

                    <Grid item xs={12}>
                      <div className="other-info-container">
                        <div className="form-group">
                          <div className="label">Av. Class Rating</div>
                          <div className="value">
                            {selected_class?.average_rating ? (
                              <Rating
                                precision={0.1}
                                readOnly
                                value={UseNumbers.toNumber(
                                  selected_class?.average_rating,
                                  0
                                )}
                              />
                            ) : (
                              <b>TBD</b>
                            )}
                          </div>
                        </div>

                        {user_type === "student" && (
                          <div className="form-group">
                            <div className="label">You Rated</div>
                            <div className="value">
                              {/* {selected_class?.student_rating && (
                                
                                
                              )} */}
                              <Rating
                                value={UseNumbers.toNumber(
                                  selected_class?.student_rating,
                                  0
                                )}
                                name="avearge_rating"
                                onChange={(event, val) => {
                                  const payload: ClassRatingModel = {
                                    rate_val: val,
                                    class_pk: selected_class.class_pk,
                                  };

                                  dispatch(
                                    ClassActions.rateClass(payload, () => {
                                      dispatch(
                                        setSelectedClassAction(
                                          selected_class.class_pk
                                        )
                                      );
                                    })
                                  );
                                }}
                              />
                            </div>
                          </div>
                        )}

                        <div className="form-group">
                          <div className="label">Status</div>
                          <div className="value">
                            <Chip
                              label={selected_class?.sts_desc}
                              style={{
                                color: selected_class?.sts_color,
                                backgroundColor: selected_class?.sts_bgcolor,
                              }}
                            />
                          </div>
                        </div>
                        <div className="form-group">
                          <div className="label">Tutor</div>
                          <div className="value profile">
                            <CustomAvatar
                              src={selected_class?.tutor_info.picture}
                              errorMessage={selected_class?.tutor_name.charAt(
                                0
                              )}
                              style={{
                                height: 30,
                                width: 30,
                              }}
                            />

                            <div
                              style={{
                                color: user_type === "student" && `blue`,
                                cursor: user_type === "student" && `pointer`,
                              }}
                              onClick={() => {
                                if (
                                  user_type === "student" &&
                                  selected_class.tutor_info
                                ) {
                                  dispatch(
                                    TutorActions.getSingTutorToStudent(
                                      selected_class?.tutor_pk
                                    )
                                  );
                                }
                              }}
                            >
                              {selected_class?.tutor_name}
                            </div>
                          </div>
                        </div>
                        <div className="form-group">
                          <div className="label">Class Setup</div>
                          <div className="value">
                            {selected_class?.class_type === "o"
                              ? "Online"
                              : "Class Room"}
                          </div>
                        </div>
                        <div className="form-group">
                          <div className="label">Duration</div>
                          <div className="value">
                            {selected_class?.course_duration} minutes
                          </div>
                        </div>
                        <div className="form-group">
                          <div className="label">Scheduled Date</div>
                          <div className="value">
                            {InvalidDateToDefault(
                              selected_class?.start_date,
                              "-"
                            )}
                          </div>
                        </div>
                        <div className="form-group">
                          <div className="label">Time Interval</div>
                          <div className="value">
                            {InvalidTimeToDefault(
                              selected_class?.start_time,
                              ""
                            )}{" "}
                            -{" "}
                            {InvalidTimeToDefault(selected_class?.end_time, "")}
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
            <div className="container-body ">
              {fetching_selected_class && Tabs.length > 0 && !!user_type ? (
                <CircularLoadingProgress />
              ) : (
                <LinkTabs
                  tabs={Tabs}
                  RenderSwitchComponent={
                    <Switch>
                      <Route
                        path={`/${user_type}/class/${params.class_pk}/session`}
                        exact
                      >
                        <ClassSessionView class_pk={params.class_pk} />
                      </Route>
                      <Route
                        path={`/${user_type}/class/${params.class_pk}/student`}
                        exact
                      >
                        <ClassStudentView class_pk={params.class_pk} />
                      </Route>
                      <Route
                        path={`/${user_type}/class/${params.class_pk}/material`}
                        exact
                      >
                        <ClassMaterialView class_pk={params.class_pk} />
                      </Route>

                      <Route
                        path={`/${user_type}/class/${params.class_pk}/task`}
                        exact
                      >
                        <ClassTaskView class_pk={params.class_pk} />
                      </Route>
                      {user_type === "admin" && (
                        <Route
                          path={`/${user_type}/class/${params.class_pk}/rating`}
                          exact
                        >
                          <ClassRatingView class_pk={params.class_pk} />
                        </Route>
                      )}

                      {/* <Route
                      path={`/${user_type}/class/${params.class_pk}/attendance`}
                      exact
                    >
                      <div>Attendance</div>
                    </Route> */}
                    </Switch>
                  }
                />
              )}
            </div>
          </Grid>
        </Grid>

        <EditClassAdminDialog
          initial_form_values={selected_class}
          open_edit_class={open_edit_class}
          handleOpenEditClass={handleOpenEditClass}
          handleCloseEditClass={handleCloseEditClass}
        />

        {new_status && open_edit_class_status && selected_class && (
          <EditClassStatusDialog
            new_sts={new_status}
            initial_values={selected_class}
            open={open_edit_class_status}
            handleClose={handleCloseEditClassStatus}
          />
        )}
        {selected_class?.class_pk && open_rating && (
          <RateClassDialog
            class_pk={selected_class.class_pk}
            open={open_rating}
            handleClose={handleCloseRating}
          />
        )}
      </StyledManageClassAdmin>
    </>
  );
});

export default ManageClassView;
