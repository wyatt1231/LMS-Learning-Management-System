import { Button, Grid } from "@material-ui/core";
import { Form, Formik } from "formik";
import React, { FC, memo, useCallback } from "react";
import { useDispatch } from "react-redux";
import * as yup from "yup";
import FormDialog from "../../../Component/FormDialog/FormDialog";
import FormikInputField from "../../../Component/Formik/FormikInputField";
import FormikSelect from "../../../Component/Formik/FormikSelect";
import { ClassModel } from "../../../Services/Models/ClassModel";
import { DbClassTypes } from "../../../Storage/LocalDatabase";
interface IEditClassAdminDialog {
  initial_form_values: ClassModel;
  open_edit_class: boolean;
  handleOpenEditClass: () => void;
  handleCloseEditClass: () => void;
}

const formSchema = yup.object({
  class_desc: yup.string().required().max(255).label("Class Description"),
  course_pk: yup.string().nullable().required().max(255).label("Course"),
  course_desc: yup.string().required().max(255).label("Course"),
  course_duration: yup.string().required().max(255).label("Class Duration"),
  room_pk: yup.string().nullable().required().max(255).label("Room"),
  room_desc: yup.string().required().max(255).label("Room"),
  class_type: yup.string().required().max(255).label("Class Type"),
  tutor_pk: yup.string().nullable().required().max(255).label("Tutor"),
  tutor_name: yup.string().required().max(255).label("Tutor"),
  start_date: yup.date().nullable().required().label("Start Date"),
  start_time: yup.string().required().max(255).label("Start Time"),
  end_time: yup.string().required().max(255).label("End Time"),
  session_count: yup
    .number()
    .required()
    .moreThan(0)
    .lessThan(11)
    .label("Number of sessions"),
  class_sessions: yup.array().min(1, "Please select at least one date"),
});

export const EditClassAdminDialog: FC<IEditClassAdminDialog> = memo(
  ({
    initial_form_values,
    open_edit_class,
    handleOpenEditClass,
    handleCloseEditClass,
  }) => {
    const dispatch = useDispatch();

    const handleFormSubmit = useCallback(
      async (form_values: ClassModel) => {
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
          open={open_edit_class}
          title="Edit Class Details"
          handleClose={() => handleCloseEditClass()}
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
                    className="clinic-adding-form"
                    style={{
                      backgroundColor: `#fff`,
                      borderRadius: 10,
                      padding: `1em 3em`,
                    }}
                  >
                    <Grid container justify="center" spacing={3}>
                      <Grid xs={12} item>
                        <FormikInputField
                          name="class_desc"
                          label="Class Description"
                          placeholder="Enter the class description"
                          variant="outlined"
                          InputLabelProps={{ shrink: true }}
                          fullWidth
                        />
                      </Grid>

                      <Grid xs={12} item>
                        <FormikSelect
                          data={DbClassTypes}
                          label="Class Type"
                          name="class_type"
                          InputLabelProps={{ shrink: true }}
                          variant="outlined"
                          fullWidth
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
              <Button color="primary" variant="contained">
                Save Changes
              </Button>
            </>
          }
        />
      </>
    );
  }
);

export default EditClassAdminDialog;
