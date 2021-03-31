import { Chip, Grid, useTheme } from "@material-ui/core";
import StarRoundedIcon from "@material-ui/icons/StarRounded";
import { Skeleton } from "@material-ui/lab";
import React, { FC, memo, useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Switch, useParams } from "react-router";
import { Route } from "react-router-dom";
import CustomAvatar from "../../../Component/CustomAvatar";
import IconButtonPopper from "../../../Component/IconButtonPopper/IconButtonPopper";
import LinkTabs from "../../../Component/LinkTabs";
import {
  InvalidDateToDefault,
  InvalidTimeToDefault,
} from "../../../Hooks/UseDateParser";
import { StringEmptyToDefault } from "../../../Hooks/UseStringFormatter";
import { setSelectedClassAction } from "../../../Services/Actions/ClassActions";
import { setPageLinks } from "../../../Services/Actions/PageActions";
import { RootStore } from "../../../Services/Store";
import ClassMaterialView from "../../SharedViews/Class/ClassMaterialView";
import ClassRatingView from "../../SharedViews/Class/ClassRatingView";
import ClassSessionView from "../../SharedViews/Class/ClassSessionView";
import ClassStudentView from "../../SharedViews/Class/ClassStudentView";
import ClassTaskView from "../../SharedViews/Class/ClassTaskView";
import ManageClassTaskTutorView from "../../TutorViews/ManageClassTutorViews/ManageClassTaskTutorView";
import EditClassAdminDialog from "./EditClassAdminDialog";
import { StyledManageClassAdmin } from "./styles";
interface IManageClassAdminView {}

export const ManageClassAdminView: FC<IManageClassAdminView> = memo(() => {
  const dispatch = useDispatch();
  const params = useParams<any>();
  const theme = useTheme();

  const user_type = useSelector(
    (store: RootStore) => store.UserReducer.user?.user_type
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
                        <CustomAvatar
                          style={{
                            height: 200,
                            width: `90%`,
                          }}
                          variant="square"
                          src={selected_class?.pic}
                          errorMessage="No image found!"
                        />

                        <div className="title">
                          {selected_class?.class_desc}
                        </div>
                        <div className="sub-title">
                          {selected_class?.course_desc}
                        </div>
                        <div className="rating">
                          4.5
                          <StarRoundedIcon
                            style={{
                              color: `yellow`,
                            }}
                          />
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
                            <div>{selected_class?.tutor_name}</div>
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
              <LinkTabs
                tabs={[
                  {
                    label: "Session",
                    link: `/${user_type}/class/${params.class_pk}/session`,
                  },
                  {
                    label: "Student",
                    link: `/${user_type}/class/${params.class_pk}/student`,
                  },
                  {
                    label: "Material",
                    link: `/${user_type}/class/${params.class_pk}/material`,
                  },
                  {
                    label: "Task",
                    link: `/${user_type}/class/${params.class_pk}/task`,
                  },
                  {
                    label: "Rating",
                    link: `/${user_type}/class/${params.class_pk}/rating`,
                  },
                ]}
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
                    <Route
                      path={`/${user_type}/class/${params.class_pk}/rating`}
                      exact
                    >
                      <ClassRatingView class_pk={params.class_pk} />
                    </Route>
                    {/* <Route
                      path={`/${user_type}/class/${params.class_pk}/attendance`}
                      exact
                    >
                      <div>Attendance</div>
                    </Route> */}
                  </Switch>
                }
              />
            </div>
          </Grid>
        </Grid>

        <EditClassAdminDialog
          initial_form_values={selected_class}
          open_edit_class={open_edit_class}
          handleOpenEditClass={handleOpenEditClass}
          handleCloseEditClass={handleCloseEditClass}
        />
      </StyledManageClassAdmin>
    </>
  );
});

export default ManageClassAdminView;
