import React from "react";
import { Route, Switch } from "react-router-dom";
import DataClassTutorView from "../Views/TutorViews/ClassTutorViews/DataClassTutorView";
import DashboardTutorView from "../Views/TutorViews/DashboardTutorView";
import ManageClassSelectedSessionTutorView from "../Views/TutorViews/ManageClassTutorViews/ManageClassSession";
import ManageClassAdminView from "../Views/SharedViews/Class/ManageClassView";

const TutorRoutes = () => {
  return (
    <Switch>
      <Route path="/tutor/dashboard" exact>
        <DashboardTutorView />
      </Route>

      <Route path="/tutor/class" exact>
        <DataClassTutorView />
      </Route>

      <Route path="/tutor/class/:class_pk/session/:session_pk" strict exact>
        <ManageClassSelectedSessionTutorView />
      </Route>

      <Route path="/tutor/class/:class_pk" strict>
        <ManageClassAdminView />
      </Route>
    </Switch>
  );
};

export default TutorRoutes;
