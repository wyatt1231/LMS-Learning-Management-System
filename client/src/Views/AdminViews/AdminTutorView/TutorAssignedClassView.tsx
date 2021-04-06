import {
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Chip,
  Tooltip,
} from "@material-ui/core";
import React, { memo, FC, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import AverageRating from "../../../Component/AverageRating";
import LinearGraph from "../../../Component/LinearGraph";
import LinearLoadingProgress from "../../../Component/LinearLoadingProgress";
import ClassActions from "../../../Services/Actions/ClassActions";
import ClassSessionActions from "../../../Services/Actions/ClassSessionActions";
import { RootStore } from "../../../Services/Store";
interface TutorAssignedClassProps {
  tutor_pk: number;
}

export const TutorAssignedClassView: FC<TutorAssignedClassProps> = memo(
  ({ tutor_pk }) => {
    const dispatch = useDispatch();

    const all_tutor_classes = useSelector(
      (store: RootStore) => store.ClassReducer.all_tutor_classes
    );

    const fetch_all_tutor_classes = useSelector(
      (store: RootStore) => store.ClassReducer.fetch_all_tutor_classes
    );

    console.log(`all_tutor_classes`, all_tutor_classes);

    useEffect(() => {
      dispatch(ClassActions.getAllTutorClasses(tutor_pk));
    }, [dispatch, tutor_pk]);

    return (
      <>
        <TableContainer>
          <LinearLoadingProgress show={fetch_all_tutor_classes} />
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Class Description</TableCell>
                {/* <TableCell>Rating</TableCell> */}
                <TableCell>Status</TableCell>
                <TableCell>Session Progress</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {!fetch_all_tutor_classes && all_tutor_classes?.length < 1 && (
                <TableRow>
                  <TableCell align="center" colSpan={4}>
                    No class has been assigned yet.
                  </TableCell>
                </TableRow>
              )}

              {all_tutor_classes?.map((c, i) => (
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
                  {/* <TableCell>
                    <AverageRating value={2} />
                  </TableCell> */}
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

export default TutorAssignedClassView;
