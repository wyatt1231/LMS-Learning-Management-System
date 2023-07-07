import { Dispatch } from "react";
import helperErrorMessage from "../../Helpers/helperErrorMessage";
import ClassStudentApi from "../Api/ClassStudentApi";
import IServerResponse from "../Interface/IServerResponse";
import { ClassStudentModel } from "../Models/ClassStudentModel";
import { ClassStudentReducerTypes } from "../Types/ClassStudentTypes";
import { PageReducerTypes } from "../Types/PageTypes";

const setTblClassStudentsAction =
  (class_pk: number) =>
  async (dispatch: Dispatch<ClassStudentReducerTypes>) => {
    try {
      dispatch({
        type: "set_fetch_tbl_class_students",
        fetch_tbl_class_students: true,
      });
      const response: IServerResponse =
        await ClassStudentApi.setTblClassStudentsApi(class_pk);

      dispatch({
        type: "set_fetch_tbl_class_students",
        fetch_tbl_class_students: false,
      });

      if (response.success) {
        dispatch({
          type: "set_tbl_class_students",
          tbl_class_students: response.data,
        });
      }
    } catch (error) {
      console.error(`reducer error`, error);
    }
  };

const enrollClassStudentAction =
  (payload: ClassStudentModel, onSuccess: (msg: string) => any) =>
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
        await ClassStudentApi.enrollClassStudent(payload);
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

const joinStudentToClassAction =
  (payload: ClassStudentModel, onSuccess: (msg: string) => any) =>
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
        await ClassStudentApi.joinStudentToClassApi(payload);
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

const acceptClassStudentAction =
  (class_stud_pk: number, onSuccess: (msg: string) => any) =>
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
        await ClassStudentApi.acceptClassStudentApi(class_stud_pk);
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

const reEnrollClassStudentAction =
  (session_pk: number, onSuccess: (msg: string) => any) =>
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
        await ClassStudentApi.reEnrollClassStudentApi(session_pk);
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

const blockClassStudentAction =
  (session_pk: number, onSuccess: (msg: string) => any) =>
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
        await ClassStudentApi.blockClassStudentApi(session_pk);
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

export default {
  setTblClassStudentsAction,
  enrollClassStudentAction,
  reEnrollClassStudentAction,
  blockClassStudentAction,
  joinStudentToClassAction,
  acceptClassStudentAction,
};
