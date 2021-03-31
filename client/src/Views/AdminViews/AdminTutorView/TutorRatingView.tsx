import {
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@material-ui/core";
import React, { memo, FC } from "react";

interface TutorRatingViewProps {
  tutor_pk: number;
}

export const TutorRatingView: FC<TutorRatingViewProps> = memo(
  ({ tutor_pk }) => {
    return (
      <>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Rated By</TableCell>
                <TableCell>Rating Given</TableCell>
                <TableCell>Rated At</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {/* {tbl_class_students?.map((student, index) => (
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
                </TableRow>
              ))} */}
            </TableBody>
          </Table>
        </TableContainer>
      </>
    );
  }
);

export default TutorRatingView;
