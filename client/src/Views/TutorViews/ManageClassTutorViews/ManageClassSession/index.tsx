import {
  Backdrop,
  CircularProgress,
  Container,
  Grid,
  Typography,
  useTheme,
} from "@material-ui/core";
import React, { FC, memo, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { setSingleClassSession } from "../../../../Services/Actions/ClassSessionActions";
import ClassStudentActions from "../../../../Services/Actions/ClassStudentActions";
import { setPageLinks } from "../../../../Services/Actions/PageActions";
import { RootStore } from "../../../../Services/Store";
import SessionDtls from "./SessionDtls";
import SessionTabs from "./SessionTabs";
import SessionTasks from "./SessionTasks";
import SessionConf from "./SessionVideoConf";
import { StyledSelectedSession } from "./styles";

interface ManageClassSelectedSessionTutorInterface {}

export const ManageClassSelectedSessionTutorView: FC<ManageClassSelectedSessionTutorInterface> =
  memo(() => {
    const dispatch = useDispatch();
    const params = useParams<any>();
    const theme = useTheme();

    const fetch_single_class_session = useSelector(
      (store: RootStore) => store.ClassSessionReducer.fetch_single_class_session
    );

    const single_class_session = useSelector(
      (store: RootStore) => store.ClassSessionReducer.single_class_session
    );

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
              link: `/tutor/class/${params.id}`,
              title: "Class Details",
            },
            {
              link: `/tutor/class/${params.class_pk}/session`,
              title: "Session",
            },
            {
              link: window.location.pathname,
              title: "Manage Session",
            },
          ])
        );
      };

      mounted && initializingState();
      return () => {
        mounted = false;
      };
    }, [dispatch, params.id]);

    useEffect(() => {
      let mounted = true;

      const fetchClassStudents = () => {
        dispatch(
          ClassStudentActions.setTblClassStudentsAction(params.class_pk)
        );
      };

      mounted && fetchClassStudents();

      return () => {
        mounted = false;
      };
    }, [dispatch, params.class_pk]);

    useEffect(() => {
      let mounted = true;

      const fetchSingleClassSession = () => {
        dispatch(setSingleClassSession(params.session_pk));
      };

      mounted && fetchSingleClassSession();

      return () => {
        mounted = false;
      };
    }, [dispatch, params.session_pk]);

    if (fetch_single_class_session) {
      return (
        <Backdrop
          style={{
            zIndex: theme.zIndex.modal + 100,
            color: "#fff",
            display: "grid",
            gridAutoFlow: "column",
            gridGap: "1em",
          }}
          open={true}
        >
          <CircularProgress color="inherit" />
          <Typography variant="subtitle1">
            Preparing the data, thank you for your patience!
          </Typography>
        </Backdrop>
      );
    }

    return (
      <Container maxWidth="xl">
        {single_class_session ? (
          <StyledSelectedSession>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <SessionDtls />
              </Grid>
              <Grid item xs={12} md={3}>
                <SessionTasks />
              </Grid>
              <Grid item xs={12} md={6}>
                <div className="vid-ctnr">
                  <SessionConf />
                </div>
              </Grid>
              <Grid item sm={12} md={3}>
                <SessionTabs />
              </Grid>
              {/* <Grid item sm={12} md={12}>
                <Grid container spacing={4}></Grid>
              </Grid> */}
            </Grid>
          </StyledSelectedSession>
        ) : (
          <CircularProgress />
        )}
      </Container>
    );
  });

export default ManageClassSelectedSessionTutorView;
