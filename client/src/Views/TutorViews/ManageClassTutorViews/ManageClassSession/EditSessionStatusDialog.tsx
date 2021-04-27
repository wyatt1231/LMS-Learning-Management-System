import { Button, Grid } from "@material-ui/core";
import { Form, Formik } from "formik";
import React, { FC, memo, useCallback } from "react";
import { useDispatch } from "react-redux";
import * as yup from "yup";
import FormDialog from "../../../../Component/FormDialog/FormDialog";
import FormikInputField from "../../../../Component/Formik/FormikInputField";
import ClassSessionActions, {
  setSingleClassSession,
} from "../../../../Services/Actions/ClassSessionActions";
import { setGeneralPrompt } from "../../../../Services/Actions/PageActions";
import { ClassSessionModel } from "../../../../Services/Models/ClassSessionModel";

interface IEditSessionStatusDialog {
  new_sts: "s" | "e" | "u";
  initial_values: ClassSessionModel;
  open: boolean;
  handleClose: () => void;
}

const formSchema = yup.object({
  remarks: yup.string().required().max(255).label("Remarks"),
});

export const EditSessionStatusDialog: FC<IEditSessionStatusDialog> = memo(
  ({ new_sts, initial_values, open, handleClose }) => {
    const dispatch = useDispatch();

    const handleFormSubmit = useCallback(
      async (form_values: ClassSessionModel) => {
        if (new_sts === "s") {
          dispatch(
            setGeneralPrompt({
              open: true,
              continue_callback: () =>
                dispatch(
                  ClassSessionActions.startClassSession(
                    form_values,
                    (msg: string) => {
                      dispatch(setSingleClassSession(form_values.session_pk));
                      handleClose();
                    }
                  )
                ),
            })
          );
        } else if (new_sts === "e") {
          dispatch(
            setGeneralPrompt({
              open: true,
              continue_callback: () =>
                dispatch(
                  ClassSessionActions.endClassSession(
                    form_values,
                    (msg: string) => {
                      dispatch(setSingleClassSession(form_values.session_pk));
                      handleClose();
                    }
                  )
                ),
            })
          );
        } else if (new_sts === "u") {
          dispatch(
            setGeneralPrompt({
              open: true,
              continue_callback: () =>
                dispatch(
                  ClassSessionActions.unattendedClassSession(
                    form_values,
                    (msg: string) => {
                      dispatch(setSingleClassSession(form_values.session_pk));
                      handleClose();
                    }
                  )
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
          title="Update Class Session Remarks"
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
                    id="form-edit-class-session-status"
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
                form="form-edit-class-session-status"
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

export default EditSessionStatusDialog;
