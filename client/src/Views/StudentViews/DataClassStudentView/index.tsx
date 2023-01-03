import { Container } from "@material-ui/core";
import React, { memo, FC, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Route, Switch } from "react-router";
import LinkTabs from "../../../Component/LinkTabs";
import { setPageLinks } from "../../../Services/Actions/PageActions";
import EndedClassTableStudentView from "./EndedClassTableStudentView";
import OngoingClassTableStudentView from "./OngoingClassTableStudentView";
import AvailableClassTableStudentView from "./AvailableClassTableStudentView";

interface IDataClassStudentView {}

export const DataClassStudentView: FC<IDataClassStudentView> = memo(() => {
  const dispatch = useDispatch();
  useEffect(() => {
    let mounted = true;

    const initializingState = () => {
      dispatch(
        setPageLinks([
          {
            link: "/student/class/records",
            title: "Classes",
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
    <>
      <Container
        style={{
          backgroundColor: `#fff`,
          borderRadius: 10,
        }}
        maxWidth="lg"
      >
        <LinkTabs
          tabs={[
            {
              label: "Enrolled/Ongoing Class",
              link: `/student/class/records/ongoing-class`,
            },
            {
              label: "All Classes",
              link: `/student/class/records/available-class`,
            },
            {
              label: "Ended Class",
              link: `/student/class/records/ended-class`,
            },
          ]}
          RenderSwitchComponent={
            <Switch>
              <Route path={`/student/class/records/ongoing-class`} exact>
                <OngoingClassTableStudentView />
              </Route>
              <Route path={`/student/class/records/available-class`} exact>
                <AvailableClassTableStudentView />
              </Route>
              <Route path={`/student/class/records/ended-class`} exact>
                <EndedClassTableStudentView />
              </Route>
            </Switch>
          }
        />
      </Container>
    </>
  );
});

export default DataClassStudentView;
