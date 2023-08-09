import {
  Button,
  Checkbox,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from "@material-ui/core";
import React, { FC, memo, useCallback, useEffect } from "react";
import {
  Controller,
  FormProvider,
  useFieldArray,
  useForm,
} from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import FormDialog from "../../../Component/FormDialog/FormDialog";
import TextFieldHookForm from "../../../Component/HookForm/TextFieldHookForm";
import ClassSessionTaskActions from "../../../Services/Actions/ClassSessionTaskActions";
import { setGeneralPrompt } from "../../../Services/Actions/PageActions";
import { SessionTaskSubModel } from "../../../Services/Models/ClassSessionTaskModels";

interface ViewSubmissionDialogProps {
  selected_submission: SessionTaskSubModel;
  open: boolean;
  handleViewSubmitDtls: any;
  class_task_pk: number;
}

// const validate_task_ques = Yup.object({
//   is_corrent: Yup.string().required().label("Correct Answert"),
// });

export const ViewSubmissionDialog: FC<ViewSubmissionDialogProps> = memo(
  ({ selected_submission, class_task_pk, open, handleViewSubmitDtls }) => {
    const dispatch = useDispatch();
    const form_edit_task_ques = useForm<SessionTaskSubModel>({
      mode: "onBlur",
      defaultValues: {
        questions: selected_submission.questions,
      },
    });

    // const all_class_task_ques = useSelector(
    //   (store: RootStore) => store.ClassSessionTaskReducer.all_class_task_ques
    // );

    const { fields } = useFieldArray({
      control: form_edit_task_ques.control,
      name: "questions",
    });

    const handleSubmitFormTask = useCallback(
      (data) => {
        const payload: SessionTaskSubModel[] = [];

        data?.questions?.forEach((element) => {
          payload.push({
            is_correct:
              element.is_correct === "y" || element.is_correct == true
                ? "y"
                : "n",
            task_sub_pk: element.task_sub_pk,
            tutor_comment: element.tutor_comment,
          });
        });

        dispatch(
          setGeneralPrompt({
            open: true,
            continue_callback: () =>
              dispatch(
                ClassSessionTaskActions.updateTaskSub(
                  payload,
                  (msg: string) => {
                    form_edit_task_ques.reset();
                    dispatch(
                      ClassSessionTaskActions.setAllStudentsSubmit(
                        class_task_pk
                      )
                    );
                    handleViewSubmitDtls(false);
                  }
                )
              ),
          })
        );
      },
      [class_task_pk, dispatch, form_edit_task_ques, handleViewSubmitDtls]
    );

    return (
      <FormDialog
        title="View Student Submission"
        open={open}
        minWidth={950}
        handleClose={() => {
          handleViewSubmitDtls();
        }}
        body={
          <div style={{ padding: `1em` }}>
            <FormProvider {...form_edit_task_ques}>
              <form
                id="task-sub-ques-form"
                onSubmit={form_edit_task_ques.handleSubmit(
                  handleSubmitFormTask
                )}
                noValidate
              >
                <Grid spacing={3} container>
                  <TableContainer>
                    {/* <LinearLoadingProgress show={fetch_all_student_submit} /> */}
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell width="5%">#</TableCell>
                          <TableCell width="5%">Check</TableCell>
                          <TableCell width="20%">Answer</TableCell>
                          <TableCell width="20%">Question</TableCell>
                          <TableCell width="5%">Points</TableCell>
                          <TableCell width="40%">Comment</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {fields.map((item, index) => (
                          <TableRow key={index}>
                            <TableCell>{index + 1}</TableCell>
                            <TableCell>
                              <Controller
                                name={`questions[${index}].is_correct`}
                                control={form_edit_task_ques.control}
                                render={(props) => (
                                  <Checkbox
                                    {...props}
                                    defaultChecked={item.is_correct == "y"}
                                    onChange={(e) =>
                                      props.onChange(e.target.checked)
                                    }
                                  />
                                )}
                              />
                              <TextFieldHookForm
                                name={`questions[${index}].task_sub_pk`}
                                type="hidden"
                              />
                            </TableCell>
                            <TableCell>
                              <small className="ques">{item.answer}</small>
                            </TableCell>

                            <TableCell>
                              <small className="ques">Q: {item.question}</small>
                              <div>
                                A: <small>{item.answer}</small>
                              </div>
                            </TableCell>

                            <TableCell>
                              <small className="ques">{item.pnt}</small>
                            </TableCell>

                            <TableCell>
                              <Controller
                                name={`questions[${index}].tutor_comment`}
                                control={form_edit_task_ques.control}
                                render={(props) => (
                                  <TextField
                                    {...props}
                                    defaultValue={item.tutor_comment}
                                    inputProps={{
                                      style: { fontSize: `.87em`, padding: 0 },
                                    }}
                                    InputProps={{
                                      style: { padding: `.5em` },
                                    }}
                                    rows={2}
                                    fullWidth={true}
                                    multiline={true}
                                    variant="outlined"
                                    placeholder="Write your comment here...."
                                    onChange={(e) =>
                                      props.onChange(e.target.value)
                                    }
                                  />
                                )}
                              />
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Grid>
              </form>
            </FormProvider>
          </div>
        }
        actions={
          <>
            <Button
              type="submit"
              form="task-sub-ques-form"
              variant="contained"
              color="primary"
            >
              Submit Work
            </Button>
          </>
        }
      />
    );
  }
);

export default ViewSubmissionDialog;
