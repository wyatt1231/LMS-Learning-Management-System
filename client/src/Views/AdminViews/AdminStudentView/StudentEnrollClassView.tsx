import {
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
} from "@material-ui/core";
import React, { FC, memo, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import CustomAvatar from "../../../Component/CustomAvatar";
import LinearGraph from "../../../Component/LinearGraph";
import ClassActions from "../../../Services/Actions/ClassActions";
import { RootStore } from "../../../Services/Store";

interface StudentEnrollClassProps {
  student_pk: number;
}

export const StudentEnrollClassView: FC<StudentEnrollClassProps> = memo(
  ({ student_pk }) => {
    const dispatch = useDispatch();

    const student_class_by_student_pk = useSelector(
      (store: RootStore) => store.ClassReducer.student_class_by_student_pk
    );

    console.log(`student_class_by_student_pk`, student_class_by_student_pk);

    const fetch_student_class_by_student_pk = useSelector(
      (store: RootStore) => store.ClassReducer.fetch_student_class_by_student_pk
    );

    useEffect(() => {
      dispatch(ClassActions.getStudentClassByStudentPk(student_pk));
    }, [dispatch, student_pk]);

    return (
      <>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Class Description</TableCell>
                <TableCell>Tutor</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Session Progress</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {!fetch_student_class_by_student_pk &&
                student_class_by_student_pk?.length < 1 && (
                  <TableRow>
                    <TableCell align="center" colSpan={4}>
                      No class has been assigned yet.
                    </TableCell>
                  </TableRow>
                )}

              {student_class_by_student_pk?.map((c, i) => (
                <TableRow key={i}>
                  <TableCell>
                    <div
                      style={{
                        fontWeight: 500,
                      }}
                    >
                      {c.class_desc}
                    </div>
                    <div
                      style={{
                        opacity: 0.87,
                        fontWeight: 500,
                        fontSize: `.87em`,
                      }}
                    >
                      {c.course_desc}
                    </div>
                  </TableCell>
                  <TableCell>
                    {/* <AverageRating value={2} /> */}

                    <div className="table-profile">
                      <CustomAvatar
                        src={c.tutor_pic}
                        errorMessage={c.tutor_name?.charAt(0)}
                      />
                      <div className="title">{c.tutor_name}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={c?.status?.sts_desc}
                      size="small"
                      style={{
                        color: c?.status?.sts_color,
                        backgroundColor: c?.status?.sts_bgcolor,
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    {/* {c?.ended_session} */}

                    <Tooltip
                      title={`${c?.ended_session} of ${c?.session_count}`}
                      arrow
                    >
                      <div>
                        <LinearGraph
                          progress_count={c?.ended_session}
                          total={c?.session_count}
                        />
                      </div>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </>
    );
  }
);

export default StudentEnrollClassView;
