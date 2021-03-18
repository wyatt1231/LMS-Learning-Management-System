import { RoomReducerModel, RoomReducerTypes } from "../Types/RoomTypes";

const defaultState: RoomReducerModel = {
  fetching_selected_room: false,
  fetching_room_data_table: false,
};

const RoomReducer = (
  state: RoomReducerModel = defaultState,
  action: RoomReducerTypes
): RoomReducerModel => {
  switch (action.type) {
    case "set_room_data_table": {
      return {
        ...state,
        room_data_table: action.room_data_table,
      };
    }
    case "fetching_room_data_table": {
      return {
        ...state,
        fetching_room_data_table: action.fetching_room_data_table,
      };
    }

    //--

    case "set_selected_room": {
      return {
        ...state,
        selected_room: action.selected_room,
      };
    }
    case "fetching_selected_room": {
      return {
        ...state,
        fetching_selected_room: action.fetching_selected_room,
      };
    }

    default:
      return state;
  }
};

export default RoomReducer;
