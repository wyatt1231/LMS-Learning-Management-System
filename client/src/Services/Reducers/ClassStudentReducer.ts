import {
  ClassStudentReducerModel,
  ClassStudentReducerTypes,
} from "../Types/ClassStudentTypes";

const defaultState: ClassStudentReducerModel = {
  fetch_tbl_class_students: false,
};

const ClassStudentReducer = (
  state: ClassStudentReducerModel = defaultState,
  action: ClassStudentReducerTypes
): ClassStudentReducerModel => {
  switch (action.type) {
    case "set_tbl_class_students": {
      return {
        ...state,
        tbl_class_students: action.tbl_class_students,
      };
    }
    case "set_fetch_tbl_class_students": {
      return {
        ...state,
        fetch_tbl_class_students: action.fetch_tbl_class_students,
      };
    }

    default:
      return state;
  }
};

export default ClassStudentReducer;
