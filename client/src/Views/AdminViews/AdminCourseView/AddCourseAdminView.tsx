import { Button, Container, Grid } from "@material-ui/core";
import { Form, Formik, FormikProps } from "formik";
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
import * as yup from "yup";
import FormikInputField from "../../../Component/Formik/FormikInputField";
import FormikSelect from "../../../Component/Formik/FormikSelect";
import PhotoField from "../../../Component/PhotoField/PhotoField";
import SuccessDialog from "../../../Component/SuccessDialog";
import { fileToBase64 } from "../../../Hooks/UseFileConverter";
import { addCourseApiAction } from "../../../Services/Actions/CourseActions";

import {
  setGeneralPrompt,
  setPageLinks,
} from "../../../Services/Actions/PageActions";
import { CourseModel } from "../../../Services/Models/CourseModel";
import { DbCourseDurations } from "../../../Storage/LocalDatabase";

interface AddCourseAdminViewInterface {}

const initFormValues: CourseModel = {
  course_desc: "",
  est_duration: 30,
  picture: "",
  notes: "",
};

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

export const AddCourseAdminView: FC<AddCourseAdminViewInterface> = memo(() => {
  const dispatch = useDispatch();
  const history = useHistory();

  const formRef = useRef<FormikProps<CourseModel> | null>(null);

  const [successDialog, setSuccessDialog] = useState({
    open: false,
    message: "",
  });

  const [pic, setPic] = useState<File | null>(null);
  const handleSetPic = useCallback((logo) => {
    setPic(logo);
  }, []);

  const handleFormSubmit = useCallback(
    async (formValues: CourseModel) => {
      formValues.picture = await fileToBase64(pic);

      dispatch(
        setGeneralPrompt({
          open: true,
          continue_callback: () =>
            dispatch(
              addCourseApiAction(formValues, (msg: string) => {
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
            link: "/admin/course",
            title: "Courses",
          },
          {
            link: window.location.pathname,
            title: "Add Course",
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
        {({ values, errors, touched, setFieldValue }) => (
          <Form
            className="clinic-adding-form"
            style={{
              backgroundColor: `#fff`,
              borderRadius: 10,
              padding: `1em 2em`,
            }}
          >
            <div className="box-ctnr">
              <div className="box-header">
                <div className="header-text">Fill-up the course details</div>
              </div>
              <div className="box-body">
                <Grid container justify="center" spacing={2}>
                  <Grid xs={12} container justify="center" item>
                    <div style={{ padding: "1.5em 0" }}>
                      <PhotoField
                        label=""
                        height={180}
                        width={300}
                        selectedFile={pic}
                        name="pic"
                        variant="rounded"
                        handleChange={handleSetPic}
                      />
                    </div>
                  </Grid>

                  <Grid
                    xs={12}
                    item
                    container
                    justify="flex-start"
                    spacing={2}
                    style={{ padding: "1em" }}
                  >
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
                    Save Course
                  </Button>
                </Grid>
                <Grid item>
                  <Button
                    type="button"
                    color="secondary"
                    size="large"
                    disableElevation
                    onClick={() => {
                      history.push(`/admin/course`);
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
                Add another record
              </Button>
              <Button
                color="primary"
                disableElevation={false}
                onClick={() => {
                  history.push(`/admin/course`);
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

export default AddCourseAdminView;
