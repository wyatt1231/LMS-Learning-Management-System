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

    case "tutor_session_cal": {
      return {
        ...state,
        tutor_session_cal: action.tutor_session_cal,
      };
    }
    case "fetch_tutor_session_cal": {
      return {
        ...state,
        fetch_tutor_session_cal: action.fetch_tutor_session_cal,
      };
    }

    //
    case "student_session_cal": {
      return {
        ...state,
        student_session_cal: action.student_session_cal,
      };
    }
    case "fetch_student_session_cal": {
      return {
        ...state,
        fetch_student_session_cal: action.fetch_student_session_cal,
      };
    }
    //
    //
    case "logged_in_tutor_session_cal": {
      return {
        ...state,
        logged_in_tutor_session_cal: action.logged_in_tutor_session_cal,
      };
    }
    case "fetch_logged_in_tutor_session_cal": {
      return {
        ...state,
        fetch_logged_in_tutor_session_cal:
          action.fetch_logged_in_tutor_session_cal,
      };
    }
    //
    case "logged_student_calendar": {
      return {
        ...state,
        logged_student_calendar: action.logged_student_calendar,
      };
    }
    case "fetch_logged_student_calendar": {
      return {
        ...state,
        fetch_logged_student_calendar: action.fetch_logged_student_calendar,
      };
    }

    default:
      return state;
  }
};

export default ClassSessionReducer;
