import {
  StudentReducerModel,
  StudentReducerTypes,
} from "../Types/StudentTypes";

const defaultState: StudentReducerModel = {
  fetching_selected_student: false,
  fetching_student_data_table: false,
};

const StudentReducer = (
  state: StudentReducerModel = defaultState,
  action: StudentReducerTypes
): StudentReducerModel => {
  switch (action.type) {
    case "set_student_data_table": {
      return {
        ...state,
        student_data_table: action.student_data_table,
      };
    }
    case "fetching_student_data_table": {
      return {
        ...state,
        fetching_student_data_table: action.fetching_student_data_table,
      };
    }

    //--

    case "set_selected_student": {
      return {
        ...state,
        selected_student: action.selected_student,
      };
    }
    case "fetching_selected_student": {
      return {
        ...state,
        fetching_selected_student: action.fetching_selected_student,
      };
    }

    default:
      return state;
  }
};

export default StudentReducer;
