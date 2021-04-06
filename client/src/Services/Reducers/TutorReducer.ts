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
        single_tutor: action.single_tutor,
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
    //
    case "loggedin_tutor": {
      return {
        ...state,
        loggedin_tutor: action.loggedin_tutor,
      };
    }
    case "fetch_loggedin_tutor": {
      return {
        ...state,
        fetch_loggedin_tutor: action.fetch_loggedin_tutor,
      };
    }
    //
    case "single_tutor_to_student": {
      return {
        ...state,
        single_tutor_to_student: action.single_tutor_to_student,
      };
    }
    case "fetch_single_tutor_to_student": {
      return {
        ...state,
        fetch_single_tutor_to_student: action.fetch_single_tutor_to_student,
      };
    }

    //
    case "most_rated_tutors": {
      return {
        ...state,
        most_rated_tutors: action.most_rated_tutors,
      };
    }
    case "fetch_most_rated_tutors": {
      return {
        ...state,
        fetch_most_rated_tutors: action.fetch_most_rated_tutors,
      };
    }

    default:
      return state;
  }
};

export default TutorReducer;
