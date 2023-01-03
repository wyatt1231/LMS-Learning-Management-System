import DateFnsUtils from "@date-io/date-fns";
import {
  Button,
  Container,
  Grid,
  MenuItem,
  TextField,
} from "@material-ui/core";
import {
  KeyboardDatePicker,
  MuiPickersUtilsProvider,
} from "@material-ui/pickers";
import { Form, Formik, FormikProps } from "formik";
import moment from "moment";
import React, {
  FC,
  memo,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import FormikInputField from "../../../Component/Formik/FormikInputField";
import FormikRadio from "../../../Component/Formik/FormikRadio";
import MaskedPhoneNumber from "../../../Component/Mask/MaskedPhoneNumber";
import PhotoField from "../../../Component/PhotoField/PhotoField";
import SuccessDialog from "../../../Component/SuccessDialog";
import { fileToBase64 } from "../../../Hooks/UseFileConverter";
import {
  setGeneralPrompt,
  setPageLinks,
} from "../../../Services/Actions/PageActions";
import { addTutorAction } from "../../../Services/Actions/TutorActions";
import { TutorModel } from "../../../Services/Models/TutorModels";
import { DbTutorPositions } from "../../../Storage/LocalDatabase";
import AddAdminTutorSchema from "../../../ValidationSchema/AddAdminTutorSchema";

interface IAddAdminTutorView {}

const initialFormValues: TutorModel = {
  position: "",
  picture: "",
  firstname: "",
  middlename: "",
  lastname: "",
  suffix: "",
  prefix: "",
  birth_date: null,
  bio: "",
  email: "",
  mob_no: "",
  gender: null,
  complete_address: "",
};

export const AddAdminTutorView: FC<IAddAdminTutorView> = memo(() => {
  const dispatch = useDispatch();
  const history = useHistory();

  const formRef = useRef<FormikProps<TutorModel> | null>(null);

  const [successDialog, setSuccessDialog] = useState({
    open: false,
    message: "",
  });

  const [pic, setPic] = useState<File | null>(null);
  const handleSetPic = useCallback((logo) => {
    setPic(logo);
  }, []);

  const handleFormSubmit = useCallback(
    async (formValues: TutorModel) => {
      formValues.picture = await fileToBase64(pic);
      console.log(`formValues`, formValues);

      dispatch(
        setGeneralPrompt({
          open: true,
          continue_callback: () =>
            dispatch(
              addTutorAction(formValues, (msg: string) => {
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

  useEffect(() => {
    let mounted = true;

    const settingPageLinks = () => {
      dispatch(
        setPageLinks([
          {
            link: "/admin/tutor",
            title: "Tutors",
          },
          {
            link: "/admin/tutor/add",
            title: "Add Tutor",
          },
        ])
      );
    };

    mounted && settingPageLinks();
    return () => {
      mounted = false;
    };
  }, [dispatch]);

  return (
    <Container maxWidth="md">
      <Formik
        initialValues={initialFormValues}
        validationSchema={AddAdminTutorSchema}
        validateOnChange={false}
        validateOnBlur={false}
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
          <Form
            className="clinic-adding-form"
            noValidate
            style={{
              backgroundColor: `#fff`,
              borderRadius: 10,
              padding: `1em 2em`,
            }}
          >
            <div className="box-ctnr">
              <div className="box-header">
                <div className="header-text">
                  Kindly fill-up all the required tutor information
                </div>
              </div>
              <div className="box-body">
                <Grid container justify="center" spacing={3}>
                  <Grid xs={12} md={4} lg={3} container justify="center" item>
                    <div style={{ padding: "1.5em 0" }}>
                      <PhotoField
                        label=""
                        height={200}
                        width={200}
                        selectedFile={pic}
                        name="pic"
                        handleChange={handleSetPic}
                      />
                    </div>
                  </Grid>

                  <Grid
                    xs={12}
                    md={8}
                    lg={9}
                    item
                    container
                    justify="flex-start"
                    spacing={2}
                    style={{ padding: "1em", marginTop: "1em" }}
                  >
                    <Grid xs={12} sm={6} item>
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

                    <Grid xs={12} sm={6} item>
                      <FormikInputField
                        label="Middle Name"
                        name="middlename"
                        placeholder="Enter middle name"
                        variant="outlined"
                        InputLabelProps={{ shrink: true }}
                        fullWidth
                      />
                    </Grid>

                    <Grid xs={12} sm={6} item>
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

                    <Grid xs={12} sm={3} item>
                      <FormikInputField
                        label="Suffix"
                        placeholder="Enter suffix"
                        name="suffix"
                        variant="outlined"
                        InputLabelProps={{ shrink: true }}
                        fullWidth
                      />
                    </Grid>

                    <Grid xs={12} sm={6} item>
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

                    <Grid xs={12} sm={6} item>
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

                    <Grid xs={12} sm={6} item>
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

                    <Grid xs={12} sm={6} item>
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
                    <Grid xs={12} sm={6} item>
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
                </Grid>
              </div>
            </div>

            <div style={{ marginTop: "1em" }}>
              <Grid container justify={"flex-end"} spacing={3}>
                <Grid item>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    size="large"
                    disableElevation
                  >
                    Add Tutor
                  </Button>
                </Grid>
                <Grid item>
                  <Button
                    type="button"
                    color="secondary"
                    size="large"
                    disableElevation
                    onClick={() => {
                      // history.push(`/admin/clients`);
                    }}
                  >
                    Cancel
                  </Button>
                </Grid>
              </Grid>
            </div>
            <SuccessDialog {...successDialog}>
              <Button
                color="primary"
                disableElevation={false}
                onClick={() => {
                  formRef.current.handleReset();
                  setSuccessDialog({
                    open: false,
                    message: "",
                  });
                  setPic(null);
                }}
              >
                Add another tutor
              </Button>
              <Button
                color="primary"
                disableElevation={false}
                onClick={() => {
                  history.push(`/admin/tutor`);
                }}
              >
                View all tutors
              </Button>
            </SuccessDialog>
          </Form>
        )}
      </Formik>
    </Container>
  );
});

export default AddAdminTutorView;
