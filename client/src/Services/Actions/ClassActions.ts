import { Dispatch } from "react";
import helperErrorMessage from "../../Helpers/helperErrorMessage";
import IServerResponse from "../Interface/IServerResponse";
import { PaginationModel } from "../Models/PaginationModels";
import { PageReducerTypes } from "../Types/PageTypes";
import { ClassReducerTypes } from "../Types/ClassTypes";
import { ClassModel } from "../Models/ClassModel";
import ClassApi from "../Api/ClassApi";

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

export const setSelectedClassAction = (course_pk: number) => async (
  dispatch: Dispatch<ClassReducerTypes>
) => {
  try {
    dispatch({
      type: "fetching_selected_class",
      fetching_selected_class: true,
    });
    const response: IServerResponse = await ClassApi.getSingleClassApi(
      course_pk
    );

    dispatch({
      type: "fetching_selected_class",
      fetching_selected_class: false,
    });
    if (response.success) {
      dispatch({
        type: "set_selected_class",
        selected_class: response.data,
      });
    } else {
    }
  } catch (error) {
    console.error(`action error`, error);
  }
};

export const addClassAction = (
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
    const response: IServerResponse = await ClassApi.addClassApi(payload);
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

export const approveClassAction = (
  class_pk: number,
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
    const response: IServerResponse = await ClassApi.approveClassApi(class_pk);
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
