import {
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@material-ui/core";
import EditRoundedIcon from "@material-ui/icons/EditRounded";
import React, { FC, memo, useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import CustomAvatar from "../../../Component/CustomAvatar";
import LinearLoadingProgress from "../../../Component/LinearLoadingProgress";
import { parseDateTimeOrDefault } from "../../../Hooks/UseDateParser";
import ClassSessionTaskActions from "../../../Services/Actions/ClassSessionTaskActions";
import { SessionTaskSubModel } from "../../../Services/Models/ClassSessionTaskModels";
import { RootStore } from "../../../Services/Store";
import ViewSubmissionDialog from "./ViewSubmissionDialog";

interface IManageTaskSubmit {
  class_task_pk: number;
}

export const ManageTaskSubmit: FC<IManageTaskSubmit> = memo(
  ({ class_task_pk }) => {
    const dispatch = useDispatch();

    const all_student_submit = useSelector(
      (store: RootStore) => store.ClassSessionTaskReducer.all_student_submit
    );
    const fetch_all_student_submit = useSelector(
      (store: RootStore) =>
        store.ClassSessionTaskReducer.fetch_all_student_submit
    );

    const [view_submit_dtls, set_view_submit_dtls] = useState(false);
    const [
      selected_submit,
      set_selected_submit,
    ] = useState<SessionTaskSubModel>(null);

    const handleViewSubmitDtls = useCallback((open: boolean) => {
      set_view_submit_dtls(open);
    }, []);

    const user_type = useSelector(
      (store: RootStore) => store.UserReducer?.user?.user_type
    );

    useEffect(() => {
      let mounted = true;

      const load = () => {
        dispatch(ClassSessionTaskActions.setAllStudentsSubmit(class_task_pk));
      };

      mounted && load();

      return () => {
        mounted = false;
      };
    }, [class_task_pk, dispatch]);

    return (
      <TableContainer>
        <LinearLoadingProgress show={fetch_all_student_submit} />
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell width="5%">#</TableCell>
              <TableCell width="70%">Student</TableCell>
              <TableCell width="20%">Submitted At</TableCell>
              <TableCell width="5%">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {all_student_submit?.map((s, i) => (
              <TableRow key={i}>
                <TableCell>{i + 1}</TableCell>
                <TableCell>
                  <div
                    style={{
                      display: `grid`,
                      gridGap: `.3em`,
                      fontWeight: 500,
                      fontSize: `.87em`,
                    }}
                  >
                    <span className="ques"></span>
                    <div className="table-cell-profile">
                      <CustomAvatar
                        className="image"
                        src={s.student.picture}
                        errorMessage={s.student.lastname.charAt(0)}
                      />
                      <div className="title">
                        <span style={{ textTransform: "capitalize" }}>
                          {s.student.lastname},{s.student.firstname}
                        </span>
                      </div>
                      <div className="sub-title">Grade {s.student.grade}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <small> {parseDateTimeOrDefault(s.answered_at, "-")}</small>
                </TableCell>
                <TableCell>
                  <IconButton
                    color="secondary"
                    onClick={() => {
                      handleViewSubmitDtls(true);
                      console.log(`s`, s);
                      set_selected_submit(s);
                    }}
                  >
                    <EditRoundedIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {selected_submit && (
          <ViewSubmissionDialog
            selected_submission={selected_submit}
            handleViewSubmitDtls={handleViewSubmitDtls}
            open={view_submit_dtls}
            class_task_pk={class_task_pk}
          />
        )}
      </TableContainer>
    );
  }
);

export default ManageTaskSubmit;
