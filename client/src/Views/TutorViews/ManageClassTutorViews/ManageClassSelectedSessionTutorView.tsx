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
import { setSingleClassSession } from "../../../Services/Actions/ClassSessionActions";
import ClassStudentActions from "../../../Services/Actions/ClassStudentActions";
import { setPageLinks } from "../../../Services/Actions/PageActions";
import { RootStore } from "../../../Services/Store";
import SessionConf from "./ManageClassSession/SessionVideoConf";
import SessionDtls from "./ManageClassSession/SessionDtls";
import SessionTabs from "./ManageClassSession/SessionTabs";
import { ManageClassSelectedSessionTutorStyle } from "./styles";
import SessionTasks from "./ManageClassSession/SessionTasks";

interface ManageClassSelectedSessionTutorInterface {}

export const ManageClassSelectedSessionTutorView: FC<ManageClassSelectedSessionTutorInterface> = memo(
  () => {
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
              link: "/tutor/class/11/session",
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
      return () => (mounted = false);
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
          <ManageClassSelectedSessionTutorStyle>
            <Grid container spacing={1}>
              <SessionDtls />

              <SessionTasks />
              <Grid item xs={12} md={7}>
                <div className="vid-ctnr">
                  <SessionConf />
                </div>
              </Grid>
              <SessionTabs />
            </Grid>
          </ManageClassSelectedSessionTutorStyle>
        ) : (
          <CircularProgress />
        )}
      </Container>
    );
  }
);

export default ManageClassSelectedSessionTutorView;
