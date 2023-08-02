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
import AttachFileIcon from "@material-ui/icons/AttachFile";
import React, { FC, memo, useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import CustomAvatar from "../../../Component/CustomAvatar";
import LinearLoadingProgress from "../../../Component/LinearLoadingProgress";
import { parseDateTimeOrDefault } from "../../../Hooks/UseDateParser";
import ClassSessionTaskActions from "../../../Services/Actions/ClassSessionTaskActions";
import {
  SessionTaskSubFileModel,
  SessionTaskSubModel,
} from "../../../Services/Models/ClassSessionTaskModels";
import { RootStore } from "../../../Services/Store";
import ViewSubmissionDialog from "./ViewSubmissionDialog";
import BtnFileUpload from "../../../Component/BtnFileUpload";
import convertObjectToFormData from "../../../Helpers/convertObjectToFormData";
import FileViwer from "../../../Component/FileViewer";
import { API_BASE_URL } from "../../../Helpers/AppConfig";
import { setSnackbar } from "../../../Services/Actions/PageActions";
import FormDialog from "../../../Component/FormDialog/FormDialog";

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

    const [previewed_file, set_previewed_file] = useState(``);
    // const [view_submit_dtls, set_view_submit_dtls] = useState(false);
    const [selected_submit, set_selected_submit] =
      useState<SessionTaskSubModel>(null);

    const handleViewSubmitDtls = useCallback((open: boolean) => {
      // set_view_submit_dtls(open);
      set_selected_submit(null);
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
              <TableCell width="45%">Student</TableCell>
              <TableCell width="15%">Student Attachment</TableCell>
              <TableCell width="15%">Tutor Attachment</TableCell>
              <TableCell width="10%">Submitted At</TableCell>
              <TableCell width="5%" align="center">
                Actions
              </TableCell>
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
                    {/* <span className="ques"></span> */}
                    <div className="table-cell-profile">
                      <CustomAvatar
                        className="image"
                        src={s.student?.picture}
                        errorMessage={s.student?.lastname.charAt(0)}
                      />
                      <div className="title">
                        <span style={{ textTransform: "capitalize" }}>
                          {s.student?.lastname},{s.student?.firstname}
                        </span>
                      </div>
                      <div className="sub-title">Grade {s.student?.grade}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <small
                    className={!!s.stu_ans_file_loc ? "link" : ""}
                    onClick={() => {
                      if (!s.stu_ans_file_loc) {
                        dispatch(
                          setSnackbar(`No student file is attached`, `error`)
                        );
                      } else {
                        set_previewed_file(s.stu_ans_file_loc);
                      }
                    }}
                  >
                    View Submitted Attachment
                  </small>
                </TableCell>
                <TableCell>
                  <small
                    className={!!s.tut_file_loc ? "link" : ""}
                    onClick={() => {
                      if (!s.tut_file_loc) {
                        dispatch(
                          setSnackbar(`No tutor file is attached`, `error`)
                        );
                      } else {
                        set_previewed_file(s.tut_file_loc);
                      }
                    }}
                  >
                    View Submitted Attachment
                  </small>
                </TableCell>
                <TableCell>
                  <small> {parseDateTimeOrDefault(s.answered_at, "-")}</small>
                </TableCell>
                <TableCell align="center">
                  <div
                    style={{
                      display: `flex`,
                      alignItems: `center`,
                      justifyItems: `center`,
                    }}
                  >
                    <IconButton
                      color="secondary"
                      size="small"
                      onClick={() => {
                        set_selected_submit(null);
                        set_selected_submit(s);
                      }}
                    >
                      <EditRoundedIcon />
                    </IconButton>

                    {!!s.stu_ans_file_loc && (
                      <BtnFileUpload
                        key={Math.floor(Math.random() * 10)}
                        onChange={(e) => {
                          if (!!e.target.files[0]) {
                            const payload: SessionTaskSubFileModel = {
                              class_task_pk: s.class_task_pk,
                              submit_type: `tutor`,
                              file: e.target.files[0],
                            };

                            const formData: any =
                              convertObjectToFormData(payload);

                            dispatch(
                              ClassSessionTaskActions.addClassTaskFileSub(
                                formData,
                                (msg: string) => {
                                  dispatch(
                                    ClassSessionTaskActions.setAllStudentsSubmit(
                                      class_task_pk
                                    )
                                  );
                                }
                              )
                            );
                          }
                        }}
                      >
                        File
                      </BtnFileUpload>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {!!selected_submit && (
          <ViewSubmissionDialog
            open={!!selected_submit}
            selected_submission={selected_submit}
            handleViewSubmitDtls={handleViewSubmitDtls}
            class_task_pk={class_task_pk}
          />
        )}

        {!!previewed_file && (
          <FormDialog
            open={!!previewed_file}
            handleClose={() => set_previewed_file(null)}
            title={previewed_file}
            fullScreen={true}
            body={<FileViwer file={`${API_BASE_URL}${previewed_file}`} />}
          />
        )}
      </TableContainer>
    );
  }
);

export default ManageTaskSubmit;
