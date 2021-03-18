import { Dispatch } from "react";
import helperErrorMessage from "../../Helpers/helperErrorMessage";
import ClassMaterialApi from "../Api/ClassMaterialApi";
import IServerResponse from "../Interface/IServerResponse";
import { ClassMaterialReducerTypes } from "../Types/ClassMaterialTypes";
import { PageReducerTypes } from "../Types/PageTypes";

const setTblClassMaterialAction = (class_pk: number) => async (
  dispatch: Dispatch<ClassMaterialReducerTypes>
) => {
  try {
    dispatch({
      type: "set_fetch_class_material",
      fetch_class_material: true,
    });
    const response: IServerResponse = await ClassMaterialApi.getTblClassMaterialApi(
      class_pk
    );

    if (response.success) {
      dispatch({
        type: "set_tbl_class_materials",
        tbl_class_materials: response.data,
      });
    }

    dispatch({
      type: "set_fetch_class_material",
      fetch_class_material: false,
    });
  } catch (error) {
    console.error(`reducer error`, error);
  }
};

const addClassMaterialAction = (
  payload: FormData,
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
    const response: IServerResponse = await ClassMaterialApi.addClassMaterialApi(
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

const deleteClassMaterialAction = (
  mat_pk: number,
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
    const response: IServerResponse = await ClassMaterialApi.deleteClassMaterialApi(
      mat_pk
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
  setTblClassMaterialAction,
  addClassMaterialAction,
  deleteClassMaterialAction,
};
