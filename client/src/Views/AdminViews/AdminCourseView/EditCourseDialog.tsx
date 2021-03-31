import { Button, Grid } from "@material-ui/core";
import { Form, Formik } from "formik";
import React, { FC, memo, useCallback } from "react";
import { useDispatch } from "react-redux";
import * as yup from "yup";
import FormDialog from "../../../Component/FormDialog/FormDialog";
import FormikInputField from "../../../Component/Formik/FormikInputField";
import FormikSelect from "../../../Component/Formik/FormikSelect";
import { CourseModel } from "../../../Services/Models/CourseModel";
import { DbCourseDurations } from "../../../Storage/LocalDatabase";
interface IEditCourseDialog {
  initial_form_values: CourseModel;
  open: boolean;
  handleClose: () => void;
}

const formSchema = yup.object({
  course_desc: yup.string().required().max(255).label("Course Description"),
  est_duration: yup
    .number()
    .moreThan(29, "Duration must be 30 minutes or above")
    .lessThan(361, "Duration must not exceed to 4hrs")
    .required()
    .max(150)
    .label("Estimated Duration"),
});

export const EditCourseDialog: FC<IEditCourseDialog> = memo(
  ({ initial_form_values, open, handleClose }) => {
    const dispatch = useDispatch();

    const handleFormSubmit = useCallback(
      async (payload: CourseModel) => {
        payload.course_pk = initial_form_values.course_pk;
        console.log(`payload`, payload);
        //   dispatch(
        //     setGeneralPrompt({
        //       open: true,
        //       continue_callback: () =>
        //         dispatch(
        //           addClassAction(form_values, (msg: string) => {
        //             setSuccessDialog({
        //               message: msg,
        //               open: true,
        //             });
        //           })
        //         ),
        //     })
        //   );
      },
      [dispatch]
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
                initialValues={initial_form_values}
                validationSchema={formSchema}
                validateOnChange={false}
                validateOnBlur={false}
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
                  >
                    <Grid container justify="center" spacing={3}>
                      <Grid xs={12} item>
                        <FormikInputField
                          name="course_desc"
                          label="Course Description"
                          placeholder="Enter course description"
                          variant="outlined"
                          InputLabelProps={{ shrink: true }}
                          fullWidth
                          required
                        />
                      </Grid>

                      <Grid xs={6} item>
                        <FormikSelect
                          data={DbCourseDurations}
                          label="Est. Duration"
                          name="est_duration"
                          InputLabelProps={{ shrink: true }}
                          variant="outlined"
                          required
                          fullWidth
                        />
                      </Grid>

                      <Grid xs={12} item>
                        <FormikInputField
                          label="Notes/Notice"
                          name="notes"
                          placeholder="Write some notes here..."
                          variant="outlined"
                          InputLabelProps={{ shrink: true }}
                          fullWidth
                          multiline={true}
                          rows={6}
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

export default EditCourseDialog;
