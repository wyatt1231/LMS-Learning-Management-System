import React, { memo, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import LoginPortal from "../Views/LoginPortal/LoginPortal";
import { SetCurrentUserAction } from "../Services/Actions/UserActions";
import { RootStore } from "../Services/Store";
import PageLoader from "../Component/PageLoader";
import PagePrompt from "../Component/PagePrompt";
import PageSnackbar from "../Component/PageSnackbar";
import SysAdminRoutes from "./AdminRoutes";
import Layout from "./Layout/Layout";
import RegisterSTudentView from "../Views/RegisterStudentViews/RegisterStudentView";
import TutorRoutes from "./TutorRoutes";
import PageSuccessPrompt from "../Component/PageSuccessPrompt";
import StudentRoutes from "./StudentRoutes";

const Routes = memo(() => {
  const dispatch = useDispatch();
  const user = useSelector((store: RootStore) => store.UserReducer.user);

  useEffect(() => {
    let mounted = true;
    const getUserInfo = async () => {
      dispatch(SetCurrentUserAction());
    };

    mounted && getUserInfo();

    return () => {
      mounted = false;
    };
  }, [dispatch]);

  return (
    <div>
      <Router>
        <PageLoader />
        <PagePrompt />
        <PageSnackbar />
        <PageSuccessPrompt />
        <Switch>
          {/* <Route path="/" exact component={LoginPortal} /> */}
          <Route path="/login" exact component={LoginPortal} />
          <Route
            path="/student-registration"
            exact
            component={RegisterSTudentView}
          />
          {/* <Route path="/notfound" exact component={PageNotFound} /> */}
          <Layout>
            {user?.user_type === "admin" && <SysAdminRoutes />}
            {user?.user_type === "tutor" && <TutorRoutes />}
            {user?.user_type === "student" && <StudentRoutes />}
          </Layout>
        </Switch>
      </Router>
    </div>
  );
});
export default Routes;
