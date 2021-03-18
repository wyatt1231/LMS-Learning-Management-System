import { ClassModel } from "../Models/ClassModel";
import { StatusMasterModel } from "../Models/StatusMasterModel";

interface ClassDataTableModel {
  limit: number;
  count: number;
  begin: number;
  table: Array<ClassModel & StatusMasterModel>;
}

export type ClassReducerTypes =
  | {
      type: "set_class_data_table";
      class_data_table: ClassDataTableModel;
    }
  | {
      type: "fetching_class_data_table";
      fetching_class_data_table: boolean;
    }
  | {
      type: "set_selected_class";
      selected_class: ClassModel & StatusMasterModel;
    }
  | {
      type: "fetching_selected_class";
      fetching_selected_class: boolean;
    }
  | {
      type: "set_tutor_class_table";
      tutor_class_table: ClassDataTableModel;
    }
  | {
      type: "set_fetch_tutor_class_table";
      fetch_tutor_class_table: boolean;
    }
  | {
      type: "student_unenrolled_class_table";
      student_unenrolled_class_table: ClassDataTableModel;
    }
  | {
      type: "fetch_student_unenrolled_class_table";
      fetch_student_unenrolled_class_table: boolean;
    }
  | {
      type: "student_enrolled_class_table";
      student_enrolled_class_table: Array<ClassModel>;
    }
  | {
      type: "fetch_student_enrolled_class_table";
      fetch_student_enrolled_class_table: boolean;
    };

export interface ClassReducerModel {
  class_data_table?: null | ClassDataTableModel;
  fetching_class_data_table: boolean;
  selected_class?: ClassModel & StatusMasterModel;
  fetching_selected_class: boolean;
  tutor_class_table?: ClassDataTableModel;
  fetch_tutor_class_table: boolean;
  student_unenrolled_class_table?: ClassDataTableModel;
  fetch_student_unenrolled_class_table?: boolean;
  student_enrolled_class_table?: Array<ClassModel>;
  fetch_student_enrolled_class_table?: boolean;
}
