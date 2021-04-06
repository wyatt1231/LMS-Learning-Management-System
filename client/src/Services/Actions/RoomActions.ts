import { Dispatch } from "react";
import helperErrorMessage from "../../Helpers/helperErrorMessage";
import RoomApi from "../Api/RoomApi";
import { RoomModel } from "../Models/RoomModel";
import { RoomReducerTypes } from "../Types/RoomTypes";

import IServerResponse from "../Interface/IServerResponse";
import { PaginationModel } from "../Models/PaginationModels";
import { PageReducerTypes } from "../Types/PageTypes";

export const setRoomDataTableAction = (payload: PaginationModel) => async (
  dispatch: Dispatch<RoomReducerTypes>
) => {
  try {
    dispatch({
      type: "fetching_room_data_table",
      fetching_room_data_table: true,
    });
    const response: IServerResponse = await RoomApi.getRoomDataTableApi(
      payload
    );
    console.log(`data_table response`, response);
    dispatch({
      type: "fetching_room_data_table",
      fetching_room_data_table: false,
    });
    if (response.success) {
      dispatch({
        type: "set_room_data_table",
        room_data_table: response.data,
      });
    } else {
    }
  } catch (error) {
    console.error(`action error`, error);
  }
};

export const setSelectedRoomAction = (room_pk: string) => async (
  dispatch: Dispatch<RoomReducerTypes>
) => {
  try {
    dispatch({
      type: "fetching_selected_room",
      fetching_selected_room: true,
    });
    const response: IServerResponse = await RoomApi.getSingleRoomApi(room_pk);
    dispatch({
      type: "fetching_selected_room",
      fetching_selected_room: false,
    });
    if (response.success) {
      dispatch({
        type: "set_selected_room",
        selected_room: response.data,
      });
    } else {
    }
  } catch (error) {
    console.error(`action error`, error);
  }
};

export const addRoomAction = (
  payload: RoomModel,
  onSuccess: (msg: string) => any
) => async (dispatch: Dispatch<RoomReducerTypes | PageReducerTypes>) => {
  try {
    dispatch({
      type: "SET_PAGE_LOADING",
      page_loading: {
        loading_message: "Loading, thank you for your patience!",
        show: true,
      },
    });
    const response: IServerResponse = await RoomApi.addRoomApi(payload);
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

const updateRoom = (
  payload: RoomModel,
  onSuccess: (msg: string) => any
) => async (dispatch: Dispatch<RoomReducerTypes | PageReducerTypes>) => {
  try {
    dispatch({
      type: "SET_PAGE_LOADING",
      page_loading: {
        loading_message: "Loading, thank you for your patience!",
        show: true,
      },
    });
    const response: IServerResponse = await RoomApi.updateRoom(payload);
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

const toggleRoomStatus = (
  room_pk: number,
  onSuccess: (msg: string) => any
) => async (dispatch: Dispatch<RoomReducerTypes | PageReducerTypes>) => {
  try {
    dispatch({
      type: "SET_PAGE_LOADING",
      page_loading: {
        loading_message: "Loading, thank you for your patience!",
        show: true,
      },
    });
    const response: IServerResponse = await RoomApi.toggleRoomStatus(room_pk);
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
  updateRoom,
  toggleRoomStatus,
};
