import { Dispatch } from "react";
import helperErrorMessage from "../../Helpers/helperErrorMessage";
import ClassSessionApi from "../Api/ClassSessionApi";
import IServerResponse from "../Interface/IServerResponse";
import { FilterEventModel } from "../Models/CaledarModels";
import { ClassSessionModel } from "../Models/ClassSessionModel";
import { ClassSessionRatingModel } from "../Models/ClassSessionRatingModel";
import { ClassSessionReducerTypes } from "../Types/ClassSessionTypes";
import { PageReducerTypes } from "../Types/PageTypes";

export const setTutorClassSessionCalendarAction =
  (payload: FilterEventModel) =>
  async (dispatch: Dispatch<ClassSessionReducerTypes>) => {
    try {
      dispatch({
        type: "set_fetch_tutor_class_sessions",
        fetch_tutor_class_sessions: true,
      });
      const response: IServerResponse =
        await ClassSessionApi.getTutorClassSessionCalendarApi(payload);
      console.log(`cal`, response);
      dispatch({
        type: "set_fetch_tutor_class_sessions",
        fetch_tutor_class_sessions: false,
      });
      if (response.success) {
        dispatch({
          type: "set_tutor_class_sessions",
          tutor_class_sessions: response.data,
        });
      } else {
      }
    } catch (error) {
      console.error(`reducer error`, error);
    }
  };

export const setStatsSessionCalendarAction =
  () => async (dispatch: Dispatch<ClassSessionReducerTypes>) => {
    try {
      dispatch({
        type: "set_fetch_stats_class_session",
        fetch_stats_class_session: true,
      });
      const response: IServerResponse =
        await ClassSessionApi.getStatsSessionCalendarApi();
      console.log(`stats`, response);
      dispatch({
        type: "set_fetch_stats_class_session",
        fetch_stats_class_session: false,
      });
      if (response.success) {
        dispatch({
          type: "set_stats_class_session",
          stats_class_session: response.data,
        });
      } else {
      }
    } catch (error) {
      console.error(`reducer error`, error);
    }
  };

export const getClassSessionsAction =
  (class_pk: number) =>
  async (dispatch: Dispatch<ClassSessionReducerTypes>) => {
    try {
      dispatch({
        type: "set_fetch_class_sessions",
        fetch_class_sessions: true,
      });
      const response: IServerResponse =
        await ClassSessionApi.getClassSessionsApi(class_pk);
      if (response.success) {
        dispatch({
          type: "set_class_sessions",
          class_sessions: response.data,
        });
      }
      dispatch({
        type: "set_fetch_class_sessions",
        fetch_class_sessions: false,
      });
    } catch (error) {
      console.error(`reducer error`, error);
    }
  };

export const setSingleClassSession =
  (session_pk: number) =>
  async (dispatch: Dispatch<ClassSessionReducerTypes | PageReducerTypes>) => {
    try {
      dispatch({
        type: "fetch_single_class_session",
        fetch_single_class_session: true,
      });
      const response: IServerResponse =
        await ClassSessionApi.getSingleClassSession(session_pk);

      if (response.success) {
        dispatch({
          type: "single_class_session",
          single_class_session: response.data,
        });
      } else {
        helperErrorMessage(dispatch, response);
      }
      dispatch({
        type: "fetch_single_class_session",
        fetch_single_class_session: false,
      });
    } catch (error) {
      console.error(`reducer error`, error);
    }
  };

const startClassSession =
  (payload: ClassSessionModel, onSuccess: (msg: string) => any) =>
  async (dispatch: Dispatch<PageReducerTypes>) => {
    try {
      dispatch({
        type: "SET_PAGE_LOADING",
        page_loading: {
          loading_message: "Loading, thank you for your patience!",
          show: true,
        },
      });
      const response: IServerResponse = await ClassSessionApi.startClassSession(
        payload
      );
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

const endClassSession =
  (payload: ClassSessionModel, onSuccess: (msg: string) => any) =>
  async (dispatch: Dispatch<PageReducerTypes>) => {
    try {
      dispatch({
        type: "SET_PAGE_LOADING",
        page_loading: {
          loading_message: "Loading, thank you for your patience!",
          show: true,
        },
      });
      const response: IServerResponse = await ClassSessionApi.endClassSession(
        payload
      );
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

const unattendedClassSession =
  (payload: ClassSessionModel, onSuccess: (msg: string) => any) =>
  async (dispatch: Dispatch<PageReducerTypes>) => {
    try {
      dispatch({
        type: "SET_PAGE_LOADING",
        page_loading: {
          loading_message: "Loading, thank you for your patience!",
          show: true,
        },
      });
      const response: IServerResponse =
        await ClassSessionApi.unattendedClassSession(payload);
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

const rateClassSession =
  (payload: ClassSessionRatingModel, onSuccess: (msg: string) => any) =>
  async (dispatch: Dispatch<PageReducerTypes>) => {
    try {
      dispatch({
        type: "SET_PAGE_LOADING",
        page_loading: {
          loading_message: "Loading, thank you for your patience!",
          show: true,
        },
      });
      const response: IServerResponse = await ClassSessionApi.rateClassSession(
        payload
      );
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

const getTutorSessionCal =
  (tutor_pk: number) =>
  async (dispatch: Dispatch<ClassSessionReducerTypes>) => {
    try {
      dispatch({
        type: "fetch_tutor_session_cal",
        fetch_tutor_session_cal: true,
      });
      const response: IServerResponse =
        await ClassSessionApi.getTutorSessionCal(tutor_pk);

      if (response.success) {
        dispatch({
          type: "tutor_session_cal",
          tutor_session_cal: response.data,
        });
      }
      dispatch({
        type: "fetch_tutor_session_cal",
        fetch_tutor_session_cal: false,
      });
    } catch (error) {
      console.error(`reducer error`, error);
    }
  };

const getStudentSessionCal =
  (student_pk: number) =>
  async (dispatch: Dispatch<ClassSessionReducerTypes>) => {
    try {
      dispatch({
        type: "fetch_student_session_cal",
        fetch_student_session_cal: true,
      });
      const response: IServerResponse =
        await ClassSessionApi.getStudentSessionCal(student_pk);

      if (response.success) {
        dispatch({
          type: "student_session_cal",
          student_session_cal: response.data,
        });
      }
      dispatch({
        type: "fetch_student_session_cal",
        fetch_student_session_cal: false,
      });
    } catch (error) {
      console.error(`reducer error`, error);
    }
  };

const getLoggedInTutorSessionCalendar =
  () => async (dispatch: Dispatch<ClassSessionReducerTypes>) => {
    try {
      dispatch({
        type: "fetch_logged_in_tutor_session_cal",
        fetch_logged_in_tutor_session_cal: true,
      });
      const response: IServerResponse =
        await ClassSessionApi.getLoggedInTutorSessionCalendar();

      console.log(`response`, response);

      if (response.success) {
        dispatch({
          type: "logged_in_tutor_session_cal",
          logged_in_tutor_session_cal: response.data,
        });
      }
      dispatch({
        type: "fetch_logged_in_tutor_session_cal",
        fetch_logged_in_tutor_session_cal: false,
      });
    } catch (error) {
      console.error(`reducer error`, error);
    }
  };
const getLoggedStudentCalendar =
  () => async (dispatch: Dispatch<ClassSessionReducerTypes>) => {
    try {
      dispatch({
        type: "fetch_logged_student_calendar",
        fetch_logged_student_calendar: true,
      });
      const response: IServerResponse =
        await ClassSessionApi.getLoggedStudentCalendar();

      console.log(`response`, response);

      if (response.success) {
        dispatch({
          type: "logged_student_calendar",
          logged_student_calendar: response.data,
        });
      }
      dispatch({
        type: "fetch_logged_student_calendar",
        fetch_logged_student_calendar: false,
      });
    } catch (error) {
      console.error(`reducer error`, error);
    }
  };

export default {
  getTutorSessionCal,
  getStudentSessionCal,
  getLoggedInTutorSessionCalendar,
  startClassSession,
  endClassSession,
  unattendedClassSession,
  getLoggedStudentCalendar,
  rateClassSession,
};
