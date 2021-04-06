import {
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@material-ui/core";
import React, { FC, memo, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import IconButtonPopper from "../../../Component/IconButtonPopper/IconButtonPopper";
import LinearLoadingProgress from "../../../Component/LinearLoadingProgress";
import { parseDateTimeOrDefault } from "../../../Hooks/UseDateParser";
import ClassSessionTaskActions from "../../../Services/Actions/ClassSessionTaskActions";
import { RootStore } from "../../../Services/Store";
interface ClassTaskProps {
  class_pk: number;
}

export const ClassTaskView: FC<ClassTaskProps> = memo(({ class_pk }) => {
  const dispatch = useDispatch();

  const user_type = useSelector(
    (store: RootStore) => store.UserReducer.user.user_type
  );

  const all_class_task = useSelector(
    (store: RootStore) => store.ClassSessionTaskReducer.all_class_task
  );
  const fetch_all_class_task = useSelector(
    (store: RootStore) => store.ClassSessionTaskReducer.fetch_all_class_task
  );

  useEffect(() => {
    dispatch(ClassSessionTaskActions.setAllClassTask(class_pk));
  }, [dispatch, class_pk]);

  return (
    <div className="class-tab">
      <LinearLoadingProgress show={fetch_all_class_task} />
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell width="20%">Task Title</TableCell>
              <TableCell width="50%">Description/Instruction</TableCell>
              <TableCell width="10%">Status</TableCell>
              <TableCell width="15%">Due Date</TableCell>
              {user_type !== "admin" && <TableCell width="5%"></TableCell>}
            </TableRow>
          </TableHead>
          <TableBody>
            {all_class_task?.length < 1 && (
              <TableRow>
                <TableCell align="center" colSpan={5}>
                  <span className="empty-rows">No records to show.</span>
                </TableCell>
              </TableRow>
            )}

            {all_class_task?.map((t, i) => (
              <TableRow key={i}>
                <TableCell>{t.task_title}</TableCell>
                <TableCell>
                  <small>{t.task_desc}</small>
                </TableCell>
                <TableCell>
                  <Chip
                    label={t.status_dtls.sts_desc}
                    style={{
                      color: t.status_dtls.sts_color,
                      backgroundColor: t.status_dtls.sts_bgcolor,
                    }}
                  />
                </TableCell>
                <TableCell>
                  <small style={{ fontWeight: 500 }}>
                    {parseDateTimeOrDefault(t.due_date, "")}
                  </small>
                </TableCell>
                {user_type !== "admin" && (
                  <TableCell align="center">
                    <IconButtonPopper
                      style={{ justifySelf: `end` }}
                      buttons={[
                        {
                          text: "Go to Task",
                          handleClick: () => {
                            dispatch(
                              ClassSessionTaskActions.setSingleClassTask(
                                t.class_task_pk
                              )
                            );
                          },
                        },
                      ]}
                    />
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
});

export default ClassTaskView;
