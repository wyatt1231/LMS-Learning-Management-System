import { Chip, Container } from "@material-ui/core";
import React, { FC, memo, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, Route, Switch, useParams } from "react-router-dom";
import CustomAvatar from "../../../Component/CustomAvatar";
import CustomTab from "../../../Component/CustomTabs";
import LinkTabs from "../../../Component/LinkTabs";
import {
  InvalidDateToDefault,
  parseTimeOrDefault,
} from "../../../Hooks/UseDateParser";
import { setSelectedClassAction } from "../../../Services/Actions/ClassActions";
import { setPageLinks } from "../../../Services/Actions/PageActions";
import { RootStore } from "../../../Services/Store";
import { StyledSessionTutorView } from "../../../Styles/GlobalStyles";
import ManageClassMaterialTutorView from "./ManageClassMaterialTutorView";
import ManageClassSessionTutorView from "./ManageClassSessionTutorView";
import ManageClassStudentTutorView from "./ManageClassStudentTutorView";
import ManageClassTaskTutorView from "./ManageClassTaskTutorView";

interface ManageClassTutorViewInterface {}

export const ManageClassTutorView: FC<ManageClassTutorViewInterface> = memo(
  () => {
    const dispatch = useDispatch();
    const params = useParams<any>();

    const user_type = useSelector(
      (store: RootStore) => store.UserReducer.user?.user_type
    );

    const selected_class = useSelector(
      (store: RootStore) => store.ClassReducer.selected_class
    );
    const fetching_selected_class = useSelector(
      (store: RootStore) => store.ClassReducer.fetching_selected_class
    );

    useEffect(() => {
      let mounted = true;

      const fetching_data = () => {
        dispatch(setSelectedClassAction(params.class_pk));
      };

      mounted && fetching_data();
      return () => {
        mounted = false;
      };
    }, [dispatch, params.class_pk]);

    useEffect(() => {
      let mounted = true;

      const initializingState = () => {
        dispatch(
          setPageLinks([
            {
              link: "/tutor/class",
              title: "Classes",
            },
            {
              link: "/tutor/class",
              title: "Class Details",
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
      <Container maxWidth="lg">
        <span></span>
        {selected_class && user_type && (
          <StyledSessionTutorView>
            <div className="course_img">
              <CustomAvatar
                errorMessage={selected_class?.class_desc?.charAt(0)}
                src={selected_class.pic}
                widthSpacing={25}
                heightSpacing={15}
                variant="square"
              />
            </div>
            <div className="course-desc">
              <div className="course-title">
                <div>
                  {selected_class.class_desc} (
                  <small>{selected_class.course_desc}</small>)
                </div>
              </div>

              <div className="course-subtitle">
                <div className="room">
                  <div>{selected_class.room_desc}</div>
                </div>
                <div>/</div>
                <div className="duration">
                  {selected_class.course_duration} mins
                </div>
                <div>/</div>
                <div className="datetime">
                  {InvalidDateToDefault(selected_class.start_date, "")}{" "}
                  {parseTimeOrDefault(selected_class.start_time, "")} -{" "}
                  {parseTimeOrDefault(selected_class.end_time, "")}
                </div>
              </div>
              <Chip
                label={selected_class.class_type === "o" ? "Online" : "Offline"}
              />
            </div>

            <div className="tabs">
              <LinkTabs
                tabs={[
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
                ]}
                RenderSwitchComponent={
                  <Switch>
                    <Route
                      path={`/${user_type}/class/${params.class_pk}/session`}
                      exact
                    >
                      <ManageClassSessionTutorView class_pk={params.class_pk} />
                    </Route>
                    <Route
                      path={`/${user_type}/class/${params.class_pk}/student`}
                      exact
                    >
                      <ManageClassStudentTutorView class_pk={params.class_pk} />
                    </Route>
                    <Route
                      path={`/${user_type}/class/${params.class_pk}/material`}
                      exact
                    >
                      <ManageClassMaterialTutorView
                        class_pk={params.class_pk}
                      />
                    </Route>

                    <Route
                      path={`/${user_type}/class/${params.class_pk}/task`}
                      exact
                    >
                      <ManageClassTaskTutorView class_pk={params.class_pk} />
                    </Route>
                    <Route
                      path={`/${user_type}/class/${params.class_pk}/attendance`}
                      exact
                    >
                      <div>Attendance</div>
                    </Route>
                  </Switch>
                }
              />
            </div>
          </StyledSessionTutorView>
        )}
      </Container>
    );
  }
);

export default ManageClassTutorView;
