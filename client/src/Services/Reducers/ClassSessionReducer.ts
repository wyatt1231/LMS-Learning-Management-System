import {
  ClassSessionReducerModel,
  ClassSessionReducerTypes,
} from "../Types/ClassSessionTypes";

const defaultState: ClassSessionReducerModel = {
  fetch_stats_class_session: false,
  fetch_tutor_class_sessions: false,
  fetch_class_sessions: false,
};

const ClassSessionReducer = (
  state: ClassSessionReducerModel = defaultState,
  action: ClassSessionReducerTypes
): ClassSessionReducerModel => {
  switch (action.type) {
    case "set_fetch_tutor_class_sessions": {
      return {
        ...state,
        fetch_tutor_class_sessions: action.fetch_tutor_class_sessions,
      };
    }
    case "set_tutor_class_sessions": {
      return {
        ...state,
        tutor_class_sessions: action.tutor_class_sessions,
      };
    }

    //--

    case "set_fetch_stats_class_session": {
      return {
        ...state,
        fetch_stats_class_session: action.fetch_stats_class_session,
      };
    }
    case "set_stats_class_session": {
      return {
        ...state,
        stats_class_session: action.stats_class_session,
      };
    }

    case "set_class_sessions": {
      return {
        ...state,
        class_sessions: action.class_sessions,
      };
    }
    case "set_fetch_class_sessions": {
      return {
        ...state,
        fetch_class_sessions: action.fetch_class_sessions,
      };
    }

    case "single_class_session": {
      return {
        ...state,
        single_class_session: action.single_class_session,
      };
    }
    case "fetch_single_class_session": {
      return {
        ...state,
        fetch_single_class_session: action.fetch_single_class_session,
      };
    }

    default:
      return state;
  }
};

export default ClassSessionReducer;
