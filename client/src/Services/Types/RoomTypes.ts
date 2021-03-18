import { RoomModel } from "../Models/RoomModel";

interface RoomDataTableModel {
  limit: number;
  count: number;
  begin: number;
  table: Array<RoomModel>;
}

export type RoomReducerTypes =
  | {
      type: "set_room_data_table";
      room_data_table: RoomDataTableModel;
    }
  | {
      type: "fetching_room_data_table";
      fetching_room_data_table: boolean;
    }
  | {
      type: "set_selected_room";
      selected_room: RoomModel;
    }
  | {
      type: "fetching_selected_room";
      fetching_selected_room: boolean;
    };

export interface RoomReducerModel {
  room_data_table?: null | RoomDataTableModel;
  fetching_room_data_table: boolean;
  selected_room?: RoomModel;
  fetching_selected_room: boolean;
}
