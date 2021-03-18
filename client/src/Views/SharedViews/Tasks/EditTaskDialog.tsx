import { yupResolver } from "@hookform/resolvers/yup";
import { Grid, Button } from "@material-ui/core";
import React, { memo, FC } from "react";
import { useForm, FormProvider } from "react-hook-form";
import FormDialog from "../../../Component/FormDialog/FormDialog";
import DateFieldHookForm from "../../../Component/HookForm/DateFieldHookForm";
import TextFieldHookForm from "../../../Component/HookForm/TextFieldHookForm";
import { SessionTaskModel } from "../../../Services/Models/ClassSessionTaskModels";
import * as Yup from "yup";
import { useCallback } from "react";
import ClassSessionTaskActions from "../../../Services/Actions/ClassSessionTaskActions";
import { setGeneralPrompt } from "../../../Services/Actions/PageActions";
import { useDispatch } from "react-redux";

interface IEditTaskDialog {
  task: SessionTaskModel;
  open: boolean;
  handleSetOpenEditTask: (open: boolean) => void;
}

const validate_task = Yup.object({
  task_title: Yup.string().required().label("Task Title"),
  task_desc: Yup.string().required().label("Task Description"),
  due_date: Yup.string().nullable().required().label("Due Date"),
});

export const EditTaskDialog: FC<IEditTaskDialog> = memo(
  ({ task, open, handleSetOpenEditTask }) => {
    const dispatch = useDispatch();
    const form_edit_task = useForm({
      resolver: yupResolver(validate_task),
      mode: "onBlur",
      defaultValues: {
        task_title: task.task_title,
        task_desc: task.task_desc,
        due_date: task.due_date,
      },
    });

    const handleSubmitFormTask = useCallback(
      (data) => {
        const payload: SessionTaskModel = {
          ...data,
          class_task_pk: task.class_task_pk,
        };

        dispatch(
          setGeneralPrompt({
            open: true,
            continue_callback: () =>
              dispatch(
                ClassSessionTaskActions.updateClassMaterialAction(
                  payload,
                  (msg: string) => {
                    form_edit_task.reset();
                    dispatch(
                      ClassSessionTaskActions.setSingleClassTask(
                        payload.class_task_pk
                      )
                    );
                    handleSetOpenEditTask(false);
                  }
                )
              ),
          })
        );
      },
      [dispatch, form_edit_task, handleSetOpenEditTask, task.class_task_pk]
    );

    return (
      <FormDialog
        title="Edit Task Details"
        open={open}
        handleClose={() => {
          handleSetOpenEditTask(false);
        }}
        body={
          <div style={{ padding: `1em` }}>
            <FormProvider {...form_edit_task}>
              <form
                id="task-form"
                onSubmit={form_edit_task.handleSubmit(handleSubmitFormTask)}
                noValidate
              >
                <Grid spacing={3} container>
                  <Grid item xs={6}>
                    <TextFieldHookForm
                      name="task_title"
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
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <TextFieldHookForm
                      name="task_desc"
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
                </Grid>
              </form>
            </FormProvider>
          </div>
        }
        actions={
          <>
            <Button
              type="submit"
              form="task-form"
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

export default EditTaskDialog;
