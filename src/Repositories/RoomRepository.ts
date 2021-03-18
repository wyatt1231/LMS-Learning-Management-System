import { DatabaseConnection } from "../Configurations/DatabaseConfig";
import { ErrorMessage } from "../Hooks/useErrorMessage";
import { GenerateSearch } from "../Hooks/useSearch";
import { PaginationModel } from "../Models/PaginationModel";
import { ResponseModel } from "../Models/ResponseModel";
import { RoomModel } from "../Models/RoomModel";

const addRoom = async (
  payload: RoomModel,
  user_id: string
): Promise<ResponseModel> => {
  const con = await DatabaseConnection();
  try {
    await con.BeginTransaction();

    const room_payload: RoomModel = {
      ...payload,
      encoder_pk: parseInt(user_id),
    };

    const sql_insert_room = await con.Insert(
      `
      INSERT INTO rooms SET
      room_desc=@room_desc,
      notes=@notes,
      encoder_pk=@encoder_pk;
        `,
      room_payload
    );

    if (sql_insert_room.insertedId > 0) {
      con.Commit();
      return {
        success: true,
        message: "The item has been added successfully",
      };
    } else {
      con.Rollback();
      return {
        success: false,
        message: "There were no rows affected while inserting the new record.",
      };
    }
  } catch (error) {
    await con.Rollback();
    console.error(`error`, error);
    return {
      success: false,
      message: ErrorMessage(error),
    };
  }
};

const updateRoom = async (
  payload: RoomModel,
  user_id: string
): Promise<ResponseModel> => {
  const con = await DatabaseConnection();
  try {
    await con.BeginTransaction();

    payload.encoder_pk = parseInt(user_id);

    const sql_update_room = await con.Modify(
      `
      UPDATE rooms SET
      description=@description,
      notes=@notes,
      encoder_pk=@encoder_pk
      WHERE 
      room_pk=@room_pk;
          `,
      payload
    );

    if (sql_update_room > 0) {
      con.Commit();
      return {
        success: true,
        message: "The item has been updated successfully",
      };
    } else {
      con.Rollback();
      return {
        success: false,
        message: "There were no rows affected while updating the new record.",
      };
    }
  } catch (error) {
    await con.Rollback();
    console.error(`error`, error);
    return {
      success: false,
      message: ErrorMessage(error),
    };
  }
};

const getRoomDataTable = async (
  pagination_payload: PaginationModel
): Promise<ResponseModel> => {
  const con = await DatabaseConnection();
  try {
    await con.BeginTransaction();

    const data: Array<RoomModel> = await con.QueryPagination(
      `SELECT * FROM rooms
      WHERE
      room_desc like concat('%',@search,'%')
      `,
      pagination_payload
    );

    const hasMore: boolean = data.length > pagination_payload.page.limit;

    if (hasMore) {
      data.splice(data.length - 1, 1);
    }

    const count: number = hasMore
      ? -1
      : pagination_payload.page.begin * pagination_payload.page.limit +
        data.length;

    con.Commit();
    return {
      success: true,
      data: {
        table: data,
        begin: pagination_payload.page.begin,
        count: count,
        limit: pagination_payload.page.limit,
      },
    };
  } catch (error) {
    await con.Rollback();
    console.error(`error`, error);
    return {
      success: false,
      message: ErrorMessage(error),
    };
  }
};

const getSingleRoom = async (room_pk: string): Promise<ResponseModel> => {
  const con = await DatabaseConnection();
  try {
    await con.BeginTransaction();

    const data: RoomModel = await con.QuerySingle(
      `select * from room where room_pk = @room_pk`,
      {
        tutor_pk: room_pk,
      }
    );

    con.Commit();
    return {
      success: true,
      data: data,
    };
  } catch (error) {
    await con.Rollback();
    console.error(`error`, error);
    return {
      success: false,
      message: ErrorMessage(error),
    };
  }
};

const searchRoom = async (search: string): Promise<ResponseModel> => {
  const con = await DatabaseConnection();
  try {
    await con.BeginTransaction();

    const data = await con.Query(
      `select room_pk id, room_desc label from rooms 
       ${GenerateSearch(search, "room_desc")}
      `,
      {
        search,
      }
    );

    con.Commit();
    return {
      success: true,
      data: data,
    };
  } catch (error) {
    await con.Rollback();
    console.error(`error`, error);
    return {
      success: false,
      message: ErrorMessage(error),
    };
  }
};

export default {
  addRoom,
  updateRoom,
  getRoomDataTable,
  getSingleRoom,
  searchRoom,
};
