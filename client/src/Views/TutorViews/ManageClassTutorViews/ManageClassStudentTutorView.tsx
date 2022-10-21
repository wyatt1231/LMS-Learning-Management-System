import {
  Button,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@material-ui/core";
import { Form, Formik } from "formik";
import React, { FC, memo, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import CustomAvatar from "../../../Component/CustomAvatar";
import FormDialog from "../../../Component/FormDialog/FormDialog";
import FormikAutocomplete from "../../../Component/Formik/FormikAutocomplete";
import IconButtonPopper from "../../../Component/IconButtonPopper/IconButtonPopper";
import LinearLoadingProgress from "../../../Component/LinearLoadingProgress";
import { parseDateTimeOrDefault } from "../../../Hooks/UseDateParser";
import ClassStudentActions from "../../../Services/Actions/ClassStudentActions";
import { setGeneralPrompt } from "../../../Services/Actions/PageActions";
import { ClassStudentModel } from "../../../Services/Models/ClassStudentModel";
import { RootStore } from "../../../Services/Store";

interface ManageClassStudentTutorInterface {
  class_pk: number;
}

export const ManageClassStudentTutorView: FC<ManageClassStudentTutorInterface> =
  memo(({ class_pk }) => {
    const dispatch = useDispatch();

    const tbl_class_students = useSelector(
      (store: RootStore) => store.ClassStudentReducer.tbl_class_students
    );
    const fetch_tbl_class_students = useSelector(
      (store: RootStore) => store.ClassStudentReducer.fetch_tbl_class_students
    );

    const [openEnrollStudentModel, setOpenEnrollStudentModel] = useState(false);

    const user_type = useSelector(
      (store: RootStore) => store.UserReducer.user?.user_type
    );

    useEffect(() => {
      let mounted = true;

      const fetch_data = () => {
        dispatch(ClassStudentActions.setTblClassStudentsAction(class_pk));
      };

      mounted && fetch_data();

      return () => {
        mounted = false;
      };
    }, [class_pk, dispatch]);

    return (
      <div className="class-tab">
        <LinearLoadingProgress show={fetch_tbl_class_students} />
        <Grid item container justify="flex-end">
          {user_type === "tutor" && (
            <Grid item>
              <Button
                color="primary"
                variant="contained"
                disableElevation
                onClick={() => {
                  setOpenEnrollStudentModel(true);
                }}
              >
                Enroll a Student
              </Button>
            </Grid>
          )}
        </Grid>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Basic Info</TableCell>
                <TableCell>Gender</TableCell>
                <TableCell>Enrolled At</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tbl_class_students?.map((student, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <div className="table-cell-profile">
                      <CustomAvatar
                        className="image"
                        src={`${student.student_details.picture}`}
                        errorMessage={`${student.student_details.firstname?.charAt(
                          0
                        )}${student.student_details.lastname?.charAt(0)}`}
                      />
                      <div className="title">
                        <span style={{ textTransform: "capitalize" }}>
                          {student.student_details.firstname}{" "}
                          {student.student_details.middlename}{" "}
                          {student.student_details.lastname}{" "}
                          {student.student_details.suffix}
                        </span>
                      </div>
                      <div className="sub-title">
                        Grade {student.student_details.grade}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {student.student_details.gender === "m" ? "Male" : "Female"}
                  </TableCell>
                  <TableCell>
                    {parseDateTimeOrDefault(student.encoded_at, "-")}
                  </TableCell>
                  <TableCell align="center">
                    <div className="actions">
                      <IconButtonPopper
                        style={{ justifySelf: `end` }}
                        buttons={[
                          {
                            text: "View Material",
                            handleClick: () => {},
                          },
                        ]}
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <FormDialog
          open={openEnrollStudentModel}
          title="Choose a student to enroll"
          handleClose={() => setOpenEnrollStudentModel(false)}
          minWidth={500}
          body={
            <Formik
              initialValues={{
                student_pk: "",
                student_name: "",
              }}
              onSubmit={(values, formikHelpers) => {
                const payload: ClassStudentModel = {
                  student_pk: parseInt(values.student_pk),
                  class_pk: class_pk,
                  student_name: values.student_name,
                };

                dispatch(
                  setGeneralPrompt({
                    open: true,
                    continue_callback: () =>
                      dispatch(
                        ClassStudentActions.enrollClassStudentAction(
                          payload,
                          (msg: string) => {
                            formikHelpers.resetForm();
                            setOpenEnrollStudentModel(false);
                          }
                        )
                      ),
                  })
                );
              }}
            >
              <Form>
                <Grid container spacing={2} style={{ padding: `1em 0` }}>
                  <Grid item xs={12}>
                    <FormikAutocomplete
                      label="Student"
                      optKeyId="id"
                      optKeyLabel="label"
                      inputFieldName="student_pk"
                      selectFieldName="student_name"
                      endPoint="api/student/searchStudentNotInClass"
                      variant="outlined"
                      placeholder="Enter the student name"
                      other_payload={{
                        class_pk: class_pk,
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} container justify="flex-end">
                    <Grid item>
                      <Button
                        color="primary"
                        type="submit"
                        disableElevation
                        variant="contained"
                      >
                        Enroll Student
                      </Button>
                    </Grid>
                  </Grid>
                </Grid>
              </Form>
            </Formik>
          }
        />
      </div>
    );
  });

export default ManageClassStudentTutorView;
