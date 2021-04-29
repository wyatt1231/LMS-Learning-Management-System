import { Dispatch } from "react";
import helperErrorMessage from "../../Helpers/helperErrorMessage";
import UserApi, { CurrentUserApi } from "../Api/UserApi";
import IUserAuthenticate from "../Interface/IAuth";
import IServerResponse from "../Interface/IServerResponse";
import { UserModel } from "../Models/UserModel";
import { PageReducerTypes } from "../Types/PageTypes";
import { UserReducerTypes } from "../Types/UserTypes";

interface IActionAuthenticateUser {
  user: IUserAuthenticate;
  resetForm: () => void;
}

export const SetCurrentUserAction = () => async (
  dispatch: Dispatch<UserReducerTypes | PageReducerTypes>
) => {
  try {
    dispatch({
      type: "SET_PAGE_LOADING",
      page_loading: {
        show: true,
        loading_message: "Loading, please wait...",
      },
    });
    const response: IServerResponse = await CurrentUserApi();
    dispatch({
      type: "SET_PAGE_LOADING",
      page_loading: {
        show: false,
        // loading_message: "Loading, please wait..."
      },
    });

    if (response.success) {
      dispatch({
        type: "SET_CURRENT_USER",
        user: response.data,
      });

      const user_type = response?.data?.user_type;
      if (
        window.location.pathname === "/login" ||
        window.location.pathname === "/" ||
        window.location.pathname === "/student-registration"
      ) {
        if (user_type === "admin") {
          window.location.href = "/admin/dashboard";
        } else if (user_type === "tutor") {
          window.location.href = "/tutor/dashboard";
        } else if (user_type === "student") {
          window.location.href = "/student/dashboard";
        }
      }
    } else {
      if (window.location.pathname !== "/login") {
        if (window.location.pathname === "/student-registration") {
          // window.location.href = "/student-registration";
        } else {
          window.location.href = "/login";
        }
      }
    }
  } catch (error) {}
};

const getUserLogs = () => async (dispatch: Dispatch<UserReducerTypes>) => {
  try {
    dispatch({
      type: "fetching_user_logs",
      fetching_user_logs: true,
    });
    const response: IServerResponse = await UserApi.getUserLogs();

    if (response.success) {
      dispatch({
        type: "user_logs",
        user_logs: response.data,
      });
    }

    dispatch({
      type: "fetching_user_logs",
      fetching_user_logs: false,
    });
  } catch (error) {
    console.error(`action error`, error);
  }
};

const getAllLogs = () => async (dispatch: Dispatch<UserReducerTypes>) => {
  try {
    dispatch({
      type: "fetching_all_logs",
      fetching_all_logs: true,
    });
    const response: IServerResponse = await UserApi.getAllLogs();

    if (response.success) {
      dispatch({
        type: "all_logs",
        all_logs: response.data,
      });
    }

    dispatch({
      type: "fetching_all_logs",
      fetching_all_logs: false,
    });
  } catch (error) {
    console.error(`action error`, error);
  }
};

const getUserNotif = () => async (dispatch: Dispatch<UserReducerTypes>) => {
  try {
    dispatch({
      type: "fetch_user_notif",
      fetch_user_notif: true,
    });
    const response: IServerResponse = await UserApi.getUserNotif();

    if (response.success) {
      dispatch({
        type: "user_notif",
        user_notif: response.data,
      });
    }

    dispatch({
      type: "fetch_user_notif",
      fetch_user_notif: false,
    });
  } catch (error) {
    console.error(`action error`, error);
  }
};

export const changeAdminPassword = (
  payload: UserModel,
  onSuccess: (msg: string) => any
) => async (dispatch: Dispatch<UserReducerTypes | PageReducerTypes>) => {
  try {
    dispatch({
      type: "SET_PAGE_LOADING",
      page_loading: {
        loading_message: "Loading, thank you for your patience!",
        show: true,
      },
    });
    const response: IServerResponse = await UserApi.changeAdminPassword(
      payload
    );
    dispatch({
      type: "SET_PAGE_LOADING",
      page_loading: {
        show: false,
      },
    });
    if (response.success) {
      dispatch({
        type: "SET_PAGE_SNACKBAR",
        page_snackbar: {
          message: response.message.toString(),
          options: {
            variant: "success",
          },
        },
      });
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

const checkUserNotif = (notif_user_pk: number) => async (
  dispatch: Dispatch<any>
) => {
  try {
    await UserApi.checkUserNotif(notif_user_pk);
    dispatch(getUserNotif());
  } catch (error) {
    console.error(`action error`, error);
  }
};

export default {
  getUserLogs,
  changeAdminPassword,
  getAllLogs,
  getUserNotif,
  checkUserNotif,
};
