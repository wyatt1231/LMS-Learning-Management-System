import { Dispatch } from "react";
import helperErrorMessage from "../../Helpers/helperErrorMessage";
import StudentApi from "../Api/StudentApi";
import IServerResponse from "../Interface/IServerResponse";
import { PaginationModel } from "../Models/PaginationModels";
import { StudentModel } from "../Models/StudentModel";
import { PageReducerTypes } from "../Types/PageTypes";
import { StudentReducerTypes } from "../Types/StudentTypes";

export const setStudentDataTableApi = (payload: PaginationModel) => async (
  dispatch: Dispatch<StudentReducerTypes>
) => {
  try {
    dispatch({
      type: "fetching_student_data_table",
      fetching_student_data_table: true,
    });
    const response: IServerResponse = await StudentApi.getStudentDataTableApi(
      payload
    );
    dispatch({
      type: "fetching_student_data_table",
      fetching_student_data_table: false,
    });
    if (response.success) {
      dispatch({
        type: "set_student_data_table",
        student_data_table: response.data,
      });
    } else {
    }
  } catch (error) {
    console.error(`action error`, error);
  }
};

export const setSelectedStudentAction = (student_pk: string) => async (
  dispatch: Dispatch<StudentReducerTypes>
) => {
  try {
    dispatch({
      type: "fetching_selected_student",
      fetching_selected_student: true,
    });
    const response: IServerResponse = await StudentApi.getSingleStudentApi(
      student_pk
    );

    dispatch({
      type: "fetching_selected_student",
      fetching_selected_student: false,
    });
    if (response.success) {
      dispatch({
        type: "set_selected_student",
        selected_student: response.data,
      });
    } else {
    }
  } catch (error) {
    console.error(`action error`, error);
  }
};

const getLoggedStudentInfo = () => async (
  dispatch: Dispatch<StudentReducerTypes>
) => {
  try {
    dispatch({
      type: "fetch_logged_student_info",
      fetch_logged_student_info: true,
    });
    const response: IServerResponse = await StudentApi.getLoggedStudentInfo();

    if (response.success) {
      dispatch({
        type: "logged_student_info",
        logged_student_info: response.data,
      });
    }
    dispatch({
      type: "fetch_logged_student_info",
      fetch_logged_student_info: false,
    });
  } catch (error) {
    console.error(`action error`, error);
  }
};

export const addStudentAction = (
  payload: StudentModel,
  onSuccess: (msg: string) => any
) => async (dispatch: Dispatch<PageReducerTypes>) => {
  try {
    dispatch({
      type: "SET_PAGE_LOADING",
      page_loading: {
        loading_message: "Loading, thank you for your patience!",
        show: true,
      },
    });
    const response: IServerResponse = await StudentApi.addStudentApi(payload);
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

const approveStudent = (
  student_pk: number,
  onSuccess: (msg: string) => any
) => async (dispatch: Dispatch<PageReducerTypes>) => {
  try {
    dispatch({
      type: "SET_PAGE_LOADING",
      page_loading: {
        loading_message: "Loading, thank you for your patience!",
        show: true,
      },
    });
    const response: IServerResponse = await StudentApi.approveStudent(
      student_pk
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

const updateStudent = (
  payload: StudentModel,
  onSuccess: (msg: string) => any
) => async (dispatch: Dispatch<PageReducerTypes>) => {
  try {
    dispatch({
      type: "SET_PAGE_LOADING",
      page_loading: {
        loading_message: "Loading, thank you for your patience!",
        show: true,
      },
    });
    const response: IServerResponse = await StudentApi.updateStudent(payload);
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

const updateStudentImage = (
  payload: StudentModel,
  onSuccess: (msg: string) => any
) => async (dispatch: Dispatch<PageReducerTypes>) => {
  try {
    dispatch({
      type: "SET_PAGE_LOADING",
      page_loading: {
        loading_message: "Loading, thank you for your patience!",
        show: true,
      },
    });
    const response: IServerResponse = await StudentApi.updateStudentImage(
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

const blockStudent = (
  student_pk: number,
  onSuccess: (msg: string) => any
) => async (dispatch: Dispatch<PageReducerTypes>) => {
  try {
    dispatch({
      type: "SET_PAGE_LOADING",
      page_loading: {
        loading_message: "Loading, thank you for your patience!",
        show: true,
      },
    });
    const response: IServerResponse = await StudentApi.blockStudent(student_pk);
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
  approveStudent,
  blockStudent,
  getLoggedStudentInfo,
  updateStudent,
  updateStudentImage,
};
