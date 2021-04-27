import { Button, Chip, Grid } from "@material-ui/core";
import { Rating } from "@material-ui/lab";
import moment from "moment";
import React, { FC, memo, useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";
import CustomAvatar from "../../../../Component/CustomAvatar";
import { parseDateTimeOrDefault } from "../../../../Hooks/UseDateParser";
import UseInterval from "../../../../Hooks/UseInterval";
import { RootStore } from "../../../../Services/Store";
import EditSessionStatusDialog from "./EditSessionStatusDialog";
interface ISessionDtls {}

export const SessionDtls: FC<ISessionDtls> = memo(() => {
  const single_class_session = useSelector(
    (store: RootStore) => store.ClassSessionReducer.single_class_session
  );
  const user = useSelector((store: RootStore) => store.UserReducer.user);

  const dispatch = useDispatch();
  const params = useParams<any>();

  const [open_dialog_end, set_open_dialog_end] = useState(false);
  const [ellapsed_time, set_ellapsed_time] = useState<any>("");

  const handleSetDialogEnd = useCallback((open: boolean) => {
    set_open_dialog_end(open);
  }, []);

  const [new_status, set_new_status] = useState<null | "s" | "u" | "e">(null);
  const [open_edit_class_status, set_open_edit_class_status] = useState(false);

  const handleOpenEditClassStatus = useCallback(() => {
    set_open_edit_class_status(true);
  }, []);

  const handleCloseEditClassStatus = useCallback(() => {
    set_open_edit_class_status(false);
  }, []);

  const handleChangeEllapseTime = useCallback(() => {
    if (single_class_session?.began && !single_class_session.ended) {
      const ellapse = moment.duration(
        moment(new Date()).diff(moment(single_class_session?.began))
      );
      set_ellapsed_time(
        ellapse.hours() +
          " hr, " +
          ellapse.minutes() +
          " min, " +
          ellapse.seconds() +
          " sec"
      );
    }
  }, [single_class_session]);

  UseInterval(handleChangeEllapseTime, 1000);

  return (
    <Grid item xs={12}>
      <div
        style={{
          backgroundColor: `#fff`,
          padding: `1em`,
          borderRadius: `10px`,
          height: `100%`,
          width: `100%`,
        }}
      >
        <Grid container spacing={4}>
          <Grid item xs={3}>
            <div className="main-details-container">
              <CustomAvatar
                src={single_class_session?.class_info?.course_info?.picture}
                errorMessage="No Photo"
                variant="square"
                heightSpacing={30}
                widthSpacing={25}
              />
              <div className="actions">
                {user?.user_type === "tutor" &&
                  single_class_session?.sts_pk === "p" && (
                    <>
                      <Grid item>
                        <Button
                          size="small"
                          color="primary"
                          onClick={() => {
                            handleOpenEditClassStatus();
                            set_new_status("s");
                          }}
                        >
                          Start Now
                        </Button>
                      </Grid>
                      <Grid item>
                        <Button
                          size="small"
                          color="secondary"
                          onClick={() => {
                            handleOpenEditClassStatus();
                            set_new_status("u");
                          }}
                        >
                          Unattend/Absent
                        </Button>
                      </Grid>
                    </>
                  )}

                {user?.user_type === "tutor" &&
                  single_class_session?.sts_pk === "s" && (
                    <>
                      <Grid item>
                        <Button
                          size="small"
                          color="secondary"
                          onClick={() => {
                            handleOpenEditClassStatus();
                            set_new_status("e");
                          }}
                        >
                          End
                        </Button>
                      </Grid>
                    </>
                  )}
              </div>
            </div>
          </Grid>
          <Grid item xs={9}>
            <div className="sub-details-container">
              <div
                style={{
                  fontSize: `1.5em`,
                  fontWeight: 600,
                }}
              >
                {single_class_session?.class_desc}
              </div>
              <div
                style={{
                  fontSize: `1em`,
                  fontWeight: 600,
                  opacity: 0.7,
                }}
              >
                {single_class_session?.course_desc}
              </div>
              <div className="sub-title-cntr">
                <div className="info-group">
                  <div className="label">Status</div>
                  <div className="value">
                    <Chip
                      label={single_class_session?.status_info?.sts_desc}
                      style={{
                        color: single_class_session?.status_info?.sts_color,
                        backgroundColor:
                          single_class_session?.status_info?.sts_bgcolor,
                      }}
                    />
                  </div>
                </div>
                <div className="info-group">
                  <div className="label">Started at</div>
                  <div className="value">
                    <Chip
                      label={parseDateTimeOrDefault(
                        single_class_session?.began,
                        "TBD"
                      )}
                    />
                  </div>
                </div>
                <div className="info-group">
                  <div className="label">Ended at </div>
                  <div className="value">
                    <Chip
                      label={parseDateTimeOrDefault(
                        single_class_session?.ended,
                        "TBD"
                      )}
                    />
                  </div>
                </div>
                {single_class_session?.sts_pk === "s" && (
                  <div className="info-group">
                    <div className="label">Ellapsed Time</div>
                    <div className="value">
                      <Chip label={ellapsed_time} />
                    </div>
                  </div>
                )}
              </div>

              <div className="remarks">
                {single_class_session?.class_info?.remarks}
              </div>
              <div className="remarks">{single_class_session?.remarks}</div>
            </div>
          </Grid>
        </Grid>
      </div>
      {new_status &&
        open_edit_class_status &&
        single_class_session?.class_info && (
          <EditSessionStatusDialog
            new_sts={new_status}
            initial_values={single_class_session}
            open={open_edit_class_status}
            handleClose={handleCloseEditClassStatus}
          />
        )}
    </Grid>
  );
});

export default SessionDtls;
