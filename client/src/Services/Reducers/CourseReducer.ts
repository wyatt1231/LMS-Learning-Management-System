import { CourseReducerModel, CourseReducerTypes } from "../Types/CourseTypes";

const defaultState: CourseReducerModel = {
  fetching_course_data_table: false,
  fetching_selected_course: false,
};

const CourseReducer = (
  state: CourseReducerModel = defaultState,
  action: CourseReducerTypes
): CourseReducerModel => {
  switch (action.type) {
    case "set_course_data_table": {
      return {
        ...state,
        course_data_table: action.course_data_table,
      };
    }
    case "fetching_course_data_table": {
      return {
        ...state,
        fetching_course_data_table: action.fetching_course_data_table,
      };
    }

    //--

    case "set_selected_course": {
      return {
        ...state,
        selected_course: action.selected_course,
      };
    }
    case "fetching_selected_course": {
      return {
        ...state,
        fetching_selected_course: action.fetching_selected_course,
      };
    }

    default:
      return state;
  }
};

export default CourseReducer;
