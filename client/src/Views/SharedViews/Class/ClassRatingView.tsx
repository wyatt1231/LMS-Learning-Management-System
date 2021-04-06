import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@material-ui/core";
import { Rating } from "@material-ui/lab";
import React, { FC, memo, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import CustomAvatar from "../../../Component/CustomAvatar";
import LinearLoadingProgress from "../../../Component/LinearLoadingProgress";
import { InvalidDateTimeToDefault } from "../../../Hooks/UseDateParser";
import ClassActions from "../../../Services/Actions/ClassActions";
import ClassStudentActions from "../../../Services/Actions/ClassStudentActions";
import { RootStore } from "../../../Services/Store";

interface ClassRatingProps {
  class_pk: number;
}

export const ClassRatingView: FC<ClassRatingProps> = memo(({ class_pk }) => {
  const dispatch = useDispatch();

  const tbl_class_ratings = useSelector(
    (store: RootStore) => store.ClassReducer.class_ratings
  );

  console.log(`tbl_class_ratings`, tbl_class_ratings);

  const fetch_tbl_class_ratings = useSelector(
    (store: RootStore) => store.ClassReducer.fetch_class_ratings
  );

  useEffect(() => {
    dispatch(ClassActions.getClassRatings(class_pk));
  }, [class_pk, dispatch]);

  return (
    <div className="class-tab">
      <LinearLoadingProgress show={fetch_tbl_class_ratings} />

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Student</TableCell>
              <TableCell width={90}>Rating</TableCell>
              <TableCell width={160}>Rated At</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tbl_class_ratings?.map((r, i) => (
              <TableRow>
                <TableCell>
                  <div className="table-cell-profile no-sub">
                    <CustomAvatar
                      className="img"
                      src={r?.student_info?.picture}
                      errorMessage={r?.student_info?.firstname.charAt(0)}
                    />

                    <div className="title">
                      {r?.student_info?.firstname} {r?.student_info?.middlename}{" "}
                      {r?.student_info?.lastname}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="table-cell-rating">
                    <div className="value">{r.rate_val} stars</div>
                    <div className="start">
                      <Rating
                        name="rating"
                        value={r.rate_val}
                        precision={1}
                        readOnly
                        // size="small"
                      />
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <small>{InvalidDateTimeToDefault(r.rated_at, "-")}</small>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
});

export default ClassRatingView;
