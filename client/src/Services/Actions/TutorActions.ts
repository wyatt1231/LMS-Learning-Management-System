import { Dispatch } from "react";
import helperErrorMessage from "../../Helpers/helperErrorMessage";
import {
  addTutorApi,
  getSingleTutorApi,
  getTutorDataTableApi,
  insertDummyTutorRatingsApi,
  updateTutorApi,
} from "../Api/TutorApi";
import IServerResponse from "../Interface/IServerResponse";
import { PaginationModel } from "../Models/PaginationModels";
import { TutorModel } from "../Models/TutorModels";
import { TutorRatingsModel } from "../Models/TutorRatingsModel";
import { PageReducerTypes } from "../Types/PageTypes";
import { TutorReducerTypes } from "../Types/TutorTypes";

export const setTutorDataTableAction = (payload: PaginationModel) => async (
  dispatch: Dispatch<TutorReducerTypes>
) => {
  try {
    dispatch({
      type: "FETCHING_TUTOR_DATA_TABLE",
      fetching_tutor_data_table: true,
    });
    const response: IServerResponse = await getTutorDataTableApi(payload);
    console.log(`response`, response);
    dispatch({
      type: "FETCHING_TUTOR_DATA_TABLE",
      fetching_tutor_data_table: false,
    });
    if (response.success) {
      dispatch({
        type: "TUTOR_DATA_TABLE",
        tutor_data_table: response.data,
      });
    } else {
    }
  } catch (error) {
    console.error(`reducer error`, error);
  }
};

export const getSingleTutor = (tutor_pk: string) => async (
  dispatch: Dispatch<TutorReducerTypes>
) => {
  try {
    dispatch({
      type: "FETCHING_SINGLE_TUTOR",
      fetching_single_tutor: true,
    });
    const response: IServerResponse = await getSingleTutorApi(tutor_pk);
    dispatch({
      type: "FETCHING_SINGLE_TUTOR",
      fetching_single_tutor: false,
    });
    if (response.success) {
      dispatch({
        type: "SINGLE_TUTOR",
        single_tutor: response.data,
      });
    } else {
    }
  } catch (error) {
    console.error(`reducer error`, error);
  }
};

export const addTutorAction = (
  payload: TutorModel,
  onSuccess: (msg: string) => any
) => async (dispatch: Dispatch<TutorReducerTypes | PageReducerTypes>) => {
  try {
    dispatch({
      type: "SET_PAGE_LOADING",
      page_loading: {
        loading_message: "Loading, thank you for your patience!",
        show: true,
      },
    });
    const response: IServerResponse = await addTutorApi(payload);
    console.log(`response`, response);
    dispatch({
      type: "SET_PAGE_LOADING",
      page_loading: {
        show: false,
      },
    });
    if (response.success) {
      if (typeof onSuccess === "function") {
        dispatch({
          type: "RELOAD_TUTOR_PAGING",
        });
        onSuccess(response.message.toString());
      }
    } else {
      helperErrorMessage(dispatch, response);
    }
  } catch (error) {
    console.error(`reducer error`, error);
  }
};

export const updateTutorAction = (
  payload: TutorModel,
  onSuccess: (msg: string) => any
) => async (dispatch: Dispatch<TutorReducerTypes | PageReducerTypes>) => {
  try {
    dispatch({
      type: "SET_PAGE_LOADING",
      page_loading: {
        loading_message: "Loading, thank you for your patience!",
        show: true,
      },
    });
    const response: IServerResponse = await updateTutorApi(payload);
    dispatch({
      type: "SET_PAGE_LOADING",
      page_loading: {
        show: false,
      },
    });
    if (response.success) {
      if (typeof onSuccess === "function") {
        dispatch({
          type: "RELOAD_SINGLE_TUTOR",
        });
        onSuccess(response.message.toString());
      }
    } else {
      helperErrorMessage(dispatch, response);
    }
  } catch (error) {
    console.error(`reducer error`, error);
  }
};

export const insertDummyTutorRatingsAction = (
  payload: Array<TutorRatingsModel>,
  onSuccess: (msg: string) => any
) => async (dispatch: Dispatch<TutorReducerTypes | PageReducerTypes>) => {
  try {
    dispatch({
      type: "SET_PAGE_LOADING",
      page_loading: {
        loading_message:
          "Saving your initial ratings, thank you for your patience!",
        show: true,
      },
    });
    const response: IServerResponse = await insertDummyTutorRatingsApi(payload);
    dispatch({
      type: "SET_PAGE_LOADING",
      page_loading: {
        show: false,
      },
    });
    if (response.success) {
      if (typeof onSuccess === "function") {
        dispatch({
          type: "RELOAD_TUTOR_PAGING",
        });
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
    console.error(`reducer error`, error);
  }
};
