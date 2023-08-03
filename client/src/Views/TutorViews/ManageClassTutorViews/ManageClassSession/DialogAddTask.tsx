import { yupResolver } from "@hookform/resolvers/yup";
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
import DeleteRoundedIcon from "@material-ui/icons/DeleteRounded";
import React, { FC, memo, useCallback, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { useParams } from "react-router";
import * as Yup from "yup";
import FormDialog from "../../../../Component/FormDialog/FormDialog";
import DateFieldHookForm from "../../../../Component/HookForm/DateFieldHookForm";
import TextFieldHookForm from "../../../../Component/HookForm/TextFieldHookForm";
import ClassSessionTaskActions from "../../../../Services/Actions/ClassSessionTaskActions";
import {
  setGeneralPrompt,
  setSnackbar,
} from "../../../../Services/Actions/PageActions";
import {
  SessionTaskModel,
  SessionTaskQuesModel,
} from "../../../../Services/Models/ClassSessionTaskModels";
import convertObjectToFormData from "../../../../Helpers/convertObjectToFormData";
import { fileToBase64 } from "../../../../Hooks/UseFileConverter";
import moment from "moment";
interface IDialogAddTask {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const validationSchema = Yup.object({
  task_title: Yup.string().required().label("Task Title"),
  task_desc: Yup.string().required().label("Task Description"),
  due_date: Yup.string().nullable().required().label("Due Date"),
});

const validate_add_task = Yup.object({
  question: Yup.string().required().label("Question"),
  cor_answer: Yup.string().required().label("Correct Answert"),
  pnt: Yup.number().min(0).nullable().required().label("Point"),
});

export const DialogAddTask: FC<IDialogAddTask> = memo(({ open, setOpen }) => {
  const params = useParams<any>();
  const dispatch = useDispatch();
  const form_create_task = useForm({
    resolver: yupResolver(validationSchema),
  });

  const [open_add_ques, set_open_add_ques] = useState(false);
  const [file, set_file] = useState<any>();

  const [questions, set_questions] = useState<Array<SessionTaskQuesModel>>([]);

  const handleSetOpenAddQuest = useCallback((open: boolean) => {
    set_open_add_ques(open);
  }, []);

  const form_add_task = useForm({
    resolver: yupResolver(validate_add_task),
  });

  const handleChangeInput = (e) => {
    if (e.target.files[0]) {
      set_file(e.target.files[0]);
    }
  };

  const handleSubmitFormTask = useCallback(
    async (data) => {
      const payload: SessionTaskModel = {
        class_pk: params.class_pk,
        ...data,
        // due_date: moment(data.due_date).format("YYYY-MM-DD"),
        questions: questions,
        // file: file,
      };

      console.log(`payload`, payload);

      // const formData: any = convertObjectToFormData(payload);

      // questions?.forEach((p, i) => {
      //   formData.append(`questions[]['class_task_pk']`, p.class_task_pk + ``);
      //   formData.append(`questions[]['question']`, p.question);
      //   formData.append(`questions[]['cor_answer']`, p.cor_answer);
      //   formData.append(`questions[]['pnt']`, p.pnt + ``);
      // });

      // formData.append(`file`, file);

      dispatch(
        setGeneralPrompt({
          open: true,
          continue_callback: () =>
            dispatch(
              ClassSessionTaskActions.addClassTaskAction(
                payload,
                (msg: string) => {
                  setOpen(false);
                  form_create_task.reset();
                  dispatch(
                    ClassSessionTaskActions.setAllClassTask(params.class_pk)
                  );
                }
              )
            ),
        })
      );
    },
    [dispatch, form_create_task, params.class_pk, questions, setOpen]
  );

  const handleSubmitFormAddTask = useCallback(
    (form_data) => {
      set_questions((q) => [...q, form_data]);

      dispatch(setSnackbar("The question has been added", "success"));

      set_open_add_ques(false);
    },
    [dispatch]
  );

  return (
    <FormDialog
      open={open}
      title="Create a New Task"
      handleClose={() => setOpen(false)}
      scroll="paper"
      body={
        <div style={{ padding: `1em 0`, display: `grid`, gridGap: `2em` }}>
          <FormProvider {...form_create_task}>
            <form
              id="remarks-form"
              onSubmit={form_create_task.handleSubmit(handleSubmitFormTask)}
              noValidate
            >
              <Grid spacing={3} container>
                <Grid item xs={6}>
                  <TextFieldHookForm
                    name="task_title"
                    defaultValue=""
                    label="Task Title"
                    fullWidth
                    variant="outlined"
                    required
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>

                <Grid item xs={6}>
                  <DateFieldHookForm
                    name="due_date"
                    type="datetime"
                    fullWidth={true}
                    InputLabelProps={{ shrink: true }}
                    inputVariant={"outlined"}
                    disablePast
                    defaultValue={null}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextFieldHookForm
                    name="task_desc"
                    defaultValue=""
                    label="Task Description"
                    multiline={true}
                    rows={3}
                    fullWidth
                    variant="outlined"
                    required
                    InputLabelProps={{ shrink: true }}
                    placeholder="Write the class description and/or instructions here..."
                  />
                </Grid>

                {/* <Grid item xs={12}>
                  <input
                    accept=".docx,.pdf,.doc,.rtf,.pptx,.ppt,image/*"
                    id="contained-button-file"
                    type="file"
                    onChange={(e) => {
                      handleChangeInput(e);
                    }}
                  />
                </Grid> */}
              </Grid>
            </form>
          </FormProvider>

          <Grid container spacing={2}>
            <Grid item xs={12} container justify="flex-end">
              <Grid item>
                <Button
                  color="primary"
                  onClick={() => {
                    handleSetOpenAddQuest(true);
                  }}
                >
                  Add Question
                </Button>
              </Grid>
            </Grid>
            <Grid item xs={12}>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell width="5%">#</TableCell>
                      <TableCell width="85%">Question Details</TableCell>
                      <TableCell width="10%">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {questions.map((q, i) => (
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
                              set_questions((q) => {
                                q.splice(i, 1);
                                return [...q];
                              });
                            }}
                          >
                            <DeleteRoundedIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
            <FormDialog
              title={"Add Question to the Task"}
              minWidth={450}
              open={open_add_ques}
              body={
                <div style={{ padding: `1em` }}>
                  <FormProvider {...form_add_task}>
                    <form
                      id="add-question-form"
                      onSubmit={form_add_task.handleSubmit(
                        handleSubmitFormAddTask
                      )}
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
                handleSetOpenAddQuest(false);
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
          </Grid>
        </div>
      }
      actions={
        <>
          <Button
            variant="contained"
            form="remarks-form"
            type="submit"
            onClick={() => {
              // formRef.current?.submit();
            }}
            color="primary"
          >
            Save Task
          </Button>
        </>
      }
    />
  );
});

export default DialogAddTask;
