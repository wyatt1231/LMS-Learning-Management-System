import { ClassModel } from "../Models/ClassModel";
import { ClassRatingModel } from "../Models/ClassRatingModel";
import { ClassRequestModel } from "../Models/ClassRequestModel";
import { StatsModel } from "../Models/StatsModel";
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
    }
  | {
      type: "all_tutor_classes";
      all_tutor_classes: Array<ClassModel>;
    }
  | {
      type: "fetch_all_tutor_classes";
      fetch_all_tutor_classes: boolean;
    }
  //
  | {
      type: "student_class_by_student_pk";
      student_class_by_student_pk: Array<ClassModel>;
    }
  | {
      type: "fetch_student_class_by_student_pk";
      fetch_student_class_by_student_pk: boolean;
    }
  //
  | {
      type: "class_summary_status";
      class_summary_status: Array<StatsModel>;
    }
  | {
      type: "fetch_class_summary_status";
      fetch_class_summary_status: boolean;
    }
  //
  | {
      type: "open_class_progress_stats";
      open_class_progress_stats: Array<ClassModel>;
    }
  | {
      type: "fetch_open_class_progress_stats";
      fetch_open_class_progress_stats: boolean;
    }
  //
  | {
      type: "total_tutor_class_stats";
      total_tutor_class_stats: Array<StatsModel>;
    }
  | {
      type: "fetch_total_tutor_class_stats";
      fetch_total_tutor_class_stats: boolean;
    }
  | {
      type: "total_student_class_stats";
      total_student_class_stats: Array<StatsModel>;
    }
  | {
      type: "fetch_total_student_class_stats";
      fetch_total_student_class_stats: boolean;
    }
  //
  | {
      type: "ended_class_rating_stats";
      ended_class_rating_stats: Array<StatsModel>;
    }
  | {
      type: "fetch_ended_class_rating_stats";
      fetch_ended_class_rating_stats: boolean;
    }
  // new
  | {
      type: "student_available_class_table";
      student_available_class_table: ClassDataTableModel;
    }
  | {
      type: "fetch_student_available_class_table";
      fetch_student_available_class_table: boolean;
    }
  //
  | {
      type: "student_ongoing_class_table";
      student_ongoing_class_table: ClassDataTableModel;
    }
  | {
      type: "fetch_student_ongoing_class_table";
      fetch_student_ongoing_class_table: boolean;
    }
  //
  | {
      type: "student_ended_class_table";
      student_ended_class_table: ClassDataTableModel;
    }
  | {
      type: "fetch_student_ended_class_table";
      fetch_student_ended_class_table: boolean;
    }
  //
  | {
      type: "class_ratings";
      class_ratings: Array<ClassRatingModel>;
    }
  | {
      type: "fetch_class_ratings";
      fetch_class_ratings: boolean;
    }
  //
  | {
      type: "class_req";
      class_req: Array<ClassRequestModel>;
    }
  | {
      type: "fetch_class_req";
      fetch_class_req: boolean;
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

  all_tutor_classes?: Array<ClassModel>;
  fetch_all_tutor_classes?: boolean;

  student_class_by_student_pk?: Array<ClassModel>;
  fetch_student_class_by_student_pk?: boolean;
  //
  class_summary_status?: Array<StatsModel>;
  fetch_class_summary_status?: boolean;
  //
  open_class_progress_stats?: Array<ClassModel>;
  fetch_open_class_progress_stats?: boolean;
  //
  total_tutor_class_stats?: Array<StatsModel>;
  fetch_total_tutor_class_stats?: boolean;

  total_student_class_stats?: Array<StatsModel>;
  fetch_total_student_class_stats?: boolean;
  //
  student_available_class_table?: ClassDataTableModel;
  fetch_student_available_class_table?: boolean;
  //
  student_ongoing_class_table?: ClassDataTableModel;
  fetch_student_ongoing_class_table?: boolean;
  //
  student_ended_class_table?: ClassDataTableModel;
  fetch_student_ended_class_table?: boolean;
  //
  ended_class_rating_stats?: Array<StatsModel>;
  fetch_ended_class_rating_stats?: boolean;
  //
  class_ratings?: Array<ClassRatingModel>;
  fetch_class_ratings?: boolean;
  //
  class_req?: Array<ClassRequestModel>;
  fetch_class_req?: boolean;
}
