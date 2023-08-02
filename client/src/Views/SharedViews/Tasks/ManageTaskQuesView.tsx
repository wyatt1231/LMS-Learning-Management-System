import {
  Button,
  Grid,
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
import {
  setGeneralPrompt,
  setSnackbar,
} from "../../../Services/Actions/PageActions";
import {
  SessionTaskQuesModel,
  SessionTaskSubFileModel,
} from "../../../Services/Models/ClassSessionTaskModels";
import { RootStore } from "../../../Services/Store";
import EditQues from "./EditQues";
import { yupResolver } from "@hookform/resolvers/yup";
import FormDialog from "../../../Component/FormDialog/FormDialog";
import * as Yup from "yup";
import convertObjectToFormData from "../../../Helpers/convertObjectToFormData";
import FileViwer from "../../../Component/FileViewer";
import { API_BASE_URL } from "../../../Helpers/AppConfig";

interface IManageTaskQuesView {
  class_task_pk: number;
}

const validate_add_task = Yup.object({
  question: Yup.string().required().label("Question"),
  cor_answer: Yup.string().required().label("Correct Answert"),
  pnt: Yup.number().min(0).nullable().required().label("Point"),
});

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

    const user_type = useSelector(
      (store: RootStore) => store.UserReducer?.user?.user_type
    );

    const [open_add_ques, set_open_add_ques] = useState(false);
    const [open_edit_ques, set_open_edit_ques] = useState(false);
    const [selected_task_ques, set_selected_task_ques] =
      useState<null | SessionTaskQuesModel>(null);

    const handleSetOpenEditQues = useCallback((open: boolean) => {
      set_open_edit_ques(open);
    }, []);

    const form_add_task = useForm({
      resolver: yupResolver(validate_add_task),
    });

    const handleSubmitFormAddTask = useCallback(
      (form_data) => {
        // set_questions((q) => [...q, form_data]);

        const payload = {
          ...form_data,
          class_task_pk: class_task_pk,
        };

        //  dispatch(setSnackbar("The question has been added", "success"));

        dispatch(
          ClassSessionTaskActions.addClassTaskQues(payload, (msg: string) => {
            set_open_add_ques(false);
            form_add_task.reset();
            dispatch(
              ClassSessionTaskActions.setAllClassTaskQues(class_task_pk)
            );
          })
        );
      },
      [dispatch]
    );

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

    return (
      <TableContainer>
        <LinearLoadingProgress show={fetch_all_class_task_ques} />

        {user_type === "tutor" ? (
          <>
            <Grid container spacing={2}>
              <Grid item xs={12} container justify="flex-end">
                <Grid item>
                  <Button
                    color="primary"
                    onClick={() => {
                      set_open_add_ques((state) => !state);
                    }}
                  >
                    Add Question
                  </Button>
                </Grid>
              </Grid>
            </Grid>
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
          </>
        ) : (
          !!all_class_task_sub && (
            <StudentQuestion
              all_class_task_sub={all_class_task_sub}
              class_task_pk={class_task_pk}
            />
          )
        )}
        {selected_task_ques && open_edit_ques && (
          <EditQues
            handleSetOpenEditQues={handleSetOpenEditQues}
            open={open_edit_ques}
            task_ques={selected_task_ques}
          />
        )}

        <FormDialog
          title={"Add Question to the Task"}
          minWidth={450}
          open={open_add_ques}
          body={
            <div style={{ padding: `1em` }}>
              <FormProvider {...form_add_task}>
                <form
                  id="add-question-form"
                  onSubmit={form_add_task.handleSubmit(handleSubmitFormAddTask)}
                  noValidate
                >
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <TextFieldHookForm
                        name="question"
                        label="Question"
                        multiline={true}
                        rows={3}
                        fullWidth
                        variant="outlined"
                        required
                        InputLabelProps={{ shrink: true }}
                        placeholder="Write the question here..."
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextFieldHookForm
                        name="cor_answer"
                        label="Answer"
                        multiline={true}
                        rows={3}
                        fullWidth
                        variant="outlined"
                        required
                        InputLabelProps={{ shrink: true }}
                        placeholder="Write the answer of the question here..."
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextFieldHookForm
                        name="pnt"
                        defaultValue={1}
                        label="Point"
                        type="number"
                        fullWidth
                        variant="outlined"
                        required
                        InputLabelProps={{ shrink: true }}
                      />
                    </Grid>
                  </Grid>
                </form>
              </FormProvider>
            </div>
          }
          handleClose={() => {
            set_open_add_ques(false);
          }}
          actions={
            <>
              <Button
                variant="contained"
                color="primary"
                form="add-question-form"
                type="submit"
              >
                Add Question
              </Button>
            </>
          }
        />
      </TableContainer>
    );
  }
);

export default ManageTaskQuesView;
const StudentQuestion = ({ all_class_task_sub, class_task_pk }) => {
  const dispatch = useDispatch();
  const form_edit_task = useForm({
    // resolver: yupResolver(validate_task),
    mode: "onBlur",
    defaultValues: {
      questions: all_class_task_sub,
    },
  });

  const single_class_task = useSelector(
    (store: RootStore) => store.ClassSessionTaskReducer.single_class_task
  );

  const [previewed_file, set_previewed_file] = useState(``);

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
                  // dispatch(
                  //   setSnackbar(`Your answers have been submitted`, `success`)
                  // );
                  // dispatch(
                  //   ClassSessionTaskActions.setAllClassTaskSub(
                  //     all_class_task_sub.class_task_pk
                  //   )
                  // );
                }
              )
            ),
        })
      );
    },
    [all_class_task_sub.class_task_pk, dispatch]
  );

  // useEffect(() => {
  //   let mounted = true;

  //   const load = () => {
  //     console.log(`all_class_task_sub`, all_class_task_sub);
  //   };

  //   mounted && load();

  //   return () => {
  //     mounted = false;
  //   };
  // }, [all_class_task_sub, dispatch]);

  // useEffect(() => {
  //   form_edit_task.reset({
  //     questions: all_class_task_sub,
  //   });
  // }, [all_class_task_sub]);

  return (
    <>
      <FormProvider {...form_edit_task}>
        <form
          id="submit-ques-form"
          onSubmit={form_edit_task.handleSubmit(handleSubmitFormTask)}
          noValidate
        >
          <div style={{ margin: "1em 0" }}>
            <small style={{ marginBottom: ".5em" }}>
              Upload your answer attachment here
            </small>
            <div>
              <input
                accept=".docx,.pdf,.doc,.rtf,.pptx,.ppt,image/*"
                id="contained-button-file"
                type="file"
                onChange={(e: any) => {
                  const f = e.target.files[0];

                  if (!!f) {
                    const payload: SessionTaskSubFileModel = {
                      class_task_pk: class_task_pk,
                      submit_type: `student`,
                      file: e.target.files[0],
                    };

                    const formData: any = convertObjectToFormData(payload);

                    dispatch(
                      ClassSessionTaskActions.addClassTaskFileSub(
                        formData,
                        (msg: string) => {
                          dispatch(
                            ClassSessionTaskActions.setAllClassTaskSub(
                              class_task_pk
                            )
                          );
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
              />
            </div>
          </div>
          <div style={{ margin: "1em 0" }}>
            <small
              className="link"
              style={{ marginBottom: ".5em" }}
              onClick={() => {
                set_previewed_file(null);
                if (all_class_task_sub?.length > 0) {
                  set_previewed_file(all_class_task_sub[0]?.stu_ans_file_loc);
                } else {
                  dispatch(setSnackbar(`No student file is attached`, `error`));
                }
              }}
            >
              Preview Student Answer Attachment
            </small>
            <div style={{ margin: ".5em 0" }}></div>
            <small
              className="link"
              style={{ marginBottom: ".5em" }}
              onClick={() => {
                set_previewed_file(null);

                if (all_class_task_sub?.length > 0) {
                  set_previewed_file(all_class_task_sub[0]?.tut_file_loc);
                } else {
                  dispatch(setSnackbar(`No tutor file is attached`, `error`));
                }
              }}
            >
              Preview Tutor Reply Attachment
            </small>
          </div>

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
              disabled={single_class_task?.allow_submit != "y"}
            >
              Submit & Save Answers
            </Button>
            {single_class_task?.allow_submit != "y" && (
              <small className="error" style={{ marginTop: `.5em` }}>
                Submission for this task is not yet allowed!
              </small>
            )}
          </div>
        </form>
      </FormProvider>
      {!!previewed_file && (
        <FormDialog
          open={!!previewed_file}
          handleClose={() => set_previewed_file(null)}
          title={previewed_file}
          fullScreen={true}
          body={<FileViwer file={`${API_BASE_URL}${previewed_file}`} />}
        />
      )}
    </>
  );
};
