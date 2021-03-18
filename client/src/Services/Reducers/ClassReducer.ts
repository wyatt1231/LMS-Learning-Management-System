import { ClassReducerModel, ClassReducerTypes } from "../Types/ClassTypes";

const defaultState: ClassReducerModel = {
  fetching_class_data_table: false,
  fetching_selected_class: false,
  fetch_tutor_class_table: false,
};

const ClassReducer = (
  state: ClassReducerModel = defaultState,
  action: ClassReducerTypes
): ClassReducerModel => {
  switch (action.type) {
    case "set_class_data_table": {
      return {
        ...state,
        class_data_table: action.class_data_table,
      };
    }
    case "fetching_class_data_table": {
      return {
        ...state,
        fetching_class_data_table: action.fetching_class_data_table,
      };
    }

    case "set_selected_class": {
      return {
        ...state,
        selected_class: action.selected_class,
      };
    }
    case "fetching_selected_class": {
      return {
        ...state,
        fetching_selected_class: action.fetching_selected_class,
      };
    }

    case "set_tutor_class_table": {
      return {
        ...state,
        tutor_class_table: action.tutor_class_table,
      };
    }

    case "set_fetch_tutor_class_table": {
      return {
        ...state,
        fetch_tutor_class_table: action.fetch_tutor_class_table,
      };
    }

    case "student_unenrolled_class_table": {
      return {
        ...state,
        student_unenrolled_class_table: action.student_unenrolled_class_table,
      };
    }

    case "fetch_student_unenrolled_class_table": {
      return {
        ...state,
        fetch_student_unenrolled_class_table:
          action.fetch_student_unenrolled_class_table,
      };
    }

    case "student_enrolled_class_table": {
      return {
        ...state,
        student_enrolled_class_table: action.student_enrolled_class_table,
      };
    }

    case "fetch_student_enrolled_class_table": {
      return {
        ...state,
        fetch_student_enrolled_class_table:
          action.fetch_student_enrolled_class_table,
      };
    }

    default:
      return state;
  }
};

export default ClassReducer;
