import { Button, Grid, MenuItem, TextField } from "@material-ui/core";
import { Form, Formik } from "formik";
import React, { FC, memo, useCallback } from "react";
import { useDispatch } from "react-redux";
import * as yup from "yup";
import FormDialog from "../../../Component/FormDialog/FormDialog";
import FormikInputField from "../../../Component/Formik/FormikInputField";
import FormikRadio from "../../../Component/Formik/FormikRadio";
import MaskedPhoneNumber from "../../../Component/Mask/MaskedPhoneNumber";
import { setGeneralPrompt } from "../../../Services/Actions/PageActions";
import StudentActions from "../../../Services/Actions/StudentActions";
import { StudentModel } from "../../../Services/Models/StudentModel";
import { DbGradeLevels } from "../../../Storage/LocalDatabase";
interface IEditStudentInfo {
  initial_form_values: StudentModel;
  open: boolean;
  handleClose: () => void;
}

const formSchema = yup.object({
  firstname: yup.string().required().max(150).label("First Name"),
  middlename: yup.string().max(100).label("Midle Name"),
  lastname: yup.string().required().max(150).label("Last Name"),
  suffix: yup.string().max(10).label("Suffix"),
  grade: yup
    .number()
    .nullable()
    .required()
    .moreThan(0)
    .lessThan(20)
    .label("Grade Level"),
  email: yup.string().required().email().label("Email Address"),
  mob_no: yup
    .string()
    .required()
    .matches(
      /^(09|\+639)\d{9}$/,
      "Mobile number must be a valid philippine mobile number."
    ),
  gender: yup.string().nullable().required().max(1).label("Gender"),
  complete_address: yup.string().required().max(255).label("Complete Address"),
});

export const EditStudentInfo: FC<IEditStudentInfo> = memo(
  ({ initial_form_values, open, handleClose }) => {
    const dispatch = useDispatch();

    const handleFormSubmit = useCallback(
      async (payload: StudentModel) => {
        payload.student_pk = initial_form_values.student_pk;

        if (initial_form_values?.student_pk) {
          dispatch(
            setGeneralPrompt({
              open: true,
              continue_callback: () =>
                dispatch(
                  StudentActions.updateStudent(payload, (msg: string) => {
                    dispatch(StudentActions.getLoggedStudentInfo());
                    handleClose();
                  })
                ),
            })
          );
        }
      },
      [dispatch, handleClose, initial_form_values]
    );

    return (
      <>
        <FormDialog
          open={open}
          title="Update Your Basic Information"
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
                  <Form className="form" id="form-update-student-info">
                    <Grid container spacing={3}>
                      <Grid item xs={12}>
                        <FormikInputField
                          label="First Name"
                          placeholder="Enter firstname name"
                          name="firstname"
                          variant="outlined"
                          InputLabelProps={{ shrink: true }}
                          fullWidth
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <FormikInputField
                          label="Middle Name (optional)"
                          placeholder="Enter middle name"
                          name="middlename"
                          variant="outlined"
                          InputLabelProps={{ shrink: true }}
                          fullWidth
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <FormikInputField
                          label="Last Name"
                          placeholder="Enter last name"
                          name="lastname"
                          variant="outlined"
                          InputLabelProps={{ shrink: true }}
                          fullWidth
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <FormikInputField
                          label="Suffix (optional)"
                          placeholder="Enter suffix"
                          name="suffix"
                          variant="outlined"
                          InputLabelProps={{ shrink: true }}
                          fullWidth
                        />
                      </Grid>
                      <Grid item xs={12}>
                        {(() => {
                          const name = "grade";
                          const errorText =
                            errors[name] && touched[name] ? errors[name] : "";
                          const handleChange = (e: any) => {
                            setFieldValue(name, e.target.value);
                          };
                          return (
                            <TextField
                              value={values[name] ? values[name] : ""}
                              label="Grade Level"
                              select
                              onChange={handleChange}
                              placeholder="Enter position/designation"
                              variant="outlined"
                              InputLabelProps={{ shrink: true }}
                              fullWidth
                              error={!!errorText}
                              helperText={errorText}
                            >
                              {DbGradeLevels.map((val, index) => (
                                <MenuItem key={index} value={val.id}>
                                  {val.label}
                                </MenuItem>
                              ))}
                            </TextField>
                          );
                        })()}
                      </Grid>
                      <Grid item xs={12}>
                        <FormikRadio
                          name="gender"
                          label="Gender"
                          variant="vertical"
                          required={true}
                          data={[
                            {
                              id: "m",
                              label: "Male",
                            },
                            {
                              id: "f",
                              label: "Female",
                            },
                          ]}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <FormikInputField
                          label="Mobile Number"
                          placeholder="Mobile Number"
                          name="mob_no"
                          variant="outlined"
                          InputLabelProps={{ shrink: true }}
                          fullWidth
                          InputProps={{
                            inputComponent: MaskedPhoneNumber,
                          }}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <FormikInputField
                          label="Email Address"
                          placeholder="Enter email address"
                          name="email"
                          type="email"
                          variant="outlined"
                          InputLabelProps={{ shrink: true }}
                          fullWidth
                        />
                      </Grid>

                      <Grid item xs={12}>
                        <Grid item xs={12}>
                          <FormikInputField
                            label="Complete Address"
                            placeholder="Enter complete address"
                            name="complete_address"
                            type="text"
                            variant="outlined"
                            InputLabelProps={{ shrink: true }}
                            fullWidth
                            multiline={true}
                            rows={3}
                          />
                        </Grid>
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
                form="form-update-student-info"
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

export default EditStudentInfo;
