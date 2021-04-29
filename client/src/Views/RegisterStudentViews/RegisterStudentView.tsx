import { Button, Grid, MenuItem, TextField, useTheme } from "@material-ui/core";
import { Form, Formik, FormikHelpers, FormikProps } from "formik";
import React, { FC, memo, useCallback, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import * as yup from "yup";
import app_logo from "../../Assets/Images/Logo/school_logo.jpg";
import FormikInputField from "../../Component/Formik/FormikInputField";
import FormikRadio from "../../Component/Formik/FormikRadio";
import MaskedPhoneNumber from "../../Component/Mask/MaskedPhoneNumber";
import PhotoField from "../../Component/PhotoField/PhotoField";
import SuccessDialog from "../../Component/SuccessDialog";
import {
  validateEmail,
  validatePassword,
  validateUsername,
} from "../../Helpers/helpGetRegexValidators";
import { fileToBase64 } from "../../Hooks/UseFileConverter";
import { setGeneralPrompt } from "../../Services/Actions/PageActions";
import { addStudentAction } from "../../Services/Actions/StudentActions";
import { StudentModel } from "../../Services/Models/StudentModel";
import { DbGradeLevels } from "../../Storage/LocalDatabase";
import { StyledRegisterStudentView } from "./styles";

interface IRegisterSTudentView {}

const initFormValues: StudentModel = {
  firstname: "",
  middlename: "",
  lastname: "",
  suffix: "",
  grade: null,
  gender: null,
  email: "",
  mob_no: "",
  picture: "",
  user: {
    username: "",
    password: "",
    confirm_password: "",
  },
};

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
  email: yup
    .string()
    .required()
    .label("Email Address")
    .matches(validateEmail, "Email address has invalid format"),
  mob_no: yup
    .string()
    .required()
    .matches(
      /^(09|\+639)\d{9}$/,
      "Mobile number must be a valid philippine mobile number."
    ),
  gender: yup.string().nullable().required().max(1).label("Gender"),
  // complete_address: yup.string().required().max(255).label("Complete Address"),
  user: yup.object({
    username: validateUsername("Username"),
    password: validatePassword("Password"),
    confirm_password: yup
      .string()
      .required()
      .label("Re-enter password")
      .test("Passwords do not much", "Passwords must match", function (value) {
        const { password } = this.parent;
        return password === value;
      }),
  }),
});

export const RegisterSTudentView: FC<IRegisterSTudentView> = memo(() => {
  const theme = useTheme();
  const history = useHistory();
  const dispatch = useDispatch();

  const formRef = useRef<FormikProps<StudentModel> | null>(null);

  const [successDialog, setSuccessDialog] = useState({
    open: false,
    message: "",
  });

  const [pic, setPic] = useState<File | null>(null);
  const handleSetPic = useCallback((logo) => {
    setPic(logo);
  }, []);

  const handleFormSubmit = useCallback(
    async (values, formHelpers: FormikHelpers<StudentModel>) => {
      console.log(`values`, values);
      values.picture = await fileToBase64(pic);

      dispatch(
        setGeneralPrompt({
          open: true,
          continue_callback: () =>
            dispatch(
              addStudentAction(values, (msg: string) => {
                setSuccessDialog({
                  message: msg,
                  open: true,
                });
              })
            ),
        })
      );
    },
    [dispatch, pic]
  );

  return (
    <StyledRegisterStudentView theme={theme}>
      <div style={{ gridArea: "login" }} className="login-container">
        <div className="form-ctnr">
          <section className="header">
            <img className="brand-logo" src={app_logo} alt="" />
            <h1>{process.env.REACT_APP_NAME}</h1>
            <h3>{process.env.REACT_APP_CLIENT}</h3>

            <div className="brand-name">
              We simply empower the excellence within you. Start learning now!
            </div>
          </section>

          <section className="body">
            <div className="body-title">
              Fill-up all the required fields to create an account!
            </div>

            {/* {!!authError && <div className="error">{authError}</div>} */}

            <Formik
              initialValues={initFormValues}
              validationSchema={formSchema}
              onSubmit={handleFormSubmit}
              innerRef={formRef}
            >
              {({
                values,
                errors,
                touched,
                setFieldValue,
                handleChange,
                setValues,
              }) => (
                <Form className="form">
                  <Grid container spacing={3}>
                    <Grid xs={12} container justify="center" item>
                      <div>
                        <PhotoField
                          label=""
                          height={180}
                          width={180}
                          selectedFile={pic}
                          name="pic"
                          handleChange={handleSetPic}
                        />
                      </div>
                    </Grid>
                    <Grid item xs={12}>
                      <div className="form-title">Personal Information</div>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <FormikInputField
                        label="First Name"
                        required
                        placeholder="Enter firstname name"
                        name="firstname"
                        variant="outlined"
                        InputLabelProps={{ shrink: true }}
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <FormikInputField
                        label="Middle Name"
                        placeholder="Enter middle name"
                        name="middlename"
                        variant="outlined"
                        InputLabelProps={{ shrink: true }}
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <FormikInputField
                        label="Last Name"
                        required
                        placeholder="Enter last name"
                        name="lastname"
                        variant="outlined"
                        InputLabelProps={{ shrink: true }}
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={12} md={3}>
                      <FormikInputField
                        label="Suffix"
                        placeholder="Enter suffix"
                        name="suffix"
                        variant="outlined"
                        InputLabelProps={{ shrink: true }}
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={12} md={3}>
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
                            required
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
                    <Grid item xs={12} md={6}>
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
                    <Grid item xs={12} md={6}>
                      <FormikInputField
                        label="Mobile Number"
                        placeholder="Mobile Number"
                        name="mob_no"
                        variant="outlined"
                        InputLabelProps={{ shrink: true }}
                        fullWidth
                        required
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
                        required
                        variant="outlined"
                        InputLabelProps={{ shrink: true }}
                        fullWidth
                      />
                    </Grid>

                    {/* <Grid item xs={12}>
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
                    </Grid> */}
                    <Grid item xs={12}>
                      <div className="form-title">Account Information</div>
                    </Grid>
                    <Grid item xs={12}>
                      <FormikInputField
                        label="Username"
                        placeholder="Enter username"
                        name="user.username"
                        variant="outlined"
                        required
                        InputLabelProps={{ shrink: true }}
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <FormikInputField
                        label="Password"
                        placeholder="Enter password"
                        name="user.password"
                        type="password"
                        variant="outlined"
                        required
                        InputLabelProps={{ shrink: true }}
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <FormikInputField
                        label="Re-enter password"
                        placeholder="Re-enter password"
                        name="user.confirm_password"
                        type="password"
                        variant="outlined"
                        required
                        InputLabelProps={{ shrink: true }}
                        fullWidth
                      />
                    </Grid>
                    <Grid
                      item
                      container
                      xs={12}
                      spacing={2}
                      justify="flex-end"
                      style={{
                        padding: `2em 0`,
                      }}
                    >
                      <Grid item>
                        <Button
                          color="primary"
                          variant="contained"
                          disableElevation
                          size="large"
                          type="submit"
                        >
                          Create Account
                        </Button>
                      </Grid>
                      <Grid item>
                        <Button
                          color="secondary"
                          variant="contained"
                          disableElevation
                          size="large"
                          onClick={() => {
                            history.push(`/login`);
                          }}
                        >
                          Go Back
                        </Button>
                      </Grid>
                    </Grid>
                  </Grid>
                </Form>
              )}
            </Formik>
          </section>
          <section className="footer">
            <div className="title">Developed & Maintained By</div>
            <div className="tuo-name">{process?.env.REACT_APP_PROVIDER}</div>
          </section>

          <SuccessDialog {...successDialog}>
            <Button
              color="primary"
              disableElevation={false}
              onClick={() => {
                history.push(`/login`);
              }}
            >
              Go to Login Page
            </Button>
          </SuccessDialog>
        </div>
      </div>
    </StyledRegisterStudentView>
  );
});

export default RegisterSTudentView;
