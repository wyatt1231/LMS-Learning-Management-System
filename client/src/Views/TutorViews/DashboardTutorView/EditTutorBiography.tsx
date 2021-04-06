import { Button, Grid } from "@material-ui/core";
import { Form, Formik } from "formik";
import React, { FC, memo, useCallback } from "react";
import { useDispatch } from "react-redux";
import * as yup from "yup";
import FormDialog from "../../../Component/FormDialog/FormDialog";
import FormikInputField from "../../../Component/Formik/FormikInputField";
import { setGeneralPrompt } from "../../../Services/Actions/PageActions";
import TutorActions from "../../../Services/Actions/TutorActions";
import { TutorModel } from "../../../Services/Models/TutorModels";
interface IEditTutorBiography {
  initial_form_values: TutorModel;
  open: boolean;
  handleClose: () => void;
}

const formSchema = yup.object({
  bio: yup.string().required().max(800).label("Biography"),
});

export const EditTutorBiography: FC<IEditTutorBiography> = memo(
  ({ initial_form_values, open, handleClose }) => {
    const dispatch = useDispatch();

    const handleFormSubmit = useCallback(
      async (payload: TutorModel) => {
        payload.tutor_pk = initial_form_values.tutor_pk;
        dispatch(
          setGeneralPrompt({
            open: true,
            continue_callback: () =>
              dispatch(
                TutorActions.updateLoggedInTutorBio(payload, (msg: string) => {
                  dispatch(TutorActions.getLoggedInTutor());
                  handleClose();
                })
              ),
          })
        );
      },
      [dispatch, handleClose, initial_form_values.tutor_pk]
    );

    return (
      <>
        <FormDialog
          open={open}
          title="Update Your Biography"
          handleClose={() => handleClose()}
          minWidth={500}
          maxWidth="xs"
          body={
            <div>
              <Formik
                initialValues={initial_form_values}
                validationSchema={formSchema}
                onSubmit={handleFormSubmit}
              >
                {({ values, errors, touched, setFieldValue, submitCount }) => (
                  <Form
                    id="form-edit-course"
                    style={{
                      backgroundColor: `#fff`,
                      borderRadius: 10,
                      padding: `1em 3em`,
                    }}
                    noValidate
                  >
                    <Grid container justify="center" spacing={3}>
                      <Grid xs={12} item>
                        <FormikInputField
                          label="Your Biography"
                          placeholder="Write your biography here..."
                          name="bio"
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
                form="form-edit-course"
                type="submit"
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

export default EditTutorBiography;
