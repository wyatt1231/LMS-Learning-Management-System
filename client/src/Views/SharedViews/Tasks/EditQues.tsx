import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Grid } from "@material-ui/core";
import React, { FC, memo, useCallback } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import * as Yup from "yup";
import FormDialog from "../../../Component/FormDialog/FormDialog";
import TextFieldHookForm from "../../../Component/HookForm/TextFieldHookForm";
import ClassSessionTaskActions from "../../../Services/Actions/ClassSessionTaskActions";
import { setGeneralPrompt } from "../../../Services/Actions/PageActions";
import { SessionTaskQuesModel } from "../../../Services/Models/ClassSessionTaskModels";

interface EditQuesProps {
  task_ques: SessionTaskQuesModel;
  open: boolean;
  handleSetOpenEditQues: (open: boolean) => void;
}

const validate_task_ques = Yup.object({
  question: Yup.string().required().label("Question"),
  cor_answer: Yup.string().required().label("Correct Answert"),
  pnt: Yup.number().min(0).nullable().required().label("Point"),
});

export const EditQues: FC<EditQuesProps> = memo(
  ({ task_ques, open, handleSetOpenEditQues }) => {
    const dispatch = useDispatch();
    const form_edit_task_ques = useForm({
      resolver: yupResolver(validate_task_ques),
      mode: "onBlur",
      defaultValues: {
        question: task_ques.question,
        cor_answer: task_ques.cor_answer,
        pnt: task_ques.pnt,
      },
    });

    const handleSubmitFormTask = useCallback(
      (data) => {
        const payload: SessionTaskQuesModel = {
          ...data,
          task_ques_pk: task_ques.task_ques_pk,
        };

        console.log(`payload`, payload);

        dispatch(
          setGeneralPrompt({
            open: true,
            continue_callback: () =>
              dispatch(
                ClassSessionTaskActions.updateClassTaskQues(
                  payload,
                  (msg: string) => {
                    form_edit_task_ques.reset();
                    dispatch(
                      ClassSessionTaskActions.setAllClassTaskQues(
                        task_ques.class_task_pk
                      )
                    );
                    handleSetOpenEditQues(false);
                  }
                )
              ),
          })
        );
      },
      [
        dispatch,
        form_edit_task_ques,
        handleSetOpenEditQues,
        task_ques.class_task_pk,
        task_ques.task_ques_pk,
      ]
    );

    return (
      <FormDialog
        title="Edit Task Details"
        open={open}
        handleClose={() => {
          handleSetOpenEditQues(false);
        }}
        body={
          <div style={{ padding: `1em` }}>
            <FormProvider {...form_edit_task_ques}>
              <form
                id="task-ques-form"
                onSubmit={form_edit_task_ques.handleSubmit(
                  handleSubmitFormTask
                )}
                noValidate
              >
                <Grid spacing={3} container>
                  <Grid item xs={12}>
                    <TextFieldHookForm
                      name="question"
                      label="Question"
                      fullWidth
                      variant="outlined"
                      required
                      multiline={true}
                      rows={4}
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <TextFieldHookForm
                      name="cor_answer"
                      label="Correct Answer"
                      fullWidth
                      variant="outlined"
                      required
                      multiline={true}
                      rows={2}
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <TextFieldHookForm
                      name="pnt"
                      label="Points"
                      type="number"
                      fullWidth
                      variant="outlined"
                      required
                      InputLabelProps={{ shrink: true }}
                      placeholder="Write the class description and/or instructions here..."
                    />
                  </Grid>
                </Grid>
              </form>
            </FormProvider>
          </div>
        }
        actions={
          <>
            <Button
              type="submit"
              form="task-ques-form"
              variant="contained"
              color="primary"
            >
              Save Changes
            </Button>
          </>
        }
      />
    );
  }
);

export default EditQues;
