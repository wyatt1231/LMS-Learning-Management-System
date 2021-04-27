import { Dispatch } from "react";
import helperErrorMessage from "../../Helpers/helperErrorMessage";
import IServerResponse from "../Interface/IServerResponse";
import { PaginationModel } from "../Models/PaginationModels";
import { PageReducerTypes } from "../Types/PageTypes";
import { ClassReducerTypes } from "../Types/ClassTypes";
import { ClassModel } from "../Models/ClassModel";
import ClassApi from "../Api/ClassApi";
import { ClassRatingModel } from "../Models/ClassRatingModel";

export const setClassDataTableAction = (payload: PaginationModel) => async (
  dispatch: Dispatch<ClassReducerTypes>
) => {
  try {
    dispatch({
      type: "fetching_class_data_table",
      fetching_class_data_table: true,
    });
    const response: IServerResponse = await ClassApi.getClassDataTableApi(
      payload
    );
    dispatch({
      type: "fetching_class_data_table",
      fetching_class_data_table: false,
    });
    if (response.success) {
      dispatch({
        type: "set_class_data_table",
        class_data_table: response.data,
      });
    } else {
    }
  } catch (error) {
    console.error(`action error`, error);
  }
};

export const setTutorClassTableAction = (payload: PaginationModel) => async (
  dispatch: Dispatch<ClassReducerTypes>
) => {
  try {
    dispatch({
      type: "set_fetch_tutor_class_table",
      fetch_tutor_class_table: true,
    });
    const response: IServerResponse = await ClassApi.getTutorClassTableApi(
      payload
    );
    dispatch({
      type: "set_fetch_tutor_class_table",
      fetch_tutor_class_table: false,
    });
    if (response.success) {
      dispatch({
        type: "set_tutor_class_table",
        tutor_class_table: response.data,
      });
    } else {
    }
  } catch (error) {
    console.error(`action error`, error);
  }
};

export const setStudentUnenrolledClassTable = (
  payload: PaginationModel
) => async (dispatch: Dispatch<ClassReducerTypes>) => {
  try {
    dispatch({
      type: "fetch_student_unenrolled_class_table",
      fetch_student_unenrolled_class_table: true,
    });
    const response: IServerResponse = await ClassApi.getStudentUnenrolledClassTableApi(
      payload
    );

    console.log(`unenroled`, response);

    if (response.success) {
      dispatch({
        type: "student_unenrolled_class_table",
        student_unenrolled_class_table: response.data,
      });
    }
    dispatch({
      type: "fetch_student_unenrolled_class_table",
      fetch_student_unenrolled_class_table: false,
    });
  } catch (error) {
    console.error(`action error`, error);
  }
};

export const setStudentEnrolledClassTable = () => async (
  dispatch: Dispatch<ClassReducerTypes>
) => {
  try {
    dispatch({
      type: "fetch_student_enrolled_class_table",
      fetch_student_enrolled_class_table: true,
    });
    const response: IServerResponse = await ClassApi.getStudentEnrolledClassesApi();

    if (response.success) {
      dispatch({
        type: "student_enrolled_class_table",
        student_enrolled_class_table: response.data,
      });
    }
    dispatch({
      type: "fetch_student_enrolled_class_table",
      fetch_student_enrolled_class_table: false,
    });
  } catch (error) {
    console.error(`action error`, error);
  }
};

export const setSelectedClassAction = (
  course_pk: number,
  user_id?: number,
  set_notif?: any
) => async (dispatch: Dispatch<ClassReducerTypes>) => {
  try {
    dispatch({
      type: "fetching_selected_class",
      fetching_selected_class: true,
    });
    const response: IServerResponse = await ClassApi.getSingleClassApi(
      course_pk
    );

    if (response.success) {
      dispatch({
        type: "set_selected_class",
        selected_class: response.data,
      });

      console.log(`set_notif`, set_notif, user_id);

      if (typeof set_notif !== "undefined" && typeof user_id !== "undefined") {
        set_notif.emit("notify_tutors", user_id);
      }
    }

    dispatch({
      type: "fetching_selected_class",
      fetching_selected_class: false,
    });
  } catch (error) {
    console.error(`action error`, error);
  }
};

export const addClassAction = (
  payload: ClassModel,
  set_notif_socket: any,
  onSuccess: (msg: string) => any
) => async (dispatch: Dispatch<ClassReducerTypes | PageReducerTypes>) => {
  try {
    dispatch({
      type: "SET_PAGE_LOADING",
      page_loading: {
        loading_message: "Loading, thank you for your patience!",
        show: true,
      },
    });
    const response: IServerResponse = await ClassApi.addClassApi(payload);
    dispatch({
      type: "SET_PAGE_LOADING",
      page_loading: {
        show: false,
      },
    });
    if (response.success) {
      if (typeof onSuccess === "function") {
        onSuccess(response?.message.toString());

        if (!!set_notif_socket && !!response?.data?.tutor_user_id) {
          set_notif_socket.emit("notify_tutors", response.data.tutor_user_id);
        }
      }
    } else {
      helperErrorMessage(dispatch, response);
    }
  } catch (error) {
    console.error(`action error`, error);
  }
};

const declineClass = (
  payload: ClassModel,
  onSuccess: (msg: string) => any
) => async (dispatch: Dispatch<ClassReducerTypes | PageReducerTypes>) => {
  try {
    dispatch({
      type: "SET_PAGE_LOADING",
      page_loading: {
        loading_message: "Loading, thank you for your patience!",
        show: true,
      },
    });
    const response: IServerResponse = await ClassApi.declineClass(payload);
    dispatch({
      type: "SET_PAGE_LOADING",
      page_loading: {
        show: false,
      },
    });
    if (response.success) {
      if (typeof onSuccess === "function") {
        onSuccess(response.message.toString());
      }
      dispatch({
        type: "SET_PAGE_SNACKBAR",
        page_snackbar: {
          message: response.message.toString(),
          options: {
            variant: "success",
          },
        },
      });
    } else {
      helperErrorMessage(dispatch, response);
    }
  } catch (error) {
    console.error(`action error`, error);
  }
};

const approveClass = (
  payload: ClassModel,
  onSuccess: (msg: string) => any
) => async (dispatch: Dispatch<ClassReducerTypes | PageReducerTypes>) => {
  try {
    dispatch({
      type: "SET_PAGE_LOADING",
      page_loading: {
        loading_message: "Loading, thank you for your patience!",
        show: true,
      },
    });
    const response: IServerResponse = await ClassApi.approveClass(payload);
    dispatch({
      type: "SET_PAGE_LOADING",
      page_loading: {
        show: false,
      },
    });
    if (response.success) {
      if (typeof onSuccess === "function") {
        onSuccess(response.message.toString());
      }
      dispatch({
        type: "SET_PAGE_SNACKBAR",
        page_snackbar: {
          message: response.message.toString(),
          options: {
            variant: "success",
          },
        },
      });
    } else {
      helperErrorMessage(dispatch, response);
    }
  } catch (error) {
    console.error(`action error`, error);
  }
};

const endClass = (
  payload: ClassModel,
  onSuccess: (msg: string) => any
) => async (dispatch: Dispatch<ClassReducerTypes | PageReducerTypes>) => {
  try {
    dispatch({
      type: "SET_PAGE_LOADING",
      page_loading: {
        loading_message: "Loading, thank you for your patience!",
        show: true,
      },
    });
    const response: IServerResponse = await ClassApi.endClass(payload);
    dispatch({
      type: "SET_PAGE_LOADING",
      page_loading: {
        show: false,
      },
    });
    if (response.success) {
      if (typeof onSuccess === "function") {
        onSuccess(response.message.toString());
      }
      dispatch({
        type: "SET_PAGE_SNACKBAR",
        page_snackbar: {
          message: response.message.toString(),
          options: {
            variant: "success",
          },
        },
      });
    } else {
      helperErrorMessage(dispatch, response);
    }
  } catch (error) {
    console.error(`action error`, error);
  }
};

const rateClass = (
  payload: ClassRatingModel,
  onSuccess: (msg: string) => any
) => async (dispatch: Dispatch<ClassReducerTypes | PageReducerTypes>) => {
  try {
    dispatch({
      type: "SET_PAGE_LOADING",
      page_loading: {
        loading_message: "Loading, thank you for your patience!",
        show: true,
      },
    });
    const response: IServerResponse = await ClassApi.rateClass(payload);
    dispatch({
      type: "SET_PAGE_LOADING",
      page_loading: {
        show: false,
      },
    });
    if (response.success) {
      if (typeof onSuccess === "function") {
        onSuccess(response.message.toString());
      }
      dispatch({
        type: "SET_PAGE_SNACKBAR",
        page_snackbar: {
          message: response.message.toString(),
          options: {
            variant: "success",
          },
        },
      });
    } else {
      helperErrorMessage(dispatch, response);
    }
  } catch (error) {
    console.error(`action error`, error);
  }
};

export const updateClassAction = (
  payload: ClassModel,
  onSuccess: (msg: string) => any
) => async (dispatch: Dispatch<ClassReducerTypes | PageReducerTypes>) => {
  try {
    dispatch({
      type: "SET_PAGE_LOADING",
      page_loading: {
        loading_message: "Loading, thank you for your patience!",
        show: true,
      },
    });
    const response: IServerResponse = await ClassApi.updateClassApi(payload);
    dispatch({
      type: "SET_PAGE_LOADING",
      page_loading: {
        show: false,
      },
    });
    if (response.success) {
      if (typeof onSuccess === "function") {
        onSuccess(response.message.toString());
      }

      dispatch({
        type: "SET_PAGE_SNACKBAR",
        page_snackbar: {
          message: response.message.toString(),
          options: {
            variant: "success",
          },
        },
      });
    } else {
      helperErrorMessage(dispatch, response);
    }
  } catch (error) {
    console.error(`action error`, error);
  }
};

const getAllTutorClasses = (tutor_pk: number) => async (
  dispatch: Dispatch<ClassReducerTypes>
) => {
  try {
    dispatch({
      type: "fetch_all_tutor_classes",
      fetch_all_tutor_classes: true,
    });
    const response: IServerResponse = await ClassApi.getAllTutorClasses(
      tutor_pk
    );

    if (response.success) {
      dispatch({
        type: "all_tutor_classes",
        all_tutor_classes: response.data,
      });
    } else {
    }

    dispatch({
      type: "fetch_all_tutor_classes",
      fetch_all_tutor_classes: false,
    });
  } catch (error) {
    console.error(`action error`, error);
  }
};

const getStudentClassByStudentPk = (student_pk: number) => async (
  dispatch: Dispatch<ClassReducerTypes>
) => {
  try {
    dispatch({
      type: "fetch_student_class_by_student_pk",
      fetch_student_class_by_student_pk: true,
    });
    const response: IServerResponse = await ClassApi.getStudentClassByStudentPk(
      student_pk
    );

    console.log(`response`, response);

    if (response.success) {
      dispatch({
        type: "student_class_by_student_pk",
        student_class_by_student_pk: response.data,
      });
    } else {
    }

    dispatch({
      type: "fetch_student_class_by_student_pk",
      fetch_student_class_by_student_pk: false,
    });
  } catch (error) {
    console.error(`action error`, error);
  }
};

const getClassSummaryStats = () => async (
  dispatch: Dispatch<ClassReducerTypes>
) => {
  try {
    dispatch({
      type: "fetch_class_summary_status",
      fetch_class_summary_status: true,
    });
    const response: IServerResponse = await ClassApi.getClassSummaryStats();

    if (response.success) {
      dispatch({
        type: "class_summary_status",
        class_summary_status: response.data,
      });
    } else {
    }

    dispatch({
      type: "fetch_class_summary_status",
      fetch_class_summary_status: false,
    });
  } catch (error) {
    console.error(`action error`, error);
  }
};

const getOpenClassProgressStats = () => async (
  dispatch: Dispatch<ClassReducerTypes>
) => {
  try {
    dispatch({
      type: "fetch_open_class_progress_stats",
      fetch_open_class_progress_stats: true,
    });
    const response: IServerResponse = await ClassApi.getOpenClassProgressStats();

    if (response.success) {
      dispatch({
        type: "open_class_progress_stats",
        open_class_progress_stats: response.data,
      });
    } else {
    }

    dispatch({
      type: "fetch_open_class_progress_stats",
      fetch_open_class_progress_stats: false,
    });
  } catch (error) {
    console.error(`action error`, error);
  }
};

const getTotalTutorClassStats = () => async (
  dispatch: Dispatch<ClassReducerTypes>
) => {
  try {
    dispatch({
      type: "fetch_total_tutor_class_stats",
      fetch_total_tutor_class_stats: true,
    });
    const response: IServerResponse = await ClassApi.getTotalTutorClassStats();

    if (response.success) {
      dispatch({
        type: "total_tutor_class_stats",
        total_tutor_class_stats: response.data,
      });
    } else {
    }

    dispatch({
      type: "fetch_total_tutor_class_stats",
      fetch_total_tutor_class_stats: false,
    });
  } catch (error) {
    console.error(`action error`, error);
  }
};

const getTotalStudentClassStats = () => async (
  dispatch: Dispatch<ClassReducerTypes>
) => {
  try {
    dispatch({
      type: "fetch_total_student_class_stats",
      fetch_total_student_class_stats: true,
    });
    const response: IServerResponse = await ClassApi.getTotalStudentClassStats();

    if (response.success) {
      dispatch({
        type: "total_student_class_stats",
        total_student_class_stats: response.data,
      });
    } else {
    }

    dispatch({
      type: "fetch_total_student_class_stats",
      fetch_total_student_class_stats: false,
    });
  } catch (error) {
    console.error(`action error`, error);
  }
};

//student actions

const getStudentAvailableClassTable = (payload: PaginationModel) => async (
  dispatch: Dispatch<ClassReducerTypes>
) => {
  try {
    dispatch({
      type: "fetch_student_available_class_table",
      fetch_student_available_class_table: true,
    });
    const response: IServerResponse = await ClassApi.getStudentAvailableClassTable(
      payload
    );

    if (response.success) {
      dispatch({
        type: "student_available_class_table",
        student_available_class_table: response.data,
      });
    }
    dispatch({
      type: "fetch_student_available_class_table",
      fetch_student_available_class_table: false,
    });
  } catch (error) {
    console.error(`action error`, error);
  }
};

const getStudentOngoingClassTable = (payload: PaginationModel) => async (
  dispatch: Dispatch<ClassReducerTypes>
) => {
  try {
    dispatch({
      type: "fetch_student_ongoing_class_table",
      fetch_student_ongoing_class_table: true,
    });
    const response: IServerResponse = await ClassApi.getStudentOngoingClassTable(
      payload
    );

    if (response.success) {
      dispatch({
        type: "student_ongoing_class_table",
        student_ongoing_class_table: response.data,
      });
    }
    dispatch({
      type: "fetch_student_ongoing_class_table",
      fetch_student_ongoing_class_table: false,
    });
  } catch (error) {
    console.error(`action error`, error);
  }
};

const getStudentEndedClassTable = (payload: PaginationModel) => async (
  dispatch: Dispatch<ClassReducerTypes>
) => {
  try {
    dispatch({
      type: "fetch_student_ended_class_table",
      fetch_student_ended_class_table: true,
    });
    const response: IServerResponse = await ClassApi.getStudentEndedClassTable(
      payload
    );

    if (response.success) {
      dispatch({
        type: "student_ended_class_table",
        student_ended_class_table: response.data,
      });
    }
    dispatch({
      type: "fetch_student_ended_class_table",
      fetch_student_ended_class_table: false,
    });
  } catch (error) {
    console.error(`action error`, error);
  }
};

const getEndedClassRatingStats = () => async (
  dispatch: Dispatch<ClassReducerTypes>
) => {
  try {
    dispatch({
      type: "fetch_ended_class_rating_stats",
      fetch_ended_class_rating_stats: true,
    });
    const response: IServerResponse = await ClassApi.getEndedClassRatingStats();

    if (response.success) {
      dispatch({
        type: "ended_class_rating_stats",
        ended_class_rating_stats: response.data,
      });
    } else {
    }

    dispatch({
      type: "fetch_ended_class_rating_stats",
      fetch_ended_class_rating_stats: false,
    });
  } catch (error) {
    console.error(`action error`, error);
  }
};

const getClassRatings = (class_pk: number) => async (
  dispatch: Dispatch<ClassReducerTypes>
) => {
  try {
    dispatch({
      type: "fetch_class_ratings",
      fetch_class_ratings: true,
    });
    const response: IServerResponse = await ClassApi.getClassRatings(class_pk);

    if (response.success) {
      dispatch({
        type: "class_ratings",
        class_ratings: response.data,
      });
    } else {
    }

    dispatch({
      type: "fetch_class_ratings",
      fetch_class_ratings: false,
    });
  } catch (error) {
    console.error(`action error`, error);
  }
};

export default {
  getAllTutorClasses,
  getStudentClassByStudentPk,
  getClassSummaryStats,
  getOpenClassProgressStats,
  getTotalTutorClassStats,
  getTotalStudentClassStats,
  declineClass,
  approveClass,
  endClass,
  getStudentAvailableClassTable,
  getStudentOngoingClassTable,
  getStudentEndedClassTable,
  rateClass,
  getEndedClassRatingStats,
  getClassRatings,
};
