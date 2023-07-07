import { Chip, Container } from "@material-ui/core";
import React, { FC, memo, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, Route, Switch, useParams } from "react-router-dom";
import CustomAvatar from "../../../Component/CustomAvatar";
import {
  InvalidDateToDefault,
  parseTimeOrDefault,
} from "../../../Hooks/UseDateParser";
import { setSelectedClassAction } from "../../../Services/Actions/ClassActions";
import { setPageLinks } from "../../../Services/Actions/PageActions";
import { RootStore } from "../../../Services/Store";
import { StyledSessionTutorView } from "../../../Styles/GlobalStyles";
import { ManageClassMaterialStudentView } from "./ManageClassMaterialStudentView";
import { ManageClassSessionStudentView } from "./ManageClassSessionStudentView";

interface ManageClassStudentViewInterface {}

export const ManageClassStudentView: FC<ManageClassStudentViewInterface> = memo(
  () => {
    const dispatch = useDispatch();
    const { class_pk } = useParams<any>();

    const selected_class = useSelector(
      (store: RootStore) => store.ClassReducer.selected_class
    );
    const fetching_selected_class = useSelector(
      (store: RootStore) => store.ClassReducer.fetching_selected_class
    );

    useEffect(() => {
      let mounted = true;

      const fetching_data = () => {
        dispatch(setSelectedClassAction(class_pk));
      };

      mounted && fetching_data();
      return () => {
        mounted = false;
      };
    }, [dispatch, class_pk]);

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
      <Container maxWidth="xl">
        {selected_class && (
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
                  {selected_class?.class_desc}{" "}
                  <small>({selected_class?.course_desc})</small>
                </div>
              </div>
              <Chip
                label={
                  selected_class?.class_type === "o" ? "Online" : "Face to Face"
                }
              />
              <div className="course-subtitle">
                <div className="room">
                  <div>{selected_class?.room_desc}</div>
                </div>
                <div>/</div>
                <div className="duration">
                  {selected_class?.course_duration} mins
                </div>
                <div>/</div>
                <div className="datetime">
                  {InvalidDateToDefault(selected_class?.start_date, "")}{" "}
                  {parseTimeOrDefault(selected_class?.start_time, "")} -{" "}
                  {parseTimeOrDefault(selected_class?.end_time, "")}
                </div>
              </div>
            </div>

            <div className="tabs">
              <div className="links">
                <NavLink
                  to={`/student/class/${class_pk}/session`}
                  activeClassName="link-item-active"
                  className="link-item"
                >
                  Sessions
                </NavLink>

                <NavLink
                  to={`/student/class/${class_pk}/material`}
                  activeClassName="link-item-active"
                  className="link-item"
                >
                  Materials
                </NavLink>
                {/* <NavLink
                  to={`/tutor/class/${class_pk}/attendance`}
                  activeClassName="link-item-active"
                  className="link-item"
                >
                  Attendance
                </NavLink> */}
              </div>
              <div className="tab-container">
                <Switch>
                  <Route path={`/student/class/${class_pk}/session`} exact>
                    <ManageClassSessionStudentView class_pk={class_pk} />
                  </Route>
                  <Route path={`/student/class/${class_pk}/material`} exact>
                    <ManageClassMaterialStudentView class_pk={class_pk} />
                  </Route>
                </Switch>
              </div>
              {/* <CustomTab
                tabs={[
                  {
                    label: "Sessions",
                    RenderComponent: <div>tab 1</div>,
                  },
                  {
                    label: "Students",
                    RenderComponent: <div>tab 2</div>,
                  },
                  {
                    label: "Materials",
                    RenderComponent: <div>tab 3</div>,
                  },
                  {
                    label: "Attendance",
                    RenderComponent: <div>tab 3</div>,
                  },
                ]}
              /> */}
            </div>
          </StyledSessionTutorView>
        )}
      </Container>
    );
  }
);

export default ManageClassStudentView;
