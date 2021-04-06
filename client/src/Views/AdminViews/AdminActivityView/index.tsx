import { Drawer, Grid, IconButton } from "@material-ui/core";
import React, { memo, FC, useEffect } from "react";
import CustomAvatar from "../../../Component/CustomAvatar";
import { StyledActivity } from "./styles";
import CloseRoundedIcon from "@material-ui/icons/CloseRounded";
import { useDispatch, useSelector } from "react-redux";
import { RootStore } from "../../../Services/Store";
import { toggleActivitySidebar } from "../../../Services/Actions/PageActions";
import UserActions from "../../../Services/Actions/UserActions";
import moment from "moment";
import LinearLoadingProgress from "../../../Component/LinearLoadingProgress";

interface IAdminActivityView {}

export const AdminActivityView: FC<IAdminActivityView> = memo(() => {
  const dispatch = useDispatch();
  const is_open = useSelector(
    (store: RootStore) => store.PageReducer.toggle_activity_sidebar
  );

  const all_logs = useSelector(
    (store: RootStore) => store.UserReducer.all_logs
  );
  const fetch_all_logs = useSelector(
    (store: RootStore) => store.UserReducer.fetch_all_logs
  );

  useEffect(() => {
    is_open && dispatch(UserActions.getAllLogs());
  }, [dispatch, is_open]);

  return (
    <>
      <Drawer
        anchor="right"
        PaperProps={{
          style: {
            minWidth: 300,
            maxWidth: 300,
            padding: `.5em`,
            paddingTop: `0`,
          },
        }}
        open={is_open}
        onClose={() => dispatch(toggleActivitySidebar(false))}
      >
        <div
          style={{
            display: `grid`,
            gridAutoFlow: `column`,
            gridAutoColumns: `1fr auto`,
            gridGap: `.5em`,
            padding: `0 .3em`,
            alignContent: `center`,
            alignItems: `center`,
            height: 60,
          }}
        >
          <div className="container-title">Latest Activities</div>
          <IconButton
            size="small"
            style={{
              backgroundColor: `#ffebee`,
              color: `#b71c1c
                `,
            }}
            onClick={() => dispatch(toggleActivitySidebar(false))}
          >
            <CloseRoundedIcon />
          </IconButton>
        </div>

        <LinearLoadingProgress show={fetch_all_logs} />

        <Grid
          container
          spacing={2}
          style={{
            height: `90%`,
            maxHeight: `calc(100%-60px)`,
            overflowY: `auto`,
          }}
          alignContent="flex-start"
          alignItems="flex-start"
        >
          {all_logs?.map((l, i) => (
            <Grid item xs={12} key={i}>
              <StyledActivity>
                <CustomAvatar
                  heightSpacing={4}
                  widthSpacing={4}
                  className="img"
                  src={l?.user?.picture}
                  errorMessage={
                    l?.user?.fullname ? l?.user?.fullname?.charAt(0) : "U"
                  }
                />
                <div className="activity">
                  <b>{l?.user?.fullname}</b> {l?.activity}
                </div>
                <div className="datetime">
                  {moment(l?.encoded_at).fromNow()}
                </div>
              </StyledActivity>
            </Grid>
          ))}
        </Grid>
      </Drawer>
    </>
  );
});

export default AdminActivityView;
