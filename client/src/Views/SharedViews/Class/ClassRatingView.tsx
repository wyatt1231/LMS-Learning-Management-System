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
import LinearLoadingProgress from "../../../Component/LinearLoadingProgress";
import { parseDateTimeOrDefault } from "../../../Hooks/UseDateParser";
import ClassStudentActions from "../../../Services/Actions/ClassStudentActions";
import { setGeneralPrompt } from "../../../Services/Actions/PageActions";
import { ClassStudentModel } from "../../../Services/Models/ClassStudentModel";
import { RootStore } from "../../../Services/Store";

interface ClassRatingProps {
  class_pk: number;
}

export const ClassRatingView: FC<ClassRatingProps> = memo(({ class_pk }) => {
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

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Student</TableCell>
              <TableCell>Rating</TableCell>
              <TableCell>Comment</TableCell>
              <TableCell>Rated At</TableCell>
            </TableRow>
          </TableHead>
          <TableBody></TableBody>
        </Table>
      </TableContainer>
    </div>
  );
});

export default ClassRatingView;
