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
import MaskedPhoneNumber from "../../../Component/Mask/MaskedPhoneNumber";
import AdminActions from "../../../Services/Actions/AdminActions";
import { setGeneralPrompt } from "../../../Services/Actions/PageActions";
import UserActions from "../../../Services/Actions/UserActions";
import { AdminModel } from "../../../Services/Models/AdminModel";
import { DbAdminPositions } from "../../../Storage/LocalDatabase";
interface IEditAdminInfoDialog {
  initial_form_values: AdminModel;
  open: boolean;
  handleClose: () => void;
}

const formSchema = yup.object({
  position: yup.string().required().max(150).label("Position"),
  firstname: yup.string().required().max(150).label("First Name"),
  lastname: yup.string().required().max(150).label("Last Name"),
  birth_date: yup.date().nullable().label("Birth Date"),
  email: yup.string().required().email().label("Email"),
  gender: yup.string().required().nullable().max(1).label("Gender"),
  mob_no: yup
    .string()
    .required()
    .matches(
      /^(09|\+639)\d{9}$/,
      "Mobile number must be a valid philippine mobile number."
    )
    .label("Mobile Number"),
});

export const EditAdminInfoDialog: FC<IEditAdminInfoDialog> = memo(
  ({ initial_form_values, open, handleClose }) => {
    const dispatch = useDispatch();

    const handleFormSubmit = useCallback(
      async (payload: AdminModel) => {
        payload.admin_pk = initial_form_values.admin_pk;
        dispatch(
          setGeneralPrompt({
            open: true,
            continue_callback: () =>
              dispatch(
                AdminActions.updateAdminInfo(payload, (msg: string) => {
                  dispatch(AdminActions.getLoggedAdmin());
                  dispatch(UserActions.getUserLogs());
                  handleClose();
                })
              ),
          })
        );
      },
      [dispatch, handleClose, initial_form_values.admin_pk]
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
                          label="Suffix"
                          placeholder="Enter suffix"
                          name="suffix"
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
                              {DbAdminPositions.map((value) => (
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
                          label="Email Address"
                          name="email"
                          variant="outlined"
                          placeholder="Email Address"
                          InputLabelProps={{ shrink: true }}
                          fullWidth
                          type="email"
                          required
                        />
                      </Grid>

                      <Grid xs={12} item>
                        <FormikInputField
                          label="Phone Number"
                          name="mob_no"
                          variant="outlined"
                          placeholder="Phone Number"
                          InputLabelProps={{ shrink: true }}
                          fullWidth
                          InputProps={{
                            inputComponent: MaskedPhoneNumber,
                          }}
                          required
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

export default EditAdminInfoDialog;
