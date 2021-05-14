import { Chip, Drawer, Grid, IconButton, useTheme } from "@material-ui/core";
import CloseRoundedIcon from "@material-ui/icons/CloseRounded";
import moment from "moment";
import React, { memo, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  InvalidDateToDefault,
  InvalidTimeToDefault,
} from "../../Hooks/UseDateParser";
import ClassActions from "../../Services/Actions/ClassActions";
import { toggleClassReqSidebar } from "../../Services/Actions/PageActions";
import { ClassRequestModel } from "../../Services/Models/ClassRequestModel";
import { RootStore } from "../../Services/Store";
import CustomAvatar from "../CustomAvatar";
import IconButtonPopper from "../IconButtonPopper/IconButtonPopper";
import LinearLoadingProgress from "../LinearLoadingProgress";
import AcknowledgeRequestDialog from "./AcknowledgeRequestDialog";
import ReqRemarksDialog from "./ReqRemarksDialog";
import RequestClassStudentView from "./RequestClassStudentView";
import { StyledActivity } from "./styles";
const ClassRequest = memo(() => {
  const dispatch = useDispatch();
  const theme = useTheme();

  const user_type = useSelector(
    (store: RootStore) => store.UserReducer.user?.user_type
  );

  const [selected_remarks, set_selected_remarks] = useState<any>(null);

  const [class_req_pk, set_class_req_pk] = useState<any>(null);

  const is_open = useSelector(
    (store: RootStore) => store.PageReducer.toggle_class_req_sidebar
  );

  const class_req = useSelector(
    (store: RootStore) => store.ClassReducer.class_req
  );
  const fetch_class_req = useSelector(
    (store: RootStore) => store.ClassReducer.fetch_class_req
  );

  useEffect(() => {
    is_open && dispatch(ClassActions.getClassRequests());
  }, [dispatch, is_open]);

  const ButtonActions = (req: ClassRequestModel) => {
    const btns = [];

    if (user_type === "admin") {
      btns.push({
        text: "Acknowledge Request",
        color: "primary",
        handleClick: () => {
          set_class_req_pk(req.class_req_pk);
        },
      });
    }

    btns.push({
      text: "View Remarks",
      color: "primary",
      handleClick: () => {
        set_selected_remarks(req.admin_remarks);
      },
    });

    return btns;
  };

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
        onClose={() => dispatch(toggleClassReqSidebar(false))}
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
          <div className="container-title">Requested Classes of Students</div>

          <IconButton
            size="small"
            style={{
              backgroundColor: `#ffebee`,
              color: `#b71c1c
              `,
            }}
            onClick={() => dispatch(toggleClassReqSidebar(false))}
          >
            <CloseRoundedIcon />
          </IconButton>
        </div>

        <LinearLoadingProgress show={fetch_class_req} />

        {user_type === "student" && (
          <Grid container spacing={2} justify="flex-end">
            <Grid item>
              <div
                style={{
                  padding: `1em 0`,
                }}
              >
                <RequestClassStudentView />
              </div>
            </Grid>
          </Grid>
        )}

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
          {class_req?.map((l, i) => (
            <Grid item xs={12} key={i}>
              <StyledActivity theme={theme}>
                <CustomAvatar
                  heightSpacing={4}
                  widthSpacing={4}
                  className="img"
                  src={l?.tutor?.picture}
                  errorMessage={l?.tutor?.firstname?.charAt(0)}
                />
                <div className="activity">
                  <b>
                    {l?.tutor?.firstname} {l?.tutor?.firstname}
                  </b>
                </div>

                <div className="datetime">
                  {moment(l?.encoded_at).fromNow()}
                </div>

                <div className="actions">
                  <IconButtonPopper buttons={ButtonActions(l)} />
                </div>

                <div className="body">
                  <div>
                    <b>{l?.course_desc}</b>
                  </div>
                  <div>
                    <Chip
                      label={l?.status?.sts_desc}
                      style={{
                        color: l?.status?.sts_color,
                        backgroundColor: l?.status?.sts_bgcolor,
                      }}
                    />
                  </div>
                  <div className=" ">
                    <div className="info-group">
                      <div className="label">Requested Tutor</div>
                      <div className="value">{l?.tutor_name}</div>
                    </div>
                  </div>
                  <div className=" ">
                    <div className="info-group">
                      <div className="label">Start Date</div>
                      <div className="value">
                        {InvalidDateToDefault(l?.start_date, "-")}
                      </div>
                    </div>
                  </div>
                  <div className=" item">
                    <div className="info-group">
                      <div className="label">Time</div>
                      <div className="value">
                        {InvalidTimeToDefault(l?.start_time, "-")} -
                        {InvalidTimeToDefault(l?.end_time, "-")}
                      </div>
                    </div>
                  </div>
                </div>
              </StyledActivity>
            </Grid>
          ))}
        </Grid>
        {!!selected_remarks && (
          <ReqRemarksDialog
            handleClose={() => set_selected_remarks(null)}
            remarks={selected_remarks}
          />
        )}

        {!!class_req_pk && (
          <AcknowledgeRequestDialog
            handleClose={() => set_class_req_pk(null)}
            class_req_pk={class_req_pk}
          />
        )}
      </Drawer>
    </>
  );
});

export default ClassRequest;
