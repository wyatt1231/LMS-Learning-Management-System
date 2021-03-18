import { DatabaseConnection } from "../Configurations/DatabaseConfig";
import { ErrorMessage } from "../Hooks/useErrorMessage";
import { GetUploadedImage } from "../Hooks/useFileUploader";
import { FilterEventModel } from "../Models/CalendarModels";
import {
  ClassSesMsgModel,
  ClassSessionModel,
  TutorFutureSessionModel,
} from "../Models/ClassSessionModel";
import { ResponseModel } from "../Models/ResponseModel";

const getTblClassSessions = async (
  class_pk: number
): Promise<ResponseModel> => {
  const con = await DatabaseConnection();
  try {
    await con.BeginTransaction();

    const data: Array<ClassSessionModel> = await con.Query(
      `
      SELECT cs.*,sm.sts_desc,sm.sts_color,sm.sts_bgcolor FROM class_sessions  cs
      LEFT JOIN status_master sm ON cs.sts_pk=sm.sts_pk
      where cs.class_pk = @class_pk`,
      {
        class_pk: class_pk,
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

const getSingleClassSession = async (
  session_pk: number
): Promise<ResponseModel> => {
  const con = await DatabaseConnection();
  try {
    await con.BeginTransaction();

    const data: ClassSessionModel = await con.QuerySingle(
      `SELECT s.*,md5(session_pk) hash_pk, c.class_desc,c.course_desc FROM class_sessions s JOIN classes c
       ON s.class_pk = c.class_pk WHERE s.session_pk=@session_pk;`,
      {
        session_pk: session_pk,
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

const getTutorClassSessionCalendar = async (
  payload: FilterEventModel,
  user_id: string
): Promise<ResponseModel> => {
  const con = await DatabaseConnection();
  try {
    await con.BeginTransaction();

    const data: Array<ClassSessionModel> = await con.Query(
      `SELECT * FROM 
       (SELECT cs.*, sm.sts_color,sm.sts_bgcolor,c.class_desc,c.tutor_pk FROM class_sessions cs
       LEFT JOIN status_master sm ON sm.sts_pk = cs.sts_pk
       LEFT JOIN classes c ON cs.class_pk = c.class_pk) tmp
       WHERE
       class_desc LIKE CONCAT('%',@search,'%')
       AND sts_pk IN @sts_pk
       AND MONTH(start_date) = @month
       AND YEAR(start_date) = @year
       and tutor_pk=getTutorPK(@user_pk)
       GROUP BY session_pk
      `,
      {
        ...payload,
        user_pk: user_id,
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

const getStatsSessionCalendar = async (
  user_pk: string
): Promise<ResponseModel> => {
  const con = await DatabaseConnection();
  try {
    await con.BeginTransaction();

    const { for_approval } = await con.QuerySingle(
      `
      SELECT COUNT(*) AS 'for_approval' FROM class_sessions cs 
      LEFT JOIN classes c ON cs.class_pk = c.class_pk
      WHERE c.tutor_pk=getTutorPK(@user_pk) AND cs.sts_pk = @sts_pk and YEAR(cs.start_date) = YEAR(NOW());
      `,
      {
        user_pk: user_pk,
        sts_pk: "fa",
      }
    );

    const { approved } = await con.QuerySingle(
      `
      SELECT COUNT(*) AS 'approved' FROM class_sessions cs 
      LEFT JOIN classes c ON cs.class_pk = c.class_pk
      WHERE c.tutor_pk=getTutorPK(@user_pk) AND cs.sts_pk = @sts_pk and YEAR(cs.start_date) = YEAR(NOW());
      `,
      {
        user_pk: user_pk,
        sts_pk: "a",
      }
    );

    const { started } = await con.QuerySingle(
      `
      SELECT COUNT(*) AS 'started' FROM class_sessions cs 
      LEFT JOIN classes c ON cs.class_pk = c.class_pk
      WHERE c.tutor_pk=getTutorPK(@user_pk) AND cs.sts_pk = @sts_pk and YEAR(cs.start_date) = YEAR(NOW());
      `,
      {
        user_pk: user_pk,
        sts_pk: "e",
      }
    );

    const { closed } = await con.QuerySingle(
      `
      SELECT COUNT(*) AS 'closed' FROM class_sessions cs 
      LEFT JOIN classes c ON cs.class_pk = c.class_pk
      WHERE c.tutor_pk=getTutorPK(@user_pk) AND cs.sts_pk = @sts_pk and YEAR(cs.start_date) = YEAR(NOW());
      `,
      {
        user_pk: user_pk,
        sts_pk: "c",
      }
    );

    con.Commit();
    return {
      success: true,
      data: {
        for_approval,
        approved,
        started,
        closed,
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

const getTutorFutureSessions = async (
  tutor_pk: string
): Promise<ResponseModel> => {
  const con = await DatabaseConnection();
  try {
    await con.BeginTransaction();

    const data: Array<TutorFutureSessionModel> = await con.Query(
      `
      SELECT cs.start_date, cs.start_time,cs.end_time FROM class_sessions cs
      INNER JOIN classes c
      ON c.class_pk = cs.class_pk
      WHERE c.tutor_pk =@tutor_pk
      AND cs.start_date >= DATE(NOW());
      `,
      {
        tutor_pk: tutor_pk,
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

//update queries

const startClassSession = async (
  payload: ClassSessionModel
): Promise<ResponseModel> => {
  const con = await DatabaseConnection();
  try {
    await con.BeginTransaction();

    const sts_pk = await con.QuerySingle(
      `SELECT sts_pk from class_sessions where session_pk=@session_pk;`,
      payload
    );
    if (sts_pk.sts_pk === "s") {
      return {
        success: false,
        message: "The session cannot be started because it has already began.",
      };
    }
    if (sts_pk.sts_pk === "e") {
      return {
        success: false,
        message: "The session cannot be started because it has already ended.",
      };
    }

    const sql_update_session = await con.Modify(
      `UPDATE class_sessions set sts_pk='s',began=NOW() where session_pk=@session_pk`,
      payload
    );

    if (sql_update_session > 0) {
      con.Commit();
      return {
        success: true,
        message: `The class session has started!`,
      };
    } else {
      con.Rollback();
      return {
        success: false,
        message: `There were no affected rows when trying to start the class session!`,
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

const endClassSession = async (
  payload: ClassSessionModel
): Promise<ResponseModel> => {
  const con = await DatabaseConnection();
  try {
    await con.BeginTransaction();

    const session_sts_pk = await con.QuerySingle(
      `SELECT sts_pk from class_sessions where session_pk=@session_pk;`,
      {
        session_pk: payload.session_pk,
      }
    );

    if (session_sts_pk.sts_pk !== "s") {
      return {
        success: false,
        message: "Only sessions that are on-going cant be marked as 'ENDED'",
      };
    }

    const sql_update_session = await con.Modify(
      `UPDATE class_sessions set sts_pk='e',ended=NOW(),remarks=@remarks  where session_pk=@session_pk`,
      payload
    );

    if (sql_update_session > 0) {
      con.Commit();
      return {
        success: true,
        message: `The class session has ended!`,
      };
    } else {
      con.Rollback();
      return {
        success: false,
        message: `There were no affected rows when trying to end the class session!`,
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

//sendMessage
//hideMessage
//getAllMessage

const getAllMessage = async (session_pk: number): Promise<ResponseModel> => {
  const con = await DatabaseConnection();
  try {
    await con.BeginTransaction();

    const chat_room_msgs: Array<ClassSesMsgModel> = await con.Query(
      `SELECT m.*, u.fullname, u.picture FROM class_ses_msg m
       LEFT JOIN vw_user_info u on u.user_id = m.user_pk
       WHERE m.session_pk=@session_pk
       `,
      { session_pk: session_pk }
    );

    for (const msg of chat_room_msgs) {
      msg.picture = await GetUploadedImage(msg.picture);
    }

    con.Commit();
    return {
      success: true,
      data: chat_room_msgs,
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

const saveMessage = async (
  payload: ClassSesMsgModel
): Promise<ResponseModel> => {
  const con = await DatabaseConnection();
  try {
    await con.BeginTransaction();

    const sql_save_msg = await con.Modify(
      `INSERT INTO class_ses_msg SET
       session_pk=@session_pk,
       msg_body=@msg_body,
       user_pk=@user_pk,
       shown='y';
       `,
      payload
    );

    if (sql_save_msg > 0) {
      con.Commit();
      return {
        success: true,
        message: `Your message has been sent`,
      };
    } else {
      con.Rollback();
      return {
        success: false,
        message: `There were no affected rows in the process!`,
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

const hideMessage = async (
  payload: ClassSesMsgModel
): Promise<ResponseModel> => {
  const con = await DatabaseConnection();
  try {
    await con.BeginTransaction();

    const sql_hide_msg = await con.Modify(
      `UPDATE class_ses_msg SET
       shown='n'
       WHERE ses_msg_pk=@ses_msg_pk
       `,
      payload
    );

    if (sql_hide_msg > 0) {
      con.Commit();
      return {
        success: true,
        message: `The message is now hidden!`,
      };
    } else {
      con.Rollback();
      return {
        success: false,
        message: `There were no affected rows in the process!`,
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
  getTblClassSessions,
  getTutorFutureSessions,
  getTutorClassSessionCalendar,
  getStatsSessionCalendar,
  startClassSession,
  endClassSession,
  getAllMessage,
  saveMessage,
  hideMessage,
  getSingleClassSession,
};
