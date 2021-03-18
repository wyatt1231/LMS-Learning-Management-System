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
import LinearLoadingProgress from "../../../Component/LinearLoadingProgress";
import ClassSessionTaskActions from "../../../Services/Actions/ClassSessionTaskActions";
import { SessionTaskQuesModel } from "../../../Services/Models/ClassSessionTaskModels";
import { RootStore } from "../../../Services/Store";
import EditQues from "./EditQues";

interface IManageTaskQuesViewStud {
  class_task_pk: number;
}

export const ManageTaskQuesViewStud: FC<IManageTaskQuesViewStud> = memo(
  ({ class_task_pk }) => {
    const dispatch = useDispatch();

    const all_class_task_ques = useSelector(
      (store: RootStore) => store.ClassSessionTaskReducer.all_class_task_ques
    );
    const fetch_all_class_task_ques = useSelector(
      (store: RootStore) =>
        store.ClassSessionTaskReducer.fetch_all_class_task_ques
    );

    const [open_edit_ques, set_open_edit_ques] = useState(false);
    const [
      selected_task_ques,
      set_selected_task_ques,
    ] = useState<null | SessionTaskQuesModel>(null);

    const handleSetOpenEditQues = useCallback((open: boolean) => {
      set_open_edit_ques(open);
    }, []);

    useEffect(() => {
      let mounted = true;

      const load = () => {
        dispatch(ClassSessionTaskActions.setAllClassTaskQues(class_task_pk));
      };

      mounted && load();

      return () => {
        mounted = false;
      };
    }, [class_task_pk, dispatch]);

    return (
      <TableContainer>
        <LinearLoadingProgress show={fetch_all_class_task_ques} />
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell width="5%">#</TableCell>
              <TableCell width="85%">Question Details</TableCell>
              <TableCell width="10%">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {all_class_task_ques?.map((q, i) => (
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
                    <div>
                      Q: <span className="ques">{q.question}</span>
                    </div>
                    <div>
                      A: <span className="ques">{q.cor_answer}</span>
                    </div>
                    <div>
                      P: <span className="ques">{q.pnt}</span>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <IconButton
                    color="secondary"
                    onClick={() => {
                      handleSetOpenEditQues(true);
                      set_selected_task_ques(q);
                    }}
                  >
                    <EditRoundedIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {selected_task_ques && open_edit_ques && (
          <EditQues
            handleSetOpenEditQues={handleSetOpenEditQues}
            open={open_edit_ques}
            task_ques={selected_task_ques}
          />
        )}
      </TableContainer>
    );
  }
);

export default ManageTaskQuesViewStud;
