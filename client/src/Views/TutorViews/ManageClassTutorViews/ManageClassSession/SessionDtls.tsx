import { Button, Chip, Grid } from "@material-ui/core";
import moment from "moment";
import React, { FC, memo, useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";
import { parseDateTimeOrDefault } from "../../../../Hooks/UseDateParser";
import UseInterval from "../../../../Hooks/UseInterval";
import {
  setSingleClassSession,
  startClassSessionAction,
} from "../../../../Services/Actions/ClassSessionActions";
import { ClassSessionModel } from "../../../../Services/Models/ClassSessionModel";
import { RootStore } from "../../../../Services/Store";
import DialogSessionEnd from "./DialogSessionEnd";
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
    <Grid item xs={12} container style={{ backgroundColor: `#fff` }}>
      <Grid item xs={12} md={8}>
        <div className="main-dtls-ctnr">
          <div
            style={{
              fontSize: `1.3em`,
              fontWeight: 600,
            }}
          >
            {single_class_session?.class_desc} /{" "}
            {single_class_session?.course_desc}
          </div>
          <div className="sub-title-cntr">
            <div className="sub-title">
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
            <div className="sub-title">
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
            {!single_class_session?.ended && (
              <div className="sub-title">
                <div className="label">Ellapsed Time</div>
                <div className="value">
                  <Chip label={ellapsed_time} />
                </div>
              </div>
            )}
          </div>
        </div>
      </Grid>
      <Grid
        item
        xs={12}
        md={4}
        container
        spacing={1}
        alignItems="center"
        justify="flex-end"
      >
        {user?.user_type === "tutor" && (
          <>
            <Grid item>
              <Button
                variant="contained"
                disabled={single_class_session?.sts_pk !== "fa"}
                color="primary"
                onClick={() => {
                  const payload: ClassSessionModel = {
                    session_pk: params.session_pk,
                  };
                  dispatch(
                    startClassSessionAction(payload, () => {
                      dispatch(setSingleClassSession(payload.session_pk));
                    })
                  );
                }}
              >
                Start Now
              </Button>
            </Grid>
            <Grid item>
              <Button
                variant="contained"
                color="secondary"
                onClick={() => handleSetDialogEnd(true)}
                disabled={single_class_session?.sts_pk !== "s"}
              >
                End & Write Remarks
              </Button>
            </Grid>
          </>
        )}
      </Grid>

      <DialogSessionEnd open={open_dialog_end} setOpen={handleSetDialogEnd} />
    </Grid>
  );
});

export default SessionDtls;
