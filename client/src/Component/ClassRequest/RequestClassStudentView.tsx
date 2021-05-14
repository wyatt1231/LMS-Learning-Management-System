import DateFnsUtils from "@date-io/date-fns";
import { Button, Grid } from "@material-ui/core";
import {
  KeyboardDatePicker,
  MuiPickersUtilsProvider,
  TimePicker,
} from "@material-ui/pickers";
import { Form, Formik } from "formik";
import moment from "moment";
import React, { FC, memo, useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as yup from "yup";
import FormDialog from "../FormDialog/FormDialog";
import FormikAutocomplete from "../Formik/FormikAutocomplete";
import FormikSelect from "../Formik/FormikSelect";
import ClassActions from "../../Services/Actions/ClassActions";
import { setGeneralPrompt } from "../../Services/Actions/PageActions";
import { ClassRequestModel } from "../../Services/Models/ClassRequestModel";
import { RootStore } from "../../Services/Store";
import { DbClassTypes } from "../../Storage/LocalDatabase";

interface IRequestClassStudentView {}

const initFormValues: ClassRequestModel = {
  course_pk: null,
  course_desc: "",
  class_type: "",
  tutor_pk: null,
  tutor_name: "",
  start_date: null,
  start_time: null,
  end_time: null,
};

const formSchema = yup.object({
  class_type: yup.string().required().max(255).label("Class Type"),
  course_pk: yup.string().nullable().required().max(255).label("Course"),
  course_desc: yup.string().required().max(255).label("Course"),
  tutor_pk: yup.string().nullable().required().max(255).label("Tutor"),
  tutor_name: yup.string().required().max(255).label("Tutor"),
  start_date: yup.date().nullable().required().label("Start Date"),
  start_time: yup.string().required().max(255).label("Start Time"),
  end_time: yup.string().required().max(255).label("End Time"),
});

export const RequestClassStudentView: FC<IRequestClassStudentView> = memo(
  () => {
    const dispatch = useDispatch();

    const set_notif_socket = useSelector(
      (store: RootStore) => store.SocketReducer.set_notif
    );

    const [open, set_open] = useState(false);

    const handleFormSubmit = useCallback(
      async (form_values: ClassRequestModel) => {
        dispatch(
          setGeneralPrompt({
            open: true,
            continue_callback: () =>
              dispatch(
                ClassActions.addClassRequest(
                  form_values,
                  set_notif_socket,
                  (msg: string) => {
                    dispatch(ClassActions.getClassRequests());
                    set_open(false);
                  }
                )
              ),
          })
        );
      },
      [dispatch]
    );

    return (
      <>
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            set_open(true);
          }}
        >
          Request A Class
        </Button>

        <FormDialog
          open={open}
          handleClose={() => set_open(false)}
          title="Class Requesting Form"
          body={
            <div>
              <Formik
                initialValues={initFormValues}
                // validationSchema={formSchema}
                validateOnChange={false}
                validateOnBlur={false}
                onSubmit={handleFormSubmit}
              >
                {({ values, errors, touched, setFieldValue, submitCount }) => (
                  <Form
                    id="class-req-form"
                    className="clinic-adding-form"
                    style={{
                      backgroundColor: `#fff`,
                      borderRadius: 10,
                      padding: `1em 2em`,
                    }}
                  >
                    <div className="box-ctnr">
                      <div className="box-header">
                        <div className="header-text">
                          Step 1: Fill-up the request details to request a class
                        </div>
                      </div>

                      <div className="box-body">
                        <Grid container spacing={3}>
                          <Grid xs={6} item>
                            <FormikSelect
                              data={DbClassTypes}
                              label="Class Type"
                              name="class_type"
                              InputLabelProps={{ shrink: true }}
                              variant="outlined"
                              fullWidth
                            />
                          </Grid>

                          <Grid xs={6} item>
                            <FormikAutocomplete
                              label="Course"
                              optKeyId="id"
                              optKeyLabel="label"
                              inputFieldName="course_pk"
                              selectFieldName="course_desc"
                              endPoint="api/course/searchCourse"
                              variant="outlined"
                              placeholder="Select course"
                            />
                          </Grid>

                          <Grid xs={6} item>
                            <FormikAutocomplete
                              label="Tutor"
                              optKeyId="id"
                              optKeyLabel="label"
                              inputFieldName="tutor_pk"
                              selectFieldName="tutor_name"
                              endPoint="api/tutor/searchTutor"
                              variant="outlined"
                              placeholder="Select room"
                            />
                          </Grid>

                          <Grid xs={6} item>
                            {(() => {
                              const name = "start_date";
                              const label = "Start Date";
                              const errorText =
                                errors[name] && touched[name]
                                  ? errors[name]
                                  : "";
                              const handleChange = (date) => {
                                setFieldValue(name, moment(date).format());
                              };
                              return (
                                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                  <Grid container justify="space-around">
                                    <KeyboardDatePicker
                                      value={values.start_date}
                                      onChange={handleChange}
                                      label={label}
                                      variant="inline"
                                      animateYearScrolling={true}
                                      disablePast={true}
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

                          <Grid xs={6} item>
                            {(() => {
                              const name = "start_time";
                              const label = "Start Time";
                              const errorText =
                                errors[name] && touched[name]
                                  ? errors[name]
                                  : "";
                              const handleChange = (date) => {
                                const t = moment(date).format();
                                setFieldValue(name, t);
                              };
                              return (
                                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                  <Grid container justify="space-around">
                                    <TimePicker
                                      value={values[name]}
                                      onChange={handleChange}
                                      minutesStep={30}
                                      label={label}
                                      variant="inline"
                                      placeholder="HH:mm"
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

                          <Grid xs={6} item>
                            {(() => {
                              const name = "end_time";
                              const label = "End Time";
                              const errorText =
                                errors[name] && touched[name]
                                  ? errors[name]
                                  : "";
                              const handleChange = (date) => {
                                const t = moment(date).format();
                                setFieldValue(name, t);
                              };
                              return (
                                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                  <Grid container justify="space-around">
                                    <TimePicker
                                      value={values[name]}
                                      onChange={handleChange}
                                      label={label}
                                      variant="inline"
                                      //   format="hh:mm"
                                      minutesStep={30}
                                      placeholder="HH:mm"
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
                        </Grid>
                      </div>
                    </div>
                  </Form>
                )}
              </Formik>
            </div>
          }
          actions={
            <>
              <Button
                type="submit"
                form="class-req-form"
                variant="contained"
                color="primary"
              >
                Submit Request
              </Button>
            </>
          }
        />
      </>
    );
  }
);

export default RequestClassStudentView;
