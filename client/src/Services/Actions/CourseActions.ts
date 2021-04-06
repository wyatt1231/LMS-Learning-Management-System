import { Dispatch } from "react";
import helperErrorMessage from "../../Helpers/helperErrorMessage";
import CourseApi from "../Api/CourseApi";
import IServerResponse from "../Interface/IServerResponse";
import { CourseModel } from "../Models/CourseModel";
import { PaginationModel } from "../Models/PaginationModels";
import { CourseReducerTypes } from "../Types/CourseTypes";
import { PageReducerTypes } from "../Types/PageTypes";

export const setCourseDataTableAction = (payload: PaginationModel) => async (
  dispatch: Dispatch<CourseReducerTypes>
) => {
  try {
    dispatch({
      type: "fetching_course_data_table",
      fetching_course_data_table: true,
    });
    const response: IServerResponse = await CourseApi.getCourseDataTableApi(
      payload
    );
    dispatch({
      type: "fetching_course_data_table",
      fetching_course_data_table: false,
    });
    if (response.success) {
      dispatch({
        type: "set_course_data_table",
        course_data_table: response.data,
      });
    } else {
    }
  } catch (error) {
    console.error(`action error`, error);
  }
};

export const setSelectedCourseAction = (course_pk: string) => async (
  dispatch: Dispatch<CourseReducerTypes>
) => {
  try {
    dispatch({
      type: "fetching_selected_course",
      fetching_selected_course: true,
    });
    const response: IServerResponse = await CourseApi.getSingleCourseApi(
      course_pk
    );
    dispatch({
      type: "fetching_selected_course",
      fetching_selected_course: false,
    });
    if (response.success) {
      dispatch({
        type: "set_selected_course",
        selected_course: response.data,
      });
    } else {
    }
  } catch (error) {
    console.error(`action error`, error);
  }
};

export const addCourseApiAction = (
  payload: CourseModel,
  onSuccess: (msg: string) => any
) => async (dispatch: Dispatch<CourseReducerTypes | PageReducerTypes>) => {
  try {
    dispatch({
      type: "SET_PAGE_LOADING",
      page_loading: {
        loading_message: "Loading, thank you for your patience!",
        show: true,
      },
    });
    const response: IServerResponse = await CourseApi.addCourseApi(payload);
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
    } else {
      helperErrorMessage(dispatch, response);
    }
  } catch (error) {
    console.error(`action error`, error);
  }
};

const updateCourse = (
  payload: CourseModel,
  onSuccess: (msg: string) => any
) => async (dispatch: Dispatch<CourseReducerTypes | PageReducerTypes>) => {
  try {
    dispatch({
      type: "SET_PAGE_LOADING",
      page_loading: {
        loading_message: "Loading, thank you for your patience!",
        show: true,
      },
    });
    const response: IServerResponse = await CourseApi.updateCourse(payload);
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

const toggleCourseStatus = (
  course_pk: number,
  onSuccess: (msg: string) => any
) => async (dispatch: Dispatch<CourseReducerTypes | PageReducerTypes>) => {
  try {
    dispatch({
      type: "SET_PAGE_LOADING",
      page_loading: {
        loading_message: "Loading, thank you for your patience!",
        show: true,
      },
    });
    const response: IServerResponse = await CourseApi.toggleCourseStatus(
      course_pk
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

const updateCourseImage = (
  payload: CourseModel,
  onSuccess: (msg: string) => any
) => async (dispatch: Dispatch<CourseReducerTypes | PageReducerTypes>) => {
  try {
    dispatch({
      type: "SET_PAGE_LOADING",
      page_loading: {
        loading_message: "Loading, thank you for your patience!",
        show: true,
      },
    });
    const response: IServerResponse = await CourseApi.updateCourseImage(
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

export default {
  updateCourse,
  toggleCourseStatus,
  updateCourseImage,
};
