import { Dispatch } from "react";
import helperErrorMessage from "../../Helpers/helperErrorMessage";
import ClassSessionTaskApi from "../Api/ClassSessionTaskApi";
import IServerResponse from "../Interface/IServerResponse";
import {
  SessionTaskModel,
  SessionTaskQuesModel,
  SessionTaskSubFileModel,
  SessionTaskSubModel,
} from "../Models/ClassSessionTaskModels";
import { ClassSessionTaskReducerTypes } from "../Types/ClassSessionTaskTypes";
import { PageReducerTypes } from "../Types/PageTypes";

const setAllClassTask =
  (class_pk: number) =>
  async (dispatch: Dispatch<ClassSessionTaskReducerTypes>) => {
    try {
      dispatch({
        type: "fetch_all_class_task",
        fetch_all_class_task: true,
      });
      const response: IServerResponse =
        await ClassSessionTaskApi.getAllClassTask(class_pk);

      if (response.success) {
        dispatch({
          type: "all_class_task",
          all_class_task: response.data,
        });
      }

      dispatch({
        type: "fetch_all_class_task",
        fetch_all_class_task: false,
      });
    } catch (error) {
      console.error(`reducer error`, error);
    }
  };

const setSingleClassTask =
  (class_task_pk: number, toNull?: boolean) =>
  async (dispatch: Dispatch<ClassSessionTaskReducerTypes>) => {
    if (toNull) {
      dispatch({
        type: "single_class_task",
        single_class_task: null,
      });
      return;
    }
    try {
      dispatch({
        type: "fetch_single_class_task",
        fetch_single_class_task: true,
      });
      const response: IServerResponse =
        await ClassSessionTaskApi.getSingleClassTask(class_task_pk);

      if (response.success) {
        dispatch({
          type: "single_class_task",
          single_class_task: response.data,
        });
      }

      dispatch({
        type: "fetch_single_class_task",
        fetch_single_class_task: false,
      });
    } catch (error) {
      console.error(`reducer error`, error);
    }
  };

const addClassTaskAction =
  (payload: SessionTaskModel, onSuccess: (msg: string) => any) =>
  async (dispatch: Dispatch<PageReducerTypes>) => {
    try {
      dispatch({
        type: "SET_PAGE_LOADING",
        page_loading: {
          loading_message: "Loading, thank you for your patience!",
          show: true,
        },
      });
      const response: IServerResponse = await ClassSessionTaskApi.addClassTask(
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

const updateClassTaskAction =
  (payload: SessionTaskModel, onSuccess: (msg: string) => any) =>
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
        await ClassSessionTaskApi.updateClassTask(payload);
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

const changeStatusClassTask =
  (payload: SessionTaskModel, onSuccess: (msg: string) => any) =>
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
        await ClassSessionTaskApi.changeStatusClassTask(payload);
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

const toggleSubmitClassTask =
  (payload: SessionTaskModel, onSuccess: (msg: string) => any) =>
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
        await ClassSessionTaskApi.toggleSubmitClassTask(payload);
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

const updateClassTaskQues =
  (payload: SessionTaskQuesModel, onSuccess: (msg: string) => any) =>
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
        await ClassSessionTaskApi.updateClassTaskQues(payload);
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

const addClassTaskQues =
  (payload: SessionTaskQuesModel, onSuccess: (msg: string) => any) =>
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
        await ClassSessionTaskApi.addClassTaskQues(payload);
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

const addClassTaskSub =
  (payload: Array<SessionTaskSubModel>, onSuccess: (msg: string) => any) =>
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
        await ClassSessionTaskApi.addClassTaskSub(payload);
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

const addClassTaskFileSub =
  (payload: SessionTaskSubFileModel, onSuccess: (msg: string) => any) =>
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
        await ClassSessionTaskApi.addClassTaskFileSub(payload);
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

const updateTaskSub =
  (payload: Array<SessionTaskSubModel>, onSuccess: (msg: string) => any) =>
  async (dispatch: Dispatch<PageReducerTypes>) => {
    try {
      dispatch({
        type: "SET_PAGE_LOADING",
        page_loading: {
          loading_message: "Loading, thank you for your patience!",
          show: true,
        },
      });
      const response: IServerResponse = await ClassSessionTaskApi.updateTaskSub(
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

const setAllClassTaskQues =
  (class_task_pk: number) =>
  async (dispatch: Dispatch<ClassSessionTaskReducerTypes>) => {
    try {
      dispatch({
        type: "fetch_all_class_task_ques",
        fetch_all_class_task_ques: true,
      });
      const response: IServerResponse =
        await ClassSessionTaskApi.getAllClassTaskQues(class_task_pk);

      if (response.success) {
        dispatch({
          type: "all_class_task_ques",
          all_class_task_ques: response.data,
        });
      }

      dispatch({
        type: "fetch_all_class_task_ques",
        fetch_all_class_task_ques: false,
      });
    } catch (error) {
      console.error(`reducer error`, error);
    }
  };

const setSingleClassTaskQues =
  (class_task_pk: number) =>
  async (dispatch: Dispatch<ClassSessionTaskReducerTypes>) => {
    try {
      dispatch({
        type: "fetch_single_class_task_ques",
        fetch_single_class_task_ques: true,
      });
      const response: IServerResponse =
        await ClassSessionTaskApi.getSingleClassTaskQues(class_task_pk);

      if (response.success) {
        dispatch({
          type: "single_class_task_ques",
          single_class_task_ques: response.data,
        });
      }

      dispatch({
        type: "fetch_all_class_task_ques",
        fetch_all_class_task_ques: false,
      });
    } catch (error) {
      console.error(`reducer error`, error);
    }
  };

const setAllClassTaskSub =
  (class_task_pk: number) =>
  async (dispatch: Dispatch<ClassSessionTaskReducerTypes>) => {
    try {
      dispatch({
        type: "fetch_all_class_task_sub",
        fetch_all_class_task_sub: true,
      });
      const response: IServerResponse =
        await ClassSessionTaskApi.getAllClassTaskSub(class_task_pk);

      if (response.success) {
        dispatch({
          type: "all_class_task_sub",
          all_class_task_sub: null,
        });
        dispatch({
          type: "all_class_task_sub",
          all_class_task_sub: response.data,
        });
      }

      dispatch({
        type: "fetch_all_class_task_sub",
        fetch_all_class_task_sub: false,
      });
    } catch (error) {
      console.error(`reducer error`, error);
    }
  };

const setAllStudentsSubmit =
  (class_task_pk: number) =>
  async (dispatch: Dispatch<ClassSessionTaskReducerTypes>) => {
    try {
      dispatch({
        type: "fetch_all_student_submit",
        fetch_all_student_submit: true,
      });
      const response: IServerResponse =
        await ClassSessionTaskApi.getAllStudentsSubmit(class_task_pk);

      if (response.success) {
        dispatch({
          type: "all_student_submit",
          all_student_submit: response.data,
        });
      }

      dispatch({
        type: "fetch_all_student_submit",
        fetch_all_student_submit: false,
      });
    } catch (error) {
      console.error(`reducer error`, error);
    }
  };

export default {
  setAllClassTask,
  setSingleClassTask,
  setAllClassTaskQues,
  setSingleClassTaskQues,
  setAllClassTaskSub,
  addClassTaskAction,
  updateClassTaskAction,
  changeStatusClassTask,
  toggleSubmitClassTask,
  updateClassTaskQues,
  addClassTaskQues,
  addClassTaskSub,
  setAllStudentsSubmit,
  updateTaskSub,
  addClassTaskFileSub,
};
