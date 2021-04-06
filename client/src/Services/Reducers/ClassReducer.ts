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

    case "all_tutor_classes": {
      return {
        ...state,
        all_tutor_classes: action.all_tutor_classes,
      };
    }

    case "fetch_all_tutor_classes": {
      return {
        ...state,
        fetch_all_tutor_classes: action.fetch_all_tutor_classes,
      };
    }

    //
    case "student_class_by_student_pk": {
      return {
        ...state,
        student_class_by_student_pk: action.student_class_by_student_pk,
      };
    }

    case "fetch_student_class_by_student_pk": {
      return {
        ...state,
        fetch_student_class_by_student_pk:
          action.fetch_student_class_by_student_pk,
      };
    }
    //
    case "class_summary_status": {
      return {
        ...state,
        class_summary_status: action.class_summary_status,
      };
    }

    case "fetch_class_summary_status": {
      return {
        ...state,
        fetch_class_summary_status: action.fetch_class_summary_status,
      };
    }
    //
    case "open_class_progress_stats": {
      return {
        ...state,
        open_class_progress_stats: action.open_class_progress_stats,
      };
    }

    case "fetch_open_class_progress_stats": {
      return {
        ...state,
        fetch_open_class_progress_stats: action.fetch_open_class_progress_stats,
      };
    }
    //
    case "total_tutor_class_stats": {
      return {
        ...state,
        total_tutor_class_stats: action.total_tutor_class_stats,
      };
    }
    case "fetch_total_tutor_class_stats": {
      return {
        ...state,
        fetch_total_tutor_class_stats: action.fetch_total_tutor_class_stats,
      };
    }

    case "total_student_class_stats": {
      return {
        ...state,
        total_student_class_stats: action.total_student_class_stats,
      };
    }
    case "fetch_total_student_class_stats": {
      return {
        ...state,
        fetch_total_student_class_stats: action.fetch_total_student_class_stats,
      };
    }
    //new
    //
    case "student_available_class_table": {
      return {
        ...state,
        student_available_class_table: action.student_available_class_table,
      };
    }
    case "fetch_student_available_class_table": {
      return {
        ...state,
        fetch_student_available_class_table:
          action.fetch_student_available_class_table,
      };
    }
    //
    case "student_ongoing_class_table": {
      return {
        ...state,
        student_ongoing_class_table: action.student_ongoing_class_table,
      };
    }
    case "fetch_student_ongoing_class_table": {
      return {
        ...state,
        fetch_student_ongoing_class_table:
          action.fetch_student_ongoing_class_table,
      };
    }
    //
    case "student_ended_class_table": {
      return {
        ...state,
        student_ended_class_table: action.student_ended_class_table,
      };
    }
    case "fetch_student_ended_class_table": {
      return {
        ...state,
        fetch_student_ended_class_table: action.fetch_student_ended_class_table,
      };
    }
    //
    case "ended_class_rating_stats": {
      return {
        ...state,
        ended_class_rating_stats: action.ended_class_rating_stats,
      };
    }
    case "fetch_ended_class_rating_stats": {
      return {
        ...state,
        fetch_ended_class_rating_stats: action.fetch_ended_class_rating_stats,
      };
    }

    //
    case "class_ratings": {
      return {
        ...state,
        class_ratings: action.class_ratings,
      };
    }
    case "fetch_class_ratings": {
      return {
        ...state,
        fetch_class_ratings: action.fetch_class_ratings,
      };
    }

    default:
      return state;
  }
};

export default ClassReducer;
