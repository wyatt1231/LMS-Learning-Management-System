import { Button, Grid } from "@material-ui/core";
import { Form, Formik } from "formik";
import React, { FC, memo, useCallback } from "react";
import { useDispatch } from "react-redux";
import * as yup from "yup";
import FormDialog from "../../../Component/FormDialog/FormDialog";
import FormikInputField from "../../../Component/Formik/FormikInputField";
import ClassActions, {
  setSelectedClassAction,
} from "../../../Services/Actions/ClassActions";
import { setGeneralPrompt } from "../../../Services/Actions/PageActions";
import { ClassModel } from "../../../Services/Models/ClassModel";
interface IEditClassStatusDialog {
  new_sts: "a" | "e" | "d";
  initial_values: ClassModel;
  open: boolean;
  handleClose: () => void;
}

const formSchema = yup.object({
  remarks: yup.string().required().max(255).label("Remarks"),
});

export const EditClassStatusDialog: FC<IEditClassStatusDialog> = memo(
  ({ new_sts, initial_values, open, handleClose }) => {
    const dispatch = useDispatch();

    const handleFormSubmit = useCallback(
      async (form_values: ClassModel) => {
        if (new_sts === "a") {
          dispatch(
            setGeneralPrompt({
              open: true,
              continue_callback: () =>
                dispatch(
                  ClassActions.approveClass(form_values, (msg: string) => {
                    dispatch(setSelectedClassAction(form_values.class_pk));
                    handleClose();
                  })
                ),
            })
          );
        } else if (new_sts === "d") {
          dispatch(
            setGeneralPrompt({
              open: true,
              continue_callback: () =>
                dispatch(
                  ClassActions.declineClass(form_values, (msg: string) => {
                    dispatch(setSelectedClassAction(form_values.class_pk));
                    handleClose();
                  })
                ),
            })
          );
        } else if (new_sts === "e") {
          dispatch(
            setGeneralPrompt({
              open: true,
              continue_callback: () =>
                dispatch(
                  ClassActions.endClass(form_values, (msg: string) => {
                    dispatch(setSelectedClassAction(form_values.class_pk));
                    handleClose();
                  })
                ),
            })
          );
        }
      },
      [dispatch, handleClose, new_sts]
    );

    return (
      <>
        <FormDialog
          open={open}
          title="Edit Class Details"
          handleClose={() => handleClose()}
          minWidth={500}
          maxWidth="xs"
          body={
            <div>
              <Formik
                initialValues={initial_values}
                validationSchema={formSchema}
                validateOnChange={false}
                validateOnBlur={false}
                onSubmit={handleFormSubmit}
              >
                {() => (
                  <Form
                    id="form-edit-class-status"
                    style={{
                      backgroundColor: `#fff`,
                      borderRadius: 10,
                      padding: `1em 3em`,
                    }}
                  >
                    <Grid container justify="center" spacing={3}>
                      <Grid xs={12} item>
                        <FormikInputField
                          name="remarks"
                          label="Class Remarks"
                          placeholder="Write the class remarks here"
                          variant="outlined"
                          InputLabelProps={{ shrink: true }}
                          fullWidth
                          multiline={true}
                          rows={15}
                        />
                      </Grid>
                    </Grid>
                  </Form>
                )}
              </Formik>
            </div>
          }
          actions={
            <>
              <Button
                type="submit"
                form="form-edit-class-status"
                color="primary"
                variant="contained"
              >
                Save Changes
              </Button>
            </>
          }
        />
      </>
    );
  }
);

export default EditClassStatusDialog;
