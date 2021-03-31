import DateFnsUtils from "@date-io/date-fns";
import { Button, Grid, MenuItem, TextField } from "@material-ui/core";
import {
  KeyboardDatePicker,
  MuiPickersUtilsProvider,
} from "@material-ui/pickers";
import { Form, Formik } from "formik";
import moment from "moment";
import React, { FC, memo, useCallback } from "react";
import { useDispatch } from "react-redux";
import * as yup from "yup";
import FormDialog from "../../../Component/FormDialog/FormDialog";
import FormikInputField from "../../../Component/Formik/FormikInputField";
import FormikRadio from "../../../Component/Formik/FormikRadio";
import { ClassModel } from "../../../Services/Models/ClassModel";
import { TutorModel } from "../../../Services/Models/TutorModels";
import { DbTutorPositions } from "../../../Storage/LocalDatabase";
interface IEditTutorDialog {
  initial_form_values: TutorModel;
  open: boolean;
  handleClose: () => void;
}

const formSchema = yup.object({
  position: yup.string().required().max(150).label("Position"),
  firstname: yup.string().required().max(150).label("First Name"),
  lastname: yup.string().required().max(150).label("Last Name"),
  birth_date: yup.date().nullable().label("Birth Date"),
  gender: yup.string().nullable().required().max(1).label("Gender"),
  complete_address: yup.string().required().max(255).label("Complete Address"),
});

export const EditTutorDialog: FC<IEditTutorDialog> = memo(
  ({ initial_form_values, open, handleClose }) => {
    const dispatch = useDispatch();

    const handleFormSubmit = useCallback(
      async (payload: TutorModel) => {
        console.log(`payload`, payload);

        payload.tutor_pk = initial_form_values.tutor_pk;

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
      [initial_form_values.tutor_pk]
    );

    return (
      <>
        <FormDialog
          open={open}
          title="Edit Tutor Details"
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
                    style={{
                      backgroundColor: `#fff`,
                      borderRadius: 10,
                      padding: `1em 3em`,
                    }}
                    id="form-edit-tutor"
                  >
                    <Grid container justify="center" spacing={3}>
                      <Grid xs={12} item>
                        <FormikInputField
                          label="Prefix"
                          placeholder="Enter prefix"
                          name="prefix"
                          variant="outlined"
                          InputLabelProps={{ shrink: true }}
                          fullWidth
                        />
                      </Grid>

                      <Grid xs={12} item>
                        <FormikInputField
                          label="First Name"
                          name="firstname"
                          placeholder="Enter first name"
                          variant="outlined"
                          InputLabelProps={{ shrink: true }}
                          fullWidth
                          required
                        />
                      </Grid>
                      <Grid xs={12} item>
                        <FormikInputField
                          label="Middle Name"
                          name="middlename"
                          placeholder="Enter middle name"
                          variant="outlined"
                          InputLabelProps={{ shrink: true }}
                          fullWidth
                        />
                      </Grid>
                      <Grid xs={12} item>
                        <FormikInputField
                          label="Last Name"
                          name="lastname"
                          placeholder="Enter last name"
                          variant="outlined"
                          InputLabelProps={{ shrink: true }}
                          fullWidth
                          required
                        />
                      </Grid>
                      <Grid xs={12} item>
                        <FormikInputField
                          label="Suffix"
                          placeholder="Enter suffix"
                          name="suffix"
                          variant="outlined"
                          InputLabelProps={{ shrink: true }}
                          fullWidth
                        />
                      </Grid>
                      <Grid xs={12} item>
                        {(() => {
                          const name = "position";
                          const errorText =
                            errors[name] && touched[name] ? errors[name] : "";
                          const handleChange = (e: any) => {
                            setFieldValue(name, e.target.value);
                          };
                          return (
                            <TextField
                              value={values[name]}
                              label="Position"
                              select
                              onChange={handleChange}
                              placeholder="Enter position/designation"
                              variant="outlined"
                              InputLabelProps={{ shrink: true }}
                              fullWidth
                              error={!!errorText}
                              helperText={errorText}
                              required
                            >
                              {DbTutorPositions.map((value) => (
                                <MenuItem key={value} value={value}>
                                  {value}
                                </MenuItem>
                              ))}
                            </TextField>
                          );
                        })()}
                      </Grid>
                      <Grid xs={12} item>
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
                      <Grid xs={12} item>
                        {(() => {
                          const label = "Date of Birth (MM/DD/YYYY)";
                          const name = "birth_date";
                          const errorText =
                            errors[name] && touched[name] ? errors[name] : "";
                          const handleChange = (date) => {
                            setFieldValue(name, moment(date).toDate());
                          };
                          return (
                            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                              <Grid container justify="space-around">
                                <KeyboardDatePicker
                                  value={values[name]}
                                  onChange={handleChange}
                                  label={label}
                                  variant="inline"
                                  animateYearScrolling={true}
                                  disableFuture={true}
                                  format="MM/dd/yyyy"
                                  placeholder="MM/DD/YYYY"
                                  fullWidth={true}
                                  inputVariant="outlined"
                                  InputLabelProps={{
                                    shrink: true,
                                  }}
                                  autoOk={true}
                                  error={!!errorText}
                                  helperText={errorText}
                                />
                              </Grid>
                            </MuiPickersUtilsProvider>
                          );
                        })()}
                      </Grid>
                      <Grid xs={12} item>
                        <FormikInputField
                          label="Complete Address"
                          name="complete_address"
                          placeholder="Enter complete address"
                          variant="outlined"
                          InputLabelProps={{ shrink: true }}
                          fullWidth
                          multiline
                          rows={2}
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
                form="form-edit-tutor"
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

export default EditTutorDialog;
