import DateFnsUtils from "@date-io/date-fns";
import {
  Button,
  Chip,
  Container,
  Grid,
  IconButton,
  MenuItem,
  TextField,
  Tooltip,
} from "@material-ui/core";
import {
  KeyboardDatePicker,
  MuiPickersUtilsProvider,
} from "@material-ui/pickers";
import DateRangeRoundedIcon from "@material-ui/icons/DateRangeRounded";
import EventNoteRoundedIcon from "@material-ui/icons/EventNoteRounded";
import {
  FieldArray,
  FieldArrayRenderProps,
  Form,
  Formik,
  FormikProps,
  useFormikContext,
} from "formik";
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
import FormikAutocomplete from "../../../Component/Formik/FormikAutocomplete";
import FormikInputField from "../../../Component/Formik/FormikInputField";
import FormikSelect from "../../../Component/Formik/FormikSelect";
import SuccessDialog from "../../../Component/SuccessDialog";
import { generateDailyWeekDaysDates } from "../../../Hooks/UseScheduleGenerator";
import {
  setGeneralPrompt,
  setPageLinks,
  setSnackbar,
} from "../../../Services/Actions/PageActions";
import CourseApi from "../../../Services/Api/CourseApi";
import ClassSessionApi from "../../../Services/Api/ClassSessionApi";
import {
  DbClassTypes,
  DbCourseDurations,
} from "../../../Storage/LocalDatabase";
import * as yup from "yup";
import {
  generateTimeSlot,
  TimeSlotInterface,
} from "../../../Hooks/UseTimeSlot";
import { addClassAction } from "../../../Services/Actions/ClassActions";
import { ClassModel } from "../../../Services/Models/ClassModel";
import {
  ClassSessionModel,
  TutorFutureSessionModel,
} from "../../../Services/Models/ClassSessionModel";
import InfoDialog from "../../../Component/InfoDialog";

interface AddClassAdminViewInterface {}

const initFormValues: ClassModel = {
  class_desc: "",
  course_pk: null,
  course_desc: "",
  course_duration: 0,
  room_pk: null,
  room_desc: "",
  class_type: "",
  tutor_pk: null,
  tutor_name: "",
  start_date: null,
  start_time: "",
  end_time: "",
  session_count: 0,
  class_sessions: [],
};

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

interface ReschedRpopsInterface {
  open: boolean;
  index?: number;
}

const GetCourseDuration = () => {
  const { values, setFieldValue } = useFormikContext<any>();

  useEffect(() => {
    let mounted = true;

    const fetchCourseDuration = async () => {
      if (!values.course_pk) {
        setFieldValue("course_duration", "");
      } else {
        const response = await CourseApi.getCourseDurationApi(values.course_pk);
        if (response?.data?.est_duration) {
          setFieldValue("course_duration", response?.data?.est_duration);
        } else {
          setFieldValue("course_duration", "");
        }
      }
    };

    mounted && fetchCourseDuration();

    return () => {
      mounted = false;
    };
  }, [setFieldValue, values.course_pk]);

  return null;
};

const GetTutorFutureSessions = ({ handleSetTutorFutureSessions }) => {
  const { values, setFieldValue } = useFormikContext<any>();

  useEffect(() => {
    let mounted = true;

    const fetching = async () => {
      if (!values.tutor_pk) {
        handleSetTutorFutureSessions([]);
      } else {
        setFieldValue("class_sessions", []);
        const response = await ClassSessionApi.getTutorFutureSessionsApi(
          values.tutor_pk
        );
        if (response?.data) {
          handleSetTutorFutureSessions(response.data);
        } else {
          handleSetTutorFutureSessions([]);
        }
      }
    };

    mounted && fetching();

    return () => {
      mounted = false;
    };
  }, [handleSetTutorFutureSessions, setFieldValue, values.tutor_pk]);

  return null;
};

export const AddClassAdminView: FC<AddClassAdminViewInterface> = memo(() => {
  const dispatch = useDispatch();
  const history = useHistory();

  const formRef = useRef<FormikProps<ClassModel> | null>(null);

  const [reschedProps, setReschedProps] = useState<ReschedRpopsInterface>({
    open: false,
    index: null,
  });

  const [tutorFutureSession, setTutorFutureSessions] = useState<
    Array<TutorFutureSessionModel>
  >([]);

  const handleSetTutorFutureSessions = useCallback(
    (sessions: Array<TutorFutureSessionModel>) => {
      setTutorFutureSessions(sessions);
    },
    []
  );

  const [successDialog, setSuccessDialog] = useState({
    open: false,
    message: "",
  });

  const handleFormSubmit = useCallback(
    async (form_values: ClassModel) => {
      dispatch(
        setGeneralPrompt({
          open: true,
          continue_callback: () =>
            dispatch(
              addClassAction(form_values, (msg: string) => {
                setSuccessDialog({
                  message: msg,
                  open: true,
                });
              })
            ),
        })
      );
    },
    [dispatch]
  );

  const [openTutorFutureSched, setOpenTutorFutureSched] = useState(false);
  const handleSetOpenTutorFutureSched = (open: boolean) => {
    setOpenTutorFutureSched(open);
  };

  useEffect(() => {
    let mounted = true;

    const settingPageLinks = () => {
      dispatch(
        setPageLinks([
          {
            link: "/admin/class",
            title: "Class",
          },
          {
            link: window.location.pathname,
            title: "Add Class",
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
    <Container maxWidth="sm">
      <Formik
        initialValues={initFormValues}
        validationSchema={formSchema}
        validateOnChange={false}
        validateOnBlur={false}
        onSubmit={handleFormSubmit}
        innerRef={formRef}
      >
        {({ values, errors, touched, setFieldValue, submitCount }) => (
          <Form className="clinic-adding-form">
            {/* <pre> {JSON.stringify(values, null, 2)}</pre>
            <pre> {JSON.stringify(errors, null, 2)}</pre> */}
            <div className="box-ctnr">
              <div className="box-header">
                <div className="header-text">
                  Step 1: Fill-up the class main information
                </div>
              </div>
              <GetCourseDuration />
              <GetTutorFutureSessions
                handleSetTutorFutureSessions={handleSetTutorFutureSessions}
              />
              <div className="box-body">
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
                      label="Room"
                      optKeyId="id"
                      optKeyLabel="label"
                      inputFieldName="room_pk"
                      selectFieldName="room_desc"
                      endPoint="api/room/searchRoom"
                      variant="outlined"
                      placeholder="Select room"
                    />
                  </Grid>

                  <Grid xs={12} item>
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
                    <FormikSelect
                      data={DbCourseDurations}
                      label="Duration"
                      name="course_duration"
                      InputLabelProps={{ shrink: true }}
                      variant="outlined"
                      fullWidth
                    />
                  </Grid>

                  <Grid xs={6} item>
                    <FormikInputField
                      name="session_count"
                      label="Number of Sessions"
                      placeholder="Enter the number of sessions"
                      variant="outlined"
                      InputLabelProps={{ shrink: true }}
                      fullWidth
                      type="number"
                    />
                  </Grid>

                  <Grid xs={10} item>
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
                  <Grid xs={2} item>
                    <Tooltip title="See this tutor's PRIOR SCHEDULE">
                      <IconButton
                        onClick={() => {
                          if (values.tutor_pk > 0) {
                            handleSetOpenTutorFutureSched(true);
                          }
                        }}
                      >
                        <EventNoteRoundedIcon />
                      </IconButton>
                    </Tooltip>
                    {openTutorFutureSched && (
                      <InfoDialog
                        open={openTutorFutureSched}
                        handleSetOpen={handleSetOpenTutorFutureSched}
                        // title=
                        title={
                          <span>
                            These are the upcoming sessions of tutor{" "}
                            <span
                              style={{ fontWeight: 900 }}
                            >{` ${values.tutor_name}`}</span>
                          </span>
                        }
                        width={600}
                      >
                        <Grid container spacing={1}>
                          {tutorFutureSession.length <= 0 && (
                            <div className="color">
                              No upcoming sessions yet.
                            </div>
                          )}
                          {tutorFutureSession.map((v, i) => (
                            <Grid key={i} item>
                              <Chip
                                label={
                                  moment(new Date(v.start_date)).format(
                                    "MM/DD/YYYY"
                                  ) +
                                  " " +
                                  v.start_time +
                                  " - " +
                                  v.end_time
                                }
                              />
                            </Grid>
                          ))}
                        </Grid>
                      </InfoDialog>
                    )}
                  </Grid>

                  <Grid xs={6} item>
                    {(() => {
                      const name = "start_date";
                      const label = "Start Date";
                      const errorText =
                        errors[name] && touched[name] ? errors[name] : "";
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
                      const label = "Time Slot";

                      const handleChange = (ts: TimeSlotInterface) => {
                        setFieldValue("start_time", ts.start_time);
                        setFieldValue("end_time", ts.end_time);
                      };

                      const errorText =
                        errors.start_time && touched.start_time
                          ? errors.start_time
                          : "";

                      return (
                        <TextField
                          label={label}
                          // value={`${values.start_time} - ${values.end_time}`}
                          value={JSON.stringify({
                            start_time: values.start_time,
                            end_time: values.end_time,
                          })}
                          fullWidth
                          onChange={(e: any) => {
                            handleChange(JSON.parse(e.target.value));
                          }}
                          error={!!errorText}
                          helperText={errorText}
                          variant="outlined"
                          select
                        >
                          {generateTimeSlot(values?.course_duration).map(
                            (val: any, ind) => (
                              <MenuItem key={ind} value={JSON.stringify(val)}>
                                {val.start_time} - {val.end_time}
                              </MenuItem>
                            )
                          )}
                        </TextField>
                      );
                    })()}
                  </Grid>
                </Grid>
              </div>
            </div>
            <div className="box-ctnr">
              <div className="box-header">
                <div className="header-text">
                  Step 2: Review prior class sessions
                </div>
              </div>

              <div className="box-body">
                <Button
                  startIcon={<DateRangeRoundedIcon />}
                  color="primary"
                  onClick={() => {
                    const session: Array<ClassSessionModel> = [];

                    generateDailyWeekDaysDates({
                      session_count: values.session_count,
                      start_date: values.start_date,
                      start_time: values.start_time,
                      end_time: values.end_time,
                      blocked_dates: tutorFutureSession,
                    }).map((value) =>
                      session.push({
                        start_date: value,
                      })
                    );

                    setFieldValue("class_sessions", session);
                  }}
                >
                  Generate date sessions
                </Button>
                {(() => {
                  const errorText =
                    errors.session_count && touched.session_count
                      ? errors.session_count
                      : "";

                  if (!!errorText) {
                    return <div className="error">{errors.session_count}</div>;
                  }
                })()}
                <Grid container justify="center" spacing={2}></Grid>
                <FieldArray
                  name="class_sessions"
                  render={(arrayHelpers: FieldArrayRenderProps) => {
                    return (
                      <Grid container item spacing={2}>
                        {values?.class_sessions?.map((session, i) => (
                          <Grid item key={i}>
                            <Chip
                              label={`
                                    ${moment(session.start_date).format(
                                      "MM/DD/YYYY"
                                    )} 
                                    -
                                    ${moment(session.start_date).format("dd")}
                                    `}
                              onDelete={() => {
                                setReschedProps({
                                  open: true,
                                  index: i,
                                });
                              }}
                            />
                          </Grid>
                        ))}

                        {(() => {
                          const label = "Start Date";
                          const handleChange = (resched_date: Date) => {
                            let dup = false;

                            values.class_sessions.some((d, i) => {
                              if (
                                moment(d.start_date).isSame(
                                  moment(resched_date)
                                )
                              ) {
                                dup = true;
                                return true;
                              }
                              return false;
                            });

                            if (!dup) {
                              arrayHelpers.push(resched_date);
                              arrayHelpers.remove(reschedProps.index);
                            } else {
                              dispatch(
                                setSnackbar(
                                  "The date you selected has already been added.",
                                  "error"
                                )
                              );
                            }

                            setReschedProps({
                              open: false,
                            });
                          };
                          return (
                            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                              <Grid container justify="space-around">
                                <KeyboardDatePicker
                                  value={values.start_date}
                                  onChange={handleChange}
                                  onClose={() => {
                                    setReschedProps({
                                      open: false,
                                      index: undefined,
                                    });
                                  }}
                                  label={label}
                                  variant="dialog"
                                  open={reschedProps.open}
                                  animateYearScrolling={true}
                                  disablePast={true}
                                  format="MM/dd/yyyy"
                                  placeholder="MM/DD/YYYY"
                                  inputVariant="outlined"
                                  style={{ display: `none`, opacity: 0 }}
                                  InputLabelProps={{
                                    shrink: true,
                                  }}
                                  autoOk={false}
                                  // error={!!errorText}
                                  // helperText={errorText}
                                />
                              </Grid>
                            </MuiPickersUtilsProvider>
                          );
                        })()}
                      </Grid>
                    );
                  }}
                />
              </div>
            </div>
            {/* <Grid xs={12} item>
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
                  </Grid> */}

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
                    Save Class
                  </Button>
                </Grid>
                <Grid item>
                  <Button
                    type="button"
                    color="secondary"
                    size="large"
                    disableElevation
                    onClick={() => {
                      history.push(`/admin/room`);
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
                }}
              >
                Add another record
              </Button>
              <Button
                color="primary"
                disableElevation={false}
                onClick={() => {
                  history.push(`/admin/room`);
                }}
              >
                View all records
              </Button>
            </SuccessDialog>
          </Form>
        )}
      </Formik>
    </Container>
  );
});

export default AddClassAdminView;
