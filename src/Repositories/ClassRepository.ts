import { DatabaseConnection } from "../Configurations/DatabaseConfig";
import {
  parseInvalidDateToDefault,
  parseInvalidTimeToDefault,
} from "../Hooks/useDateParser";
import { ErrorMessage } from "../Hooks/useErrorMessage";
import { GetUploadedImage } from "../Hooks/useFileUploader";
import { ClassModel } from "../Models/ClassModel";
import { PaginationModel } from "../Models/PaginationModel";
import { ResponseModel } from "../Models/ResponseModel";
import { StatusMasterModel } from "../Models/StatusMasterModel";

const addClass = async (
  payload: ClassModel,
  user_id: string
): Promise<ResponseModel> => {
  const con = await DatabaseConnection();
  try {
    await con.BeginTransaction();
    payload.encoder_pk = user_id;

    payload.start_date = parseInvalidDateToDefault(payload.start_date);
    payload.start_time = parseInvalidTimeToDefault(payload.start_time);
    payload.end_time = parseInvalidTimeToDefault(payload.end_time);

    const sql_insert_class = await con.Insert(
      `
        INSERT INTO classes SET
        class_desc=@class_desc,
        course_pk=@course_pk,
        course_desc=@course_desc,
        course_duration=@course_duration,
        room_pk=@room_pk,
        room_desc=@room_desc,
        class_type=@class_type,
        tutor_pk=@tutor_pk,
        tutor_name=@tutor_name,
        start_date=DATE(@start_date),
        start_time=@start_time,
        end_time=@end_time,
        session_count=@session_count,
        encoder_pk=@encoder_pk;
        `,
      payload
    );

    if (sql_insert_class.insertedId > 0) {
      for (const session of payload.class_sessions) {
        session.class_pk = sql_insert_class.insertedId;
        session.encoder_pk = user_id;
        session.start_date = parseInvalidDateToDefault(session.start_date);
        session.start_time = parseInvalidTimeToDefault(payload.start_time);
        session.end_time = parseInvalidTimeToDefault(payload.end_time);
        const sql_insert_session = await con.Insert(
          `
            INSERT INTO class_sessions SET
            class_pk=@class_pk,
            start_date=@start_date,
            start_time=@start_time,
            end_time=@end_time,
            encoder_pk=@encoder_pk;
            `,
          session
        );

        if (sql_insert_session.affectedRows < 1) {
          con.Rollback();
          return {
            success: false,
            message:
              "There were no rows affected while inserting the class session.",
          };
        }
      }

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

const updateClass = async (
  payload: ClassModel,
  user_id: string
): Promise<ResponseModel> => {
  const con = await DatabaseConnection();
  try {
    await con.BeginTransaction();
    payload.encoder_pk = user_id;

    const sql_update_class = await con.Insert(
      `
        UPDATE classes SET
        class_desc=@class_desc,
        course_pk=@course_pk,
        course_desc=@course_desc,
        room_pk=@room_pk,
        room_desc=@room_desc,
        class_type=@class_type,
        tutor_pk=@tutor_pk,
        tutor_name=@tutor_name,
        start_date=@start_date,
        start_time=@start_time,
        end_time=@end_time,
        session_count=@session_count,
        encoder_pk=@encoder_pk;
        `,
      payload
    );

    if (sql_update_class.insertedId > 0) {
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

const approveClass = async (
  class_pk: number,
  user_pk: string
): Promise<ResponseModel> => {
  const con = await DatabaseConnection();
  try {
    await con.BeginTransaction();

    const sql_insert_audit_log = await con.Insert(
      `
      INSERT INTO audit_log SET 
      user_pk='${user_pk}',
      activity=CONCAT('approved class ',(SELECT class_desc from classes where class_pk=@class_pk limit 1));
        `,
      {
        class_pk: class_pk,
      }
    );

    if (sql_insert_audit_log.affectedRows > 0) {
      const sql_approve_class = await con.Insert(
        `
        UPDATE classes
        SET 
        sts_pk='a'
        WHERE
        class_pk=@class_pk;
          `,
        {
          class_pk: class_pk,
        }
      );
      if (sql_approve_class.affectedRows > 0) {
        con.Commit();
        return {
          success: true,
          message: "The class has been approved successfully",
        };
      } else {
        con.Rollback();
        return {
          success: false,
          message: "There were no rows affected in the process",
        };
      }
    } else {
      con.Rollback();
      return {
        success: false,
        message: "There were no rows affected in the process",
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

const getClassDataTable = async (
  pagination_payload: PaginationModel
): Promise<ResponseModel> => {
  const con = await DatabaseConnection();
  try {
    await con.BeginTransaction();

    const data: Array<
      ClassModel & StatusMasterModel
    > = await con.QueryPagination(
      `SELECT * FROM 
      (
      SELECT c.*, sm.sts_desc,sm.sts_color,sm.sts_bgcolor,crs.picture as 'pic',
      (SELECT count(*) FROM class_sessions WHERE sts_pk='e' AND class_pk=c.class_pk) closed_sessions
      FROM classes c
      JOIN status_master sm
      ON sm.sts_pk = c.sts_pk
      LEFT JOIN courses crs 
      ON crs.course_pk = c.course_pk
      ) tmp
      WHERE
      class_desc like concat('%',@search,'%')
      OR room_desc like concat('%',@search,'%')
      OR class_type like concat('%',@search,'%')
      OR tutor_name like concat('%',@search,'%')
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

    for (const c of data) {
      c.pic = await GetUploadedImage(c.pic);
    }

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

const getTutorClassTable = async (
  payload: PaginationModel,
  user_pk: string
): Promise<ResponseModel> => {
  const con = await DatabaseConnection();
  try {
    await con.BeginTransaction();

    const data: Array<
      ClassModel & StatusMasterModel
    > = await con.QueryPagination(
      `SELECT * FROM 
      (
      SELECT c.*, sm.sts_desc,sm.sts_color,sm.sts_bgcolor,crs.picture as 'pic',
      (SELECT count(*) FROM class_sessions WHERE sts_pk='e' AND class_pk=c.class_pk) closed_sessions
      FROM classes c
      JOIN status_master sm
      ON sm.sts_pk = c.sts_pk
      LEFT JOIN courses crs 
      ON crs.course_pk = c.course_pk
      ) tmp
      WHERE
      (class_desc like concat('%',@search,'%')
      OR room_desc like concat('%',@search,'%')
      OR class_type like concat('%',@search,'%')
      OR tutor_name like concat('%',@search,'%'))
      AND tutor_pk =getTutorPK(${user_pk})
      `,
      payload
    );

    const hasMore: boolean = data.length > payload.page.limit;

    if (hasMore) {
      data.splice(data.length - 1, 1);
    }

    const count: number = hasMore
      ? -1
      : payload.page.begin * payload.page.limit + data.length;

    for (const c of data) {
      c.pic = await GetUploadedImage(c.pic);
    }

    con.Commit();
    return {
      success: true,
      data: {
        table: data,
        begin: payload.page.begin,
        count: count,
        limit: payload.page.limit,
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

const getSingleClass = async (class_pk: string): Promise<ResponseModel> => {
  const con = await DatabaseConnection();
  try {
    await con.BeginTransaction();

    const data: ClassModel = await con.QuerySingle(
      `SELECT c.*, sm.sts_desc,sm.sts_color,sm.sts_bgcolor,crs.picture as 'pic',
      (SELECT count(*) FROM class_sessions WHERE sts_pk='e' AND class_pk=c.class_pk) closed_sessions
      FROM classes c
      JOIN status_master sm
      ON sm.sts_pk = c.sts_pk
      LEFT JOIN courses crs 
      ON crs.course_pk = c.course_pk where c.class_pk=@class_pk limit 1`,
      {
        class_pk: class_pk,
      }
    );

    if (data?.pic) {
      data.pic = await GetUploadedImage(data.pic);
    }

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

const getStudentUnenrolledClassTable = async (
  payload: PaginationModel,
  user_pk: string
): Promise<ResponseModel> => {
  const con = await DatabaseConnection();
  try {
    await con.BeginTransaction();

    const data: Array<
      ClassModel & StatusMasterModel
    > = await con.QueryPagination(
      `SELECT * FROM 
        (
          SELECT c.class_pk,c.class_desc,cr.course_desc,c.start_time, c.end_time,c.start_date,cr.picture course_pic, t.picture tutor_pic, c.tutor_name, sm.sts_pk,sm.sts_desc,sm.sts_color,sm.sts_bgcolor,c.encoded_at FROM classes c
          LEFT JOIN tutors t ON c.tutor_pk = c.tutor_pk
          LEFT JOIN class_students cs ON cs.class_pk = c.class_pk
          LEFT JOIN courses cr ON cr.course_pk = c.course_pk
          LEFT JOIN status_master sm ON sm.sts_pk = c.sts_pk
          WHERE c.class_pk NOT IN (SELECT class_pk FROM class_students  WHERE student_pk =getStudentPK('${user_pk}') )  AND c.sts_pk = 'a'
          GROUP BY c.class_pk
        ) tmp
      WHERE
      class_desc LIKE CONCAT('%',@search,'%')
      OR course_desc LIKE CONCAT('%',@search,'%')
      `,
      payload
    );

    const hasMore: boolean = data.length > payload.page.limit;

    if (hasMore) {
      data.splice(data.length - 1, 1);
    }

    const count: number = hasMore
      ? -1
      : payload.page.begin * payload.page.limit + data.length;

    for (const c of data) {
      c.tutor_pic = await GetUploadedImage(c.tutor_pic);
      c.course_pic = await GetUploadedImage(c.course_pic);
    }

    con.Commit();
    return {
      success: true,
      data: {
        table: data,
        begin: payload.page.begin,
        count: count,
        limit: payload.page.limit,
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

const getStudentEnrolledClasses = async (
  user_pk: number
): Promise<ResponseModel> => {
  const con = await DatabaseConnection();
  try {
    await con.BeginTransaction();

    const data: Array<ClassModel> = await con.Query(
      `SELECT c.class_pk,c.class_desc,c.course_desc,c.start_time, c.end_time,t.picture tutor_pic, c.tutor_name,
      IF((SELECT COUNT(*) FROM class_sessions WHERE sts_pk ='s' AND class_pk = c.class_pk ) > 0 , TRUE, FALSE) is_ongoing
      FROM classes c
      LEFT JOIN tutors t ON c.tutor_pk = c.tutor_pk
      LEFT JOIN class_students cs ON cs.class_pk = c.class_pk
      WHERE cs.student_pk =getStudentPK('${user_pk}')
      GROUP BY c.class_pk`,
      null
    );

    for (const t of data) {
      t.tutor_pic = await GetUploadedImage(t.tutor_pic);
      t.course_pic = await GetUploadedImage(t.course_pic);
    }

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
  addClass,
  updateClass,
  getClassDataTable,
  getSingleClass,
  getTutorClassTable,
  approveClass,
  getStudentUnenrolledClassTable,
  getStudentEnrolledClasses,
};
