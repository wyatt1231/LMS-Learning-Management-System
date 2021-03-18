import React from "react";
import { Route, Switch } from "react-router-dom";
import CalendarTutorView from "../Views/TutorViews/CalendarTutorView";
import DataClassTutorView from "../Views/TutorViews/ClassTutorViews/DataClassTutorView";
import ManageClassSelectedSessionTutorView from "../Views/TutorViews/ManageClassTutorViews/ManageClassSelectedSessionTutorView";
import SessionTutorView from "../Views/TutorViews/ManageClassTutorViews/ManageClassTutorView";

const TutorRoutes = () => {
  return (
    <Switch>
      <Route path="/tutor/home" exact>
        <CalendarTutorView />
      </Route>

      <Route path="/tutor/class" exact>
        <DataClassTutorView />
      </Route>

      <Route path="/tutor/class/:class_pk/session/:session_pk" strict exact>
        <ManageClassSelectedSessionTutorView />
      </Route>

      <Route path="/tutor/class/:class_pk" strict>
        <SessionTutorView />
      </Route>
    </Switch>
  );
};

export default TutorRoutes;
