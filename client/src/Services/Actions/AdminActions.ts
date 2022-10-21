import { Dispatch } from "react";
import helperErrorMessage from "../../Helpers/helperErrorMessage";
import AdminApi, {
  addAdminApi,
  getAdminDataTableApi,
  getSingleAdminApi,
  updateAdminApi,
} from "../Api/AdminApi";
import IServerResponse from "../Interface/IServerResponse";
import { AdminModel } from "../Models/AdminModel";
import { PaginationModel } from "../Models/PaginationModels";
import { AdminReducerTypes } from "../Types/AdminTypes";
import { PageReducerTypes } from "../Types/PageTypes";

export const setAdminDataTableAction =
  (payload: PaginationModel) =>
  async (dispatch: Dispatch<AdminReducerTypes>) => {
    try {
      dispatch({
        type: "fetching_admin_data_table",
        fetching_admin_data_table: true,
      });
      const response: IServerResponse = await getAdminDataTableApi(payload);
      dispatch({
        type: "fetching_admin_data_table",
        fetching_admin_data_table: false,
      });
      if (response.success) {
        dispatch({
          type: "set_admin_data_table",
          admin_data_table: response.data,
        });
      } else {
      }
    } catch (error) {
      console.error(`action error`, error);
    }
  };

export const setSelectedAdminAction =
  (admin_pk: string) => async (dispatch: Dispatch<AdminReducerTypes>) => {
    try {
      dispatch({
        type: "fetching_selected_admin",
        fetching_selected_admin: true,
      });
      const response: IServerResponse = await getSingleAdminApi(admin_pk);
      console.log(`response`, response);
      dispatch({
        type: "fetching_selected_admin",
        fetching_selected_admin: false,
      });
      if (response.success) {
        dispatch({
          type: "set_selected_admin",
          selected_admin: response.data,
        });
      } else {
      }
    } catch (error) {
      console.error(`action error`, error);
    }
  };

export const addAdminAction =
  (payload: AdminModel, onSuccess: (msg: string) => any) =>
  async (dispatch: Dispatch<AdminReducerTypes | PageReducerTypes>) => {
    try {
      dispatch({
        type: "SET_PAGE_LOADING",
        page_loading: {
          loading_message: "Loading, thank you for your patience!",
          show: true,
        },
      });
      const response: IServerResponse = await addAdminApi(payload);
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

export const updateAdminAction =
  (payload: AdminModel, onSuccess: (msg: string) => any) =>
  async (dispatch: Dispatch<AdminReducerTypes | PageReducerTypes>) => {
    try {
      dispatch({
        type: "SET_PAGE_LOADING",
        page_loading: {
          loading_message: "Loading, thank you for your patience!",
          show: true,
        },
      });
      const response: IServerResponse = await updateAdminApi(payload);
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

const getLoggedAdmin = () => async (dispatch: Dispatch<AdminReducerTypes>) => {
  try {
    dispatch({
      type: "fetching_logged_admin",
      fetching_logged_admin: true,
    });
    const response: IServerResponse = await AdminApi.getLoggedAdmin();

    console.log(`res`, response);

    if (response.success) {
      dispatch({
        type: "set_logged_admin",
        logged_admin: response.data,
      });
    }

    dispatch({
      type: "fetching_logged_admin",
      fetching_logged_admin: false,
    });
  } catch (error) {
    console.error(`action error`, error);
  }
};

export const updateAdminInfo =
  (payload: AdminModel, onSuccess: (msg: string) => any) =>
  async (dispatch: Dispatch<AdminReducerTypes | PageReducerTypes>) => {
    try {
      dispatch({
        type: "SET_PAGE_LOADING",
        page_loading: {
          loading_message: "Loading, thank you for your patience!",
          show: true,
        },
      });
      const response: IServerResponse = await AdminApi.updateAdminInfo(payload);
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

export const updateAdminImage =
  (payload: AdminModel, onSuccess: (msg: string) => any) =>
  async (dispatch: Dispatch<AdminReducerTypes | PageReducerTypes>) => {
    try {
      dispatch({
        type: "SET_PAGE_LOADING",
        page_loading: {
          loading_message: "Loading, thank you for your patience!",
          show: true,
        },
      });
      const response: IServerResponse = await AdminApi.updateAdminImage(
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

export default {
  getLoggedAdmin,
  updateAdminInfo,
  updateAdminImage,
};
