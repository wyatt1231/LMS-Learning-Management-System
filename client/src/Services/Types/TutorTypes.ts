import { TutorModel } from "../Models/TutorModels";

export type TutorReducerTypes =
  | {
      type: "TUTOR_DATA_TABLE";
      tutor_data_table: TutorDataTable;
    }
  | {
      type: "FETCHING_TUTOR_DATA_TABLE";
      fetching_tutor_data_table: boolean;
    }
  | {
      type: "RELOAD_TUTOR_PAGING";
    }
  | {
      type: "SINGLE_TUTOR";
      single_tutor: TutorModel;
    }
  | {
      type: "FETCHING_SINGLE_TUTOR";
      fetching_single_tutor: boolean;
    }
  | {
      type: "RELOAD_SINGLE_TUTOR";
    }
  //
  | {
      type: "loggedin_tutor";
      loggedin_tutor: TutorModel;
    }
  | {
      type: "fetch_loggedin_tutor";
      fetch_loggedin_tutor: boolean;
    }
  //
  | {
      type: "single_tutor_to_student";
      single_tutor_to_student: TutorModel;
    }
  | {
      type: "fetch_single_tutor_to_student";
      fetch_single_tutor_to_student: boolean;
    }
  //
  | {
      type: "most_rated_tutors";
      most_rated_tutors: Array<TutorModel>;
    }
  | {
      type: "fetch_most_rated_tutors";
      fetch_most_rated_tutors: boolean;
    };

export interface TutorReducerModel {
  tutor_data_table?: null | TutorDataTable;
  fetching_tutor_data_table: boolean;
  reload_tutor_paging: number;

  single_tutor?: TutorModel;
  fetching_single_tutor: boolean;
  reload_single_tutor: number;
  //
  loggedin_tutor?: TutorModel;
  fetch_loggedin_tutor?: boolean;
  //
  single_tutor_to_student?: TutorModel;
  fetch_single_tutor_to_student?: boolean;
  //
  most_rated_tutors?: Array<TutorModel>;
  fetch_most_rated_tutors?: boolean;
}

interface TutorDataTable {
  limit: number;
  count: number;
  begin: number;
  table: Array<TutorModel>;
}
