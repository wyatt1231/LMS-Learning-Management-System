import React from "react";
import { Route, Switch } from "react-router-dom";
import ManageClassAdminView from "../Views/SharedViews/Class/ManageClassView";
import RateTutorDialog from "../Views/SharedViews/Tutor/RateTutorDIalog";
import DataClassStudentView from "../Views/StudentViews/DataClassStudentView";
import HomeStudentView from "../Views/StudentViews/DashboardStudentView";
import TutorRatingView from "../Views/StudentViews/TutorRatingStudentView/TutorRatingStudentView";
import ManageClassSelectedSessionTutorView from "../Views/TutorViews/ManageClassTutorViews/ManageClassSession";

const StudentRoutes = () => {
  return (
    <>
      <RateTutorDialog />
      <Switch>
        <Route path="/student/dashboard" exact>
          <HomeStudentView />
        </Route>
        {/* <Route path="/student/class" exact>
          <DataTableClassStudentView />
        </Route> */}

        {/* <Route
          path={`/student/class/:class_pk/session/:session_pk`}
          strict
          exact
        >
          <ManageClassSelectedSessionTutorView />
        </Route> */}

        <Route path="/student/class/records" strict>
          <DataClassStudentView />
        </Route>

        <Route path="/student/class/:class_pk/session/:session_pk" strict>
          <ManageClassSelectedSessionTutorView />
        </Route>

        <Route path="/student/class/:class_pk" strict>
          <ManageClassAdminView />
        </Route>

        {/* <Route path="/tutor/class/:class_pk/session/:session_pk" strict exact>
        <ManageClassSelectedSessionTutorView />
      </Route> */}
        {/* <Route path="/student/class/:class_pk" strict>
          <ManageClassTutorView />
        </Route> */}
      </Switch>
      <TutorRatingView />
    </>
  );
};

export default StudentRoutes;
