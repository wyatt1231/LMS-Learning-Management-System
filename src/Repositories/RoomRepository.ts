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
      `select room_pk id, room_desc label from (select * from rooms where is_active = 1) tmp
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

const getTotalRoom = async (): Promise<ResponseModel> => {
  const con = await DatabaseConnection();
  try {
    await con.BeginTransaction();

    const res_sql_count = await con.QuerySingle(
      `select count(*) as total from rooms WHERE is_active=1;`,
      {}
    );

    con.Commit();
    return {
      success: true,
      data: res_sql_count.total,
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

const toggleRoomStatus = async (
  room_pk: number,
  user_pk: number
): Promise<ResponseModel> => {
  const con = await DatabaseConnection();
  try {
    await con.BeginTransaction();

    const current_course_status = await con.QuerySingle(
      `
      select is_active from rooms where room_pk=@room_pk;
    `,
      {
        room_pk,
      }
    );

    const payload: RoomModel = {
      room_pk: room_pk,
      is_active: current_course_status.is_active === 1 ? 0 : 1,
    };

    const res_course_status = await con.Modify(
      `update rooms set is_active =@is_active where room_pk = @room_pk`,
      payload
    );

    if (res_course_status > 0) {
      const audit_log = await con.Insert(
        `insert into audit_log set 
        user_pk=@user_pk,
        activity=@activity;
        `,
        {
          user_pk: user_pk,
          activity: `change room status to ${
            current_course_status.is_active === "y" ? "inactive" : "active"
          }`,
        }
      );

      if (audit_log.insertedId <= 0) {
        con.Rollback();
        return {
          success: false,
          message: "The activity was not logged!",
        };
      }

      con.Commit();
      return {
        success: true,
        message: "The process has been executed successfully!",
      };
    } else {
      await con.Rollback();
      return {
        success: false,
        message: `No rows are affected when trying to update the status`,
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

const updateRoom = async (payload: RoomModel): Promise<ResponseModel> => {
  const con = await DatabaseConnection();
  try {
    await con.BeginTransaction();

    const sql_update_room = await con.Modify(
      `
      UPDATE rooms SET
      room_desc=@room_desc,
      notes=@notes
      WHERE 
      room_pk=@room_pk;
          `,
      payload
    );

    if (sql_update_room > 0) {
      const audit_log = await con.Insert(
        `insert into audit_log set 
        user_pk=@user_pk,
        activity=@activity;
        `,
        {
          user_pk: payload.encoder_pk,
          activity: `updated room the ${payload.room_desc} information`,
        }
      );

      if (audit_log.insertedId <= 0) {
        con.Rollback();
        return {
          success: false,
          message: "The activity was not logged!",
        };
      }

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

export default {
  addRoom,
  updateRoom,
  getRoomDataTable,
  getSingleRoom,
  searchRoom,
  getTotalRoom,
  toggleRoomStatus,
};
