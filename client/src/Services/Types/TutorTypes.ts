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
    };

export interface TutorReducerModel {
  tutor_data_table?: null | TutorDataTable;
  fetching_tutor_data_table: boolean;
  reload_tutor_paging: number;

  single_tutor?: TutorModel;
  fetching_single_tutor: boolean;
  reload_single_tutor: number;
}

interface TutorDataTable {
  limit: number;
  count: number;
  begin: number;
  table: Array<TutorModel>;
}
