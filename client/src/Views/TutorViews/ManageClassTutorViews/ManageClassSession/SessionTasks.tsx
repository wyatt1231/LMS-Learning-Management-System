import { Button, Chip, Grid } from "@material-ui/core";
import React, { memo, FC, useCallback, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";
import { NavLink } from "react-router-dom";
import LinearLoadingProgress from "../../../../Component/LinearLoadingProgress";
import { parseDateTimeOrDefault } from "../../../../Hooks/UseDateParser";
import ClassSessionTaskActions from "../../../../Services/Actions/ClassSessionTaskActions";
import { RootStore } from "../../../../Services/Store";
import DialogAddTask from "./DialogAddTask";

interface ISessionTasks {}

export const SessionTasks: FC<ISessionTasks> = memo(() => {
  const dispatch = useDispatch();
  const params = useParams<any>();
  const [open_add_task, set_open_add_task] = useState(false);

  const user_type = useSelector(
    (store: RootStore) => store.UserReducer.user.user_type
  );

  const all_class_task = useSelector(
    (store: RootStore) => store.ClassSessionTaskReducer.all_class_task
  );
  const fetch_all_class_task = useSelector(
    (store: RootStore) => store.ClassSessionTaskReducer.fetch_all_class_task
  );

  const handleSetOpenAddTask = useCallback((open: boolean) => {
    set_open_add_task(open);
  }, []);

  useEffect(() => {
    let mounted = true;

    const fetchAllTasks = () => {
      dispatch(ClassSessionTaskActions.setAllClassTask(params.class_pk));
    };
    mounted && fetchAllTasks();

    return () => {
      mounted = false;
    };
  }, [dispatch, params.class_pk]);

  return (
    <>
      <div className="task-ctnr">
        <div className="ctnr-title">Tasks</div>
        {user_type === "tutor" && (
          <div className="actions">
            <Button
              variant="contained"
              color="primary"
              onClick={() => handleSetOpenAddTask(true)}
            >
              Add Task
            </Button>
          </div>
        )}

        <LinearLoadingProgress show={fetch_all_class_task} />

        <div className="task-data-ctnr">
          {all_class_task?.map((t, i) => (
            <div className="task-item">
              <div
                className="title link"
                onClick={() => {
                  dispatch(
                    ClassSessionTaskActions.setSingleClassTask(t.class_task_pk)
                  );
                }}
              >
                {t.task_title}
              </div>
              <div className="group">
                <div className="label">Due Date:</div>
                <div className="value">
                  {parseDateTimeOrDefault(t.due_date, "-")}
                </div>
              </div>
              <Chip
                size="small"
                label={t.status_dtls.sts_desc}
                style={{
                  color: t.status_dtls.sts_color,
                  backgroundColor: t.status_dtls.sts_bgcolor,
                  justifySelf: `start`,
                }}
              />
              <div className="desc">{t.task_desc}</div>
            </div>
          ))}
        </div>
      </div>
      <DialogAddTask open={open_add_task} setOpen={handleSetOpenAddTask} />
    </>
  );
});

export default SessionTasks;
