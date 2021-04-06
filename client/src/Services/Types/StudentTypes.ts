import { StatusMasterModel } from "../Models/StatusMasterModel";
import { StudentModel } from "../Models/StudentModel";

export type StudentReducerTypes =
  | {
      type: "set_student_data_table";
      student_data_table: StudentDataTable;
    }
  | {
      type: "fetching_student_data_table";
      fetching_student_data_table: boolean;
    }
  | {
      type: "set_selected_student";
      selected_student: StudentModel & StatusMasterModel;
    }
  | {
      type: "fetching_selected_student";
      fetching_selected_student: boolean;
    }
  //
  | {
      type: "logged_student_info";
      logged_student_info: StudentModel;
    }
  | {
      type: "fetch_logged_student_info";
      fetch_logged_student_info: boolean;
    };

export interface StudentReducerModel {
  student_data_table?: null | StudentDataTable;
  fetching_student_data_table: boolean;
  selected_student?: StudentModel & StatusMasterModel;
  fetching_selected_student: boolean;

  logged_student_info?: StudentModel;
  fetch_logged_student_info?: boolean;
}

interface StudentDataTable {
  limit: number;
  count: number;
  begin: number;
  table: Array<StudentModel & StatusMasterModel>;
}
