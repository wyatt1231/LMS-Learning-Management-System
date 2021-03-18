import {
  Button,
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
import { FormProvider, useFieldArray, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import TextFieldHookForm from "../../../Component/HookForm/TextFieldHookForm";
import LinearLoadingProgress from "../../../Component/LinearLoadingProgress";
import ClassSessionTaskActions from "../../../Services/Actions/ClassSessionTaskActions";
import { setGeneralPrompt } from "../../../Services/Actions/PageActions";
import { SessionTaskQuesModel } from "../../../Services/Models/ClassSessionTaskModels";
import { RootStore } from "../../../Services/Store";
import EditQues from "./EditQues";

interface IManageTaskQuesView {
  class_task_pk: number;
}

export const ManageTaskQuesView: FC<IManageTaskQuesView> = memo(
  ({ class_task_pk }) => {
    const dispatch = useDispatch();

    const all_class_task_ques = useSelector(
      (store: RootStore) => store.ClassSessionTaskReducer.all_class_task_ques
    );
    const fetch_all_class_task_ques = useSelector(
      (store: RootStore) =>
        store.ClassSessionTaskReducer.fetch_all_class_task_ques
    );

    const all_class_task_sub = useSelector(
      (store: RootStore) => store.ClassSessionTaskReducer.all_class_task_sub
    );

    console.log(`all_class_task_sub`, all_class_task_sub);

    const user_type = useSelector(
      (store: RootStore) => store.UserReducer?.user?.user_type
    );

    console.log(`user_type`, user_type);

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

    useEffect(() => {
      let mounted = true;

      const load = () => {
        dispatch(ClassSessionTaskActions.setAllClassTaskSub(class_task_pk));
      };

      mounted && load();

      return () => {
        mounted = false;
      };
    }, [class_task_pk, dispatch]);

    useEffect(() => {
      // all_class_task_sub && form_edit_task.setValue(all_class_task_sub, 1);
      // return () => {};
    }, []);

    return (
      <TableContainer>
        <LinearLoadingProgress show={fetch_all_class_task_ques} />

        {user_type === "tutor" ? (
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
        ) : (
          all_class_task_sub && (
            <StudentQuestion all_class_task_sub={all_class_task_sub} />
          )
        )}
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

export default ManageTaskQuesView;

const StudentQuestion = ({ all_class_task_sub }) => {
  const dispatch = useDispatch();
  const form_edit_task = useForm({
    // resolver: yupResolver(validate_task),
    mode: "onBlur",
    defaultValues: {
      questions: all_class_task_sub,
    },
  });

  const { fields, append, prepend, remove, swap, move, insert } = useFieldArray(
    {
      control: form_edit_task.control,
      name: "questions",
    }
  );

  const handleSubmitFormTask = useCallback(
    (data) => {
      const payload = data.questions;

      console.log(`payload`, data);

      dispatch(
        setGeneralPrompt({
          open: true,
          continue_callback: () =>
            dispatch(
              ClassSessionTaskActions.addClassTaskSub(
                payload,
                (msg: string) => {
                  dispatch(
                    ClassSessionTaskActions.setAllClassTaskSub(
                      all_class_task_sub.class_task_pk
                    )
                  );
                }
              )
            ),
        })
      );
    },
    [all_class_task_sub.class_task_pk, dispatch]
  );

  return (
    <FormProvider {...form_edit_task}>
      <form
        id="submit-ques-form"
        onSubmit={form_edit_task.handleSubmit(handleSubmitFormTask)}
        noValidate
      >
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell width="5%">#</TableCell>
              <TableCell width="40%">Answer</TableCell>
              <TableCell width="55%">Questions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {fields.map((item, index) => (
              <TableRow key={index}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>
                  <div
                    style={{
                      display: `grid`,
                      gridGap: `.3em`,
                      fontWeight: 500,
                      fontSize: `.87em`,
                    }}
                  >
                    <TextFieldHookForm
                      name={`questions[${index}].answer`}
                      multiline={true}
                      rows={2}
                    />

                    <TextFieldHookForm
                      name={`questions[${index}].task_sub_pk`}
                      type="hidden"
                    />
                    <TextFieldHookForm
                      name={`questions[${index}].task_ques_pk`}
                      type="hidden"
                    />
                  </div>
                </TableCell>
                <TableCell>
                  <small className="ques">{item.question}</small>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <div
          style={{
            display: `grid`,
            justifyContent: `end`,
            justifyItems: `end`,
            width: `100%`,
            padding: `1em`,
          }}
        >
          <Button
            form="submit-ques-form"
            variant="contained"
            color="primary"
            type="submit"
          >
            Submit & Save Answers
          </Button>
        </div>
      </form>
    </FormProvider>
  );
};
