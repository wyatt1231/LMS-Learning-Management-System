import React from "react";
import { Route, Switch } from "react-router-dom";
import DataTableClassStudentView from "../Views/StudentViews/ClassStudentView/DataTableClassStudentView";
import HomeStudentView from "../Views/StudentViews/HomeStudentView/HomeStudentView";
import ManageClassStudentView from "../Views/StudentViews/ManageClassStudentView/ManageClassStudentView";
import TutorRatingView from "../Views/StudentViews/TutorRatingStudentView/TutorRatingStudentView";
import ManageClassSelectedSessionTutorView from "../Views/TutorViews/ManageClassTutorViews/ManageClassSelectedSessionTutorView";
import ManageClassTutorView from "../Views/TutorViews/ManageClassTutorViews/ManageClassTutorView";

const StudentRoutes = () => {
  return (
    <>
      <Switch>
        <Route path="/student/home" exact>
          <HomeStudentView />
        </Route>
        <Route path="/student/class" exact>
          <DataTableClassStudentView />
        </Route>

        <Route
          path={`/student/class/:class_pk/session/:session_pk`}
          strict
          exact
        >
          <ManageClassSelectedSessionTutorView />
        </Route>

        {/* <Route path="/tutor/class/:class_pk/session/:session_pk" strict exact>
        <ManageClassSelectedSessionTutorView />
      </Route> */}
        <Route path="/student/class/:class_pk" strict>
          {/* <ManageClassStudentView /> */}
          <ManageClassTutorView />
        </Route>
      </Switch>
      <TutorRatingView />
    </>
  );
};

export default StudentRoutes;
