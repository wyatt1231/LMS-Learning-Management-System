import { TutorReducerModel, TutorReducerTypes } from "../Types/TutorTypes";

const defaultState: TutorReducerModel = {
  reload_single_tutor: 0,
  reload_tutor_paging: 0,
  fetching_single_tutor: false,
  fetching_tutor_data_table: false,
};

const TutorReducer = (
  state: TutorReducerModel = defaultState,
  action: TutorReducerTypes
): TutorReducerModel => {
  switch (action.type) {
    case "TUTOR_DATA_TABLE": {
      return {
        ...state,
        tutor_data_table: action.tutor_data_table,
      };
    }
    case "FETCHING_TUTOR_DATA_TABLE": {
      return {
        ...state,
        fetching_tutor_data_table: action.fetching_tutor_data_table,
      };
    }
    case "RELOAD_TUTOR_PAGING": {
      return {
        ...state,
        reload_tutor_paging: state.reload_tutor_paging++,
      };
    }

    case "SINGLE_TUTOR": {
      return {
        ...state,
        single_tutor: state.single_tutor,
      };
    }
    case "FETCHING_SINGLE_TUTOR": {
      return {
        ...state,
        fetching_single_tutor: state.fetching_single_tutor,
      };
    }
    case "RELOAD_SINGLE_TUTOR": {
      return {
        ...state,
        reload_single_tutor: state.reload_single_tutor++,
      };
    }

    default:
      return state;
  }
};

export default TutorReducer;
