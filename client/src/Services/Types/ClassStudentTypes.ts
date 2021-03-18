import { ClassStudentModel } from "../Models/ClassStudentModel";

export type ClassStudentReducerTypes =
  | {
      type: "set_tbl_class_students";
      tbl_class_students: Array<ClassStudentModel>;
    }
  | {
      type: "set_fetch_tbl_class_students";
      fetch_tbl_class_students: boolean;
    };

export interface ClassStudentReducerModel {
  tbl_class_students?: Array<ClassStudentModel>;
  fetch_tbl_class_students: boolean;
}
