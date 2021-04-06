import { Drawer } from "@material-ui/core";
import React from "react";
import { Route, Switch } from "react-router-dom";
import AdminActivityView from "../Views/AdminViews/AdminActivityView";
import AddClassAdminView from "../Views/AdminViews/AdminClassView/AddClassAdminView";
import { DataTableClassAdminView } from "../Views/AdminViews/AdminClassView/DataTableClassAdminView";
import ManageClassAdminView from "../Views/SharedViews/Class/ManageClassView";
import AddCourseAdminView from "../Views/AdminViews/AdminCourseView/AddCourseAdminView";
import { DataTableCourseAdminView } from "../Views/AdminViews/AdminCourseView/DataTableCourseAdminView";
import DashboardAdminView from "../Views/AdminViews/AdminDashboardView/DashboardAdminView";
import AdminProfileView from "../Views/AdminViews/AdminProfileView";
import DataTableStudentAdminView from "../Views/AdminViews/AdminStudentView/DatatableStudentAdminView";
import ManageStudentAdminView from "../Views/AdminViews/AdminStudentView/ManageStudentAdminView";
import AddAdminTutorView from "../Views/AdminViews/AdminTutorView/AddAdminTutorView";
import DataTableAdminTutorView from "../Views/AdminViews/AdminTutorView/DataTableAdminTutorView";
import ManageAdminAdminView from "../Views/AdminViews/AdminTutorView/ManageAdminTutorView";
import AddCoAdminView from "../Views/AdminViews/CoAdminView/AddCoAdminView";
import DataTableCoAdminView from "../Views/AdminViews/CoAdminView/DataTableCoAdminView";
import AddRoomAdminView from "../Views/AdminViews/Room/AddRoomAdminView";
import DataTableRoomAdminView from "../Views/AdminViews/Room/DataTableRoomAdminView";

const SysAdminRoutes = () => {
  return (
    <>
      <AdminActivityView />
      <Switch>
        <Route path="/admin/dashboard" exact>
          <DashboardAdminView />
        </Route>
        <Route path="/admin/class" exact>
          <DataTableClassAdminView />
        </Route>
        <Route path="/admin/class/add" exact>
          <AddClassAdminView />
        </Route>

        <Route path="/admin/class/:class_pk" strict>
          <ManageClassAdminView />
        </Route>
        <Route path="/admin/course" exact>
          <DataTableCourseAdminView />
        </Route>
        <Route path="/admin/course/add" exact>
          <AddCourseAdminView />
        </Route>

        <Route path="/admin/tutor" exact>
          <DataTableAdminTutorView />
        </Route>

        <Route path="/admin/tutor/add" exact>
          <AddAdminTutorView />
        </Route>

        <Route path="/admin/tutor/:tutor_pk" strict>
          <ManageAdminAdminView />
        </Route>

        <Route path="/admin/room" exact>
          <DataTableRoomAdminView />
        </Route>
        <Route path="/admin/room/add" exact>
          <AddRoomAdminView />
        </Route>

        <Route path="/admin/student" exact>
          <DataTableStudentAdminView />
        </Route>
        <Route path="/admin/student/:student_pk" strict>
          <ManageStudentAdminView />
        </Route>

        <Route path="/admin/co-administrator" exact>
          <DataTableCoAdminView />
        </Route>
        <Route path="/admin/co-administrator/add" exact>
          <AddCoAdminView />
        </Route>
        <Route path="/admin/profile" exact>
          <AdminProfileView />
        </Route>
      </Switch>
    </>
  );
};

export default SysAdminRoutes;
