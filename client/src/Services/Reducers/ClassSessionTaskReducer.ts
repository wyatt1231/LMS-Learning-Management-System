import {
  ClassSessionTaskReducerModel,
  ClassSessionTaskReducerTypes,
} from "../Types/ClassSessionTaskTypes";

const defaultState: ClassSessionTaskReducerModel = {};

const ClassSessionTaskReducer = (
  state: ClassSessionTaskReducerModel = defaultState,
  action: ClassSessionTaskReducerTypes
): ClassSessionTaskReducerModel => {
  switch (action.type) {
    case "all_class_task": {
      return {
        ...state,
        all_class_task: action.all_class_task,
      };
    }
    case "fetch_all_class_task": {
      return {
        ...state,
        fetch_all_class_task: action.fetch_all_class_task,
      };
    }

    case "single_class_task": {
      return {
        ...state,
        single_class_task: action.single_class_task,
      };
    }
    case "fetch_single_class_task": {
      return {
        ...state,
        fetch_single_class_task: action.fetch_single_class_task,
      };
    }

    case "all_class_task_ques": {
      return {
        ...state,
        all_class_task_ques: action.all_class_task_ques,
      };
    }
    case "fetch_all_class_task_ques": {
      return {
        ...state,
        fetch_all_class_task_ques: action.fetch_all_class_task_ques,
      };
    }

    case "single_class_task_ques": {
      return {
        ...state,
        single_class_task_ques: action.single_class_task_ques,
      };
    }
    case "fetch_single_class_task_ques": {
      return {
        ...state,
        fetch_single_class_task_ques: action.fetch_single_class_task_ques,
      };
    }

    case "all_class_task_sub": {
      return {
        ...state,
        all_class_task_sub: action.all_class_task_sub,
      };
    }
    case "fetch_all_class_task_sub": {
      return {
        ...state,
        fetch_all_class_task_sub: action.fetch_all_class_task_sub,
      };
    }

    case "all_student_submit": {
      return {
        ...state,
        all_student_submit: action.all_student_submit,
      };
    }
    case "fetch_all_student_submit": {
      return {
        ...state,
        fetch_all_student_submit: action.fetch_all_student_submit,
      };
    }

    default:
      return state;
  }
};

export default ClassSessionTaskReducer;
