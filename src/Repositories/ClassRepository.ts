import axios from "axios";
import { DatabaseConnection } from "../Configurations/DatabaseConfig";
import {
  parseInvalidDateToDefault,
  parseInvalidTimeToDefault,
} from "../Hooks/useDateParser";
import { ErrorMessage } from "../Hooks/useErrorMessage";
import { GetUploadedImage } from "../Hooks/useFileUploader";
import UseSms from "../Hooks/UseSms";
import { ClassModel } from "../Models/ClassModel";
import { ClassRatingModel } from "../Models/ClassRatingModel";
import { NotifModel } from "../Models/NotifModel";
import { PaginationModel } from "../Models/PaginationModel";
import { ResponseModel } from "../Models/ResponseModel";
import { StatsModel } from "../Models/StatsModel";
import { StatusMasterModel } from "../Models/StatusMasterModel";
import { TutorModel } from "../Models/TutorModel";

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

    payload.class_pk = sql_insert_class.insertedId;

    const tutor_info: TutorModel = await con.QuerySingle(
      `SELECT * FROM tutors where tutor_pk=@tutor_pk;`,
      {
        tutor_pk: payload.tutor_pk,
      }
    );

    const msg = `Good day ${tutor_info.firstname} ${tutor_info.lastname}. This is Catalunan Pequeño National High School informing you that a class entitled ${payload.class_desc} has been assigned to you.
    `;

    const res = await UseSms.SendSms(tutor_info.mob_no, msg);

    const notif_payload: NotifModel = {
      body: `A class entitled ${payload.class_desc} has been assigned to you.`,
      user_pk: tutor_info.user_id,
      link: `/tutor/class/${payload.class_pk}/session`,
      user_type: "tutor",
    };

    const notif_res = await con.Insert(
      `INSERT INTO notif 
        SET
        body=@body,
        link=@link;`,
      notif_payload
    );

    notif_payload.notif_pk = notif_res.insertedId;

    await con.Insert(
      `INSERT INTO notif_users 
      SET 
      notif_pk=@notif_pk,
      user_type=@user_type,
      user_pk=@user_pk;`,
      notif_payload
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

      const tutor_info: TutorModel = await con.QuerySingle(
        `select user_id from tutors where tutor_pk = @tutor_pk;`,
        {
          tutor_pk: payload.tutor_pk,
        }
      );

      con.Commit();
      return {
        success: true,
        message: "The item has been added successfully",
        data: {
          tutor_user_id: tutor_info.user_id,
        },
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

const approveClass = async (payload: ClassModel): Promise<ResponseModel> => {
  const con = await DatabaseConnection();
  try {
    await con.BeginTransaction();

    const session_sts_pk = await con.QuerySingle(
      `SELECT sts_pk from classes where class_pk=@class_pk;`,
      {
        class_pk: payload.class_pk,
      }
    );

    if (session_sts_pk.sts_pk !== "fa") {
      con.Rollback();
      return {
        success: false,
        message:
          "Only classes that are marked as 'FOR APPROVAL' can be updated to 'APPROVED'",
      };
    }

    const sql_insert_audit_log = await con.Insert(
      `
      INSERT INTO audit_log SET 
      user_pk=@user_pk,
      activity=CONCAT('marked the class ',(select class_desc from classes where class_pk=@class_pk limit 1),' to APPROVED ');
      `,
      {
        user_pk: payload.encoder_pk,
        class_pk: payload.class_pk,
      }
    );

    if (sql_insert_audit_log.affectedRows > 0) {
      const sql_approve_class = await con.Insert(
        `
        UPDATE classes
        SET 
        sts_pk='a',
        remarks=@remarks
        WHERE
        class_pk=@class_pk;
          `,
        payload
      );
      if (sql_approve_class.affectedRows > 0) {
        con.Commit();
        return {
          success: true,
          message: "The class has been approved!",
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

const declineClass = async (payload: ClassModel): Promise<ResponseModel> => {
  const con = await DatabaseConnection();
  try {
    await con.BeginTransaction();

    const session_sts_pk = await con.QuerySingle(
      `SELECT sts_pk from classes where class_pk=@class_pk;`,
      {
        class_pk: payload.class_pk,
      }
    );

    if (session_sts_pk.sts_pk !== "fa") {
      con.Rollback();
      return {
        success: false,
        message:
          "Only classes that are marked as 'FOR APPROVAL' can be updated to 'DECLINED'",
      };
    }

    const sql_insert_audit_log = await con.Insert(
      `
      INSERT INTO audit_log SET 
      user_pk=@user_pk,
      activity=CONCAT('marked the class ',(select class_desc from classes where class_pk=@class_pk limit 1),' to DECLINED ');
      `,
      {
        user_pk: payload.encoder_pk,
        class_pk: payload.class_pk,
      }
    );

    if (sql_insert_audit_log.affectedRows > 0) {
      const sql_approve_class = await con.Insert(
        `
        UPDATE classes
        SET 
        sts_pk='d',
        remarks=@remarks
        WHERE
        class_pk=@class_pk;
          `,
        payload
      );
      if (sql_approve_class.affectedRows > 0) {
        con.Commit();
        return {
          success: true,
          message: "The class has been declined",
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

const endClass = async (payload: ClassModel): Promise<ResponseModel> => {
  const con = await DatabaseConnection();
  try {
    await con.BeginTransaction();

    const session_sts_pk = await con.QuerySingle(
      `SELECT sts_pk from classes where class_pk=@class_pk;`,
      {
        class_pk: payload.class_pk,
      }
    );

    if (session_sts_pk.sts_pk !== "a") {
      con.Rollback();
      return {
        success: false,
        message:
          "Only classes that are currently marked as 'APPROVED' can be updated to 'ENDED'",
      };
    }

    const sql_insert_audit_log = await con.Insert(
      `
      INSERT INTO audit_log SET 
      user_pk=@user_pk,
      activity=CONCAT('marked the class ',(select class_desc from classes where class_pk=@class_pk limit 1),' to ENDED ');
      `,
      {
        user_pk: payload.encoder_pk,
        class_pk: payload.class_pk,
      }
    );

    if (sql_insert_audit_log.affectedRows > 0) {
      const sql_approve_class = await con.Insert(
        `
        UPDATE classes
        SET 
        sts_pk='e',
        remarks=@remarks
        WHERE
        class_pk=@class_pk;
          `,
        payload
      );
      if (sql_approve_class.affectedRows > 0) {
        con.Commit();
        return {
          success: true,
          message: "The class has been declined",
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

const rateClass = async (
  payload: ClassRatingModel,
  user_type: string
): Promise<ResponseModel> => {
  const con = await DatabaseConnection();
  try {
    await con.BeginTransaction();

    if (user_type === "student") {
      const count_student_session = await con.QuerySingle(
        `
      SELECT COUNT(*) AS total FROM class_students cs 
      JOIN class_sessions s ON s.class_pk = cs.class_pk
      WHERE cs.student_pk = (SELECT student_pk FROM students WHERE user_id =@user_pk) AND s.class_pk = @class_pk

      `,
        {
          user_pk: payload.encoded_by,
          class_pk: payload.class_pk,
        }
      );

      if (count_student_session?.total <= 0) {
        await con.Rollback();
        return {
          success: false,
          message:
            "You cannot participate a class session that you have not enrolled yet.",
        };
      }
    }

    const res_count_rating = await con.QuerySingle(
      `
    SELECT class_rate_pk FROM class_rating WHERE class_pk =@class_pk AND student_pk =(select student_pk from students where user_id=@encoded_by limit 1);`,
      payload
    );

    if (res_count_rating?.class_rate_pk) {
      payload.class_rate_pk = res_count_rating.class_rate_pk;

      const sql_update_rating = await con.Modify(
        `
        UPDATE class_rating set rate_val=@rate_val where class_rate_pk=@class_rate_pk;
      `,
        payload
      );

      if (sql_update_rating < 1) {
        con.Rollback();
        return {
          success: false,
          message: "There were no rows affected during the process.",
        };
      }
    } else {
      const sql_insert_rating = await con.Insert(
        `
        INSERT into class_rating set rate_val=@rate_val,encoded_by=@encoded_by,student_pk=(select student_pk from students where user_id=@encoded_by limit 1),class_pk=@class_pk;
      `,
        payload
      );

      if (sql_insert_rating.insertedId < 1) {
        con.Rollback();
        return {
          success: false,
          message: "There were no rows affected during the process.",
        };
      }
    }

    const audit_log = await con.Insert(
      `insert into audit_log set 
      user_pk=@user_pk,
      activity=CONCAT('gave ${payload.rate_val} ratings to class ',(select class_desc from classes where class_pk=@class_pk limit 1));
      `,
      {
        user_pk: payload.encoded_by,
        class_pk: payload.class_pk,
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
      message: `The rating has been saved successfully!`,
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
      AND tutor_pk = (SELECT tutor_pk FROM tutors WHERE user_id='${user_pk}' LIMIT 1)
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

const getClassRatings = async (class_pk: number): Promise<ResponseModel> => {
  const con = await DatabaseConnection();
  try {
    await con.BeginTransaction();

    const table_ratings: Array<ClassRatingModel> = await con.Query(
      `SELECT * FROM class_rating WHERE class_pk =@class_pk
      `,
      {
        class_pk: class_pk,
      }
    );

    for (const r of table_ratings) {
      r.student_info = await con.QuerySingle(
        `select * from students where student_pk = @student_pk;`,
        {
          student_pk: r.student_pk,
        }
      );

      r.student_info.picture = await GetUploadedImage(r.student_info.picture);
    }

    con.Commit();
    return {
      success: true,
      data: table_ratings,
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

const getSingleClass = async (
  class_pk: string,
  user_pk: number,
  user_type: string
): Promise<ResponseModel> => {
  const con = await DatabaseConnection();
  try {
    await con.BeginTransaction();

    const data: ClassModel = await con.QuerySingle(
      `SELECT c.*, sm.sts_desc,sm.sts_color,sm.sts_bgcolor,crs.picture as 'pic',
      (SELECT count(*) FROM class_sessions WHERE sts_pk='e' AND class_pk=c.class_pk) closed_sessions,
      COALESCE((SELECT SUM(rate_val)/COUNT(*) FROM class_rating WHERE class_pk = c.class_pk), 0) AS average_rating
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

    if (data.tutor_pk) {
      data.tutor_info = await con.QuerySingle(
        `select * from tutors where tutor_pk=@tutor_pk`,
        {
          tutor_pk: data.tutor_pk,
        }
      );

      data.tutor_info.picture = await GetUploadedImage(data.tutor_info.picture);
    }

    if (user_type === "student" && data.class_pk) {
      const student_rating = await con.QuerySingle(
        `
      SELECT rate_val FROM class_rating WHERE student_pk =(select student_pk from students where user_id=@user_pk) AND class_pk = @class_pk LIMIT 1
      `,
        {
          user_pk: user_pk,
          class_pk: data.class_pk,
        }
      );

      if (student_rating?.rate_val) {
        data.student_rating = student_rating?.rate_val;
      }
    }

    const average_summary = await con.QuerySingle(
      `SELECT (SUM(rate_val)/COUNT(*)) average_summary FROM class_rating WHERE class_pk =@class_pk`,
      {
        class_pk: data.class_pk,
      }
    );

    data.average_rating = average_summary.average_summary;

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

const getStudentAvailableClassTable = async (
  payload: PaginationModel,
  user_pk: string
): Promise<ResponseModel> => {
  const con = await DatabaseConnection();
  try {
    await con.BeginTransaction();

    const class_table: Array<ClassModel> = await con.QueryPagination(
      `SELECT * FROM 
        (
          SELECT * FROM classes c
          WHERE class_pk NOT IN (SELECT cs.class_pk FROM class_students cs
            JOIN students s ON cs.student_pk = s.student_pk
             WHERE s.user_id =${user_pk}  ) AND c.sts_pk = 'a' 
          GROUP BY c.class_pk
        ) tmp
      WHERE
      class_desc LIKE CONCAT('%',@search,'%')
      OR course_desc LIKE CONCAT('%',@search,'%')
      #OR room_desc LIKE CONCAT('%',@search,'%')
      `,
      payload
    );

    for (const c of class_table) {
      c.status = await con.QuerySingle(
        `select * from status_master where sts_pk=@sts_pk;`,
        {
          sts_pk: c.sts_pk,
        }
      );

      c.course_info = await con.QuerySingle(
        `select * from courses where course_pk=@course_pk;`,
        {
          course_pk: c.course_pk,
        }
      );
      c.course_info.picture = await GetUploadedImage(c.course_info.picture);

      if (c.tutor_pk) {
        c.tutor_info = await con.QuerySingle(
          `select * from tutors where tutor_pk=@tutor_pk;`,
          {
            tutor_pk: c.tutor_pk,
          }
        );

        c.tutor_info.picture = await GetUploadedImage(c.tutor_info.picture);
      }
    }

    const hasMore: boolean = class_table.length > payload.page.limit;

    if (hasMore) {
      class_table.splice(class_table.length - 1, 1);
    }

    const count: number = hasMore
      ? -1
      : payload.page.begin * payload.page.limit + class_table.length;

    con.Commit();
    return {
      success: true,
      data: {
        table: class_table,
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

const getStudentOngoingClassTable = async (
  payload: PaginationModel,
  user_pk: string
): Promise<ResponseModel> => {
  const con = await DatabaseConnection();
  try {
    await con.BeginTransaction();

    const class_table: Array<ClassModel> = await con.QueryPagination(
      `SELECT * FROM 
        (
          SELECT * FROM classes  c
          WHERE class_pk  IN (SELECT cs.class_pk FROM class_students cs
            JOIN students s ON cs.student_pk = s.student_pk
             WHERE s.user_id =${user_pk} ) AND sts_pk = 'a'
          GROUP BY c.class_pk
        ) tmp
      WHERE
      class_desc LIKE CONCAT('%',@search,'%')
      OR course_desc LIKE CONCAT('%',@search,'%')
      OR room_desc LIKE CONCAT('%',@search,'%')
      `,
      payload
    );

    for (const c of class_table) {
      c.status = await con.QuerySingle(
        `select * from status_master where sts_pk=@sts_pk;`,
        {
          sts_pk: c.sts_pk,
        }
      );

      c.course_info = await con.QuerySingle(
        `select * from courses where course_pk=@course_pk;`,
        {
          course_pk: c.course_pk,
        }
      );
      c.course_info.picture = await GetUploadedImage(c.course_info.picture);

      if (c.tutor_pk) {
        c.tutor_info = await con.QuerySingle(
          `select * from tutors where tutor_pk=@tutor_pk;`,
          {
            tutor_pk: c.tutor_pk,
          }
        );

        c.tutor_info.picture = await GetUploadedImage(c.tutor_info.picture);
      }
    }

    const hasMore: boolean = class_table.length > payload.page.limit;

    if (hasMore) {
      class_table.splice(class_table.length - 1, 1);
    }

    const count: number = hasMore
      ? -1
      : payload.page.begin * payload.page.limit + class_table.length;

    con.Commit();
    return {
      success: true,
      data: {
        table: class_table,
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

const getStudentEndedClassTable = async (
  payload: PaginationModel,
  user_pk: string
): Promise<ResponseModel> => {
  const con = await DatabaseConnection();
  try {
    await con.BeginTransaction();

    const class_table: Array<ClassModel> = await con.QueryPagination(
      `SELECT * FROM 
        (
          SELECT * FROM classes  c
          WHERE class_pk  IN (SELECT cs.class_pk FROM class_students cs
            JOIN students s ON cs.student_pk = s.student_pk
             WHERE s.user_id =${user_pk} ) AND (c.sts_pk =  'e' )
          GROUP BY c.class_pk
        ) tmp
      WHERE
      class_desc LIKE CONCAT('%',@search,'%')
      OR course_desc LIKE CONCAT('%',@search,'%')
      OR room_desc LIKE CONCAT('%',@search,'%')
      `,
      payload
    );

    for (const c of class_table) {
      c.status = await con.QuerySingle(
        `select * from status_master where sts_pk=@sts_pk;`,
        {
          sts_pk: c.sts_pk,
        }
      );

      c.course_info = await con.QuerySingle(
        `select * from courses where course_pk=@course_pk;`,
        {
          course_pk: c.course_pk,
        }
      );
      c.course_info.picture = await GetUploadedImage(c.course_info.picture);

      if (c.tutor_pk) {
        c.tutor_info = await con.QuerySingle(
          `select * from tutors where tutor_pk=@tutor_pk;`,
          {
            tutor_pk: c.tutor_pk,
          }
        );

        c.tutor_info.picture = await GetUploadedImage(c.tutor_info.picture);
      }
    }

    const hasMore: boolean = class_table.length > payload.page.limit;

    if (hasMore) {
      class_table.splice(class_table.length - 1, 1);
    }

    const count: number = hasMore
      ? -1
      : payload.page.begin * payload.page.limit + class_table.length;

    con.Commit();
    return {
      success: true,
      data: {
        table: class_table,
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
      WHERE cs.student_pk =(SELECT student_pk FROM students WHERE user_id='${user_pk}' LIMIT 1) 
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

const getAllTutorClasses = async (tutor_pk: number): Promise<ResponseModel> => {
  const con = await DatabaseConnection();
  try {
    await con.BeginTransaction();

    const res_classes: Array<ClassModel> = await con.Query(
      `
        SELECT * from classes where tutor_pk = @tutor_pk
      `,
      {
        tutor_pk,
      }
    );

    for (const c of res_classes) {
      c.status = await con.QuerySingle(
        `Select * from status_master where sts_pk=@sts_pk;`,
        {
          sts_pk: c.sts_pk,
        }
      );

      const sql_total_ended_session = await con.QuerySingle(
        `SELECT COUNT(*) AS total FROM class_sessions WHERE sts_pk = 'e' AND class_pk =@class_pk;`,
        {
          class_pk: c.class_pk,
        }
      );

      c.ended_session = sql_total_ended_session.total;
    }

    con.Commit();
    return {
      success: true,
      data: res_classes,
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

const getStudentClassByStudentPk = async (
  student_pk: number
): Promise<ResponseModel> => {
  const con = await DatabaseConnection();
  try {
    await con.BeginTransaction();

    const data: Array<ClassModel> = await con.Query(
      `SELECT c.class_pk,c.sts_pk,c.session_count,c.class_desc,c.course_desc,c.start_time, c.end_time,t.picture tutor_pic, c.tutor_name,
      IF((SELECT COUNT(*) FROM class_sessions WHERE sts_pk ='s' AND class_pk = c.class_pk ) > 0 , TRUE, FALSE) is_ongoing
      FROM classes c
      LEFT JOIN tutors t ON c.tutor_pk = c.tutor_pk
      LEFT JOIN class_students cs ON cs.class_pk = c.class_pk
      WHERE cs.student_pk =@student_pk
      GROUP BY c.class_pk`,
      {
        student_pk: student_pk,
      }
    );

    for (const t of data) {
      t.tutor_pic = await GetUploadedImage(t.tutor_pic);
      t.course_pic = await GetUploadedImage(t.course_pic);

      t.status = await con.QuerySingle(
        `select * from status_master where sts_pk = @sts_pk;`,
        {
          sts_pk: t.sts_pk,
        }
      );

      const sql_total_ended_session = await con.QuerySingle(
        `SELECT COUNT(*) AS total FROM class_sessions WHERE sts_pk = 'e' AND class_pk =@class_pk;`,
        {
          class_pk: t.class_pk,
        }
      );

      t.ended_session = sql_total_ended_session.total;
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

const getClassSummaryStats = async (): Promise<ResponseModel> => {
  const con = await DatabaseConnection();
  try {
    await con.BeginTransaction();

    const affected_status = ["fa", "a", "e", "c"];

    const statistics_data: Array<StatsModel> = [];

    for (const s of affected_status) {
      const total = await con.QuerySingle(
        `
        SELECT   COUNT(*) total   FROM classes WHERE sts_pk  =@sts_pk;
        `,
        {
          sts_pk: s,
        }
      );

      const status_info: StatusMasterModel = await con.QuerySingle(
        `
      SELECT   *    FROM status_master WHERE sts_pk  =@sts_pk;
      `,
        {
          sts_pk: s,
        }
      );

      statistics_data.push({
        label: status_info.sts_desc,
        backgroundColor: status_info.sts_bgcolor,
        value: total.total,
      });
    }

    con.Commit();
    return {
      success: true,
      data: statistics_data,
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

const getOpenClassProgressStats = async (): Promise<ResponseModel> => {
  const con = await DatabaseConnection();
  try {
    await con.BeginTransaction();

    const class_table: Array<ClassModel> = await con.Query(
      `SELECT c.*,IF((SELECT COUNT(*) FROM class_sessions WHERE sts_pk ='s' AND class_pk = c.class_pk ) > 0 , TRUE, FALSE) is_ongoing
      FROM classes c
      GROUP BY c.class_pk`,
      null
    );

    for (const c of class_table) {
      c.tutor_info = await con.QuerySingle(
        `select * from tutors where tutor_pk=@tutor_pk;`,
        {
          tutor_pk: c.tutor_pk,
        }
      );

      if (c?.tutor_info?.picture) {
        c.tutor_info.picture = await GetUploadedImage(c?.tutor_info?.picture);
      }

      c.course_pic = await GetUploadedImage(c.course_pic);

      const sql_total_ended_session = await con.QuerySingle(
        `SELECT COUNT(*) AS total FROM class_sessions WHERE sts_pk = 'e' AND class_pk =@class_pk;`,
        {
          class_pk: c.class_pk,
        }
      );

      c.ended_session = sql_total_ended_session.total;
    }

    con.Commit();
    return {
      success: true,
      data: class_table,
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

const getTotalClasses = async (): Promise<ResponseModel> => {
  const con = await DatabaseConnection();
  try {
    await con.BeginTransaction();

    const res_sql_count = await con.QuerySingle(
      `select count(*) as total from classes where sts_pk <> 'c';`,
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

const getTotalTutorClassStats = async (
  user_pk: number
): Promise<ResponseModel> => {
  const con = await DatabaseConnection();
  try {
    await con.BeginTransaction();

    const data: Array<StatsModel> = await con.Query(
      `SELECT * FROM (
        SELECT 'For Approval Classes' AS label, COUNT(*) AS value FROM classes WHERE sts_pk = 'fa' AND tutor_pk = (SELECT  tutor_pk FROM tutors WHERE user_id = @user_pk)
        UNION 
        SELECT 'Approved Classes' AS label, COUNT(*) AS value FROM classes WHERE sts_pk = 'a' AND tutor_pk = (SELECT  tutor_pk FROM tutors WHERE user_id = @user_pk)
        UNION 
        SELECT 'Ended Classes' AS label, COUNT(*) AS value FROM classes WHERE sts_pk = 'e' AND tutor_pk = (SELECT  tutor_pk FROM tutors WHERE user_id = @user_pk)
        ) tmp
        `,
      {
        user_pk,
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

const getTotalStudentClassStats = async (
  user_pk: number
): Promise<ResponseModel> => {
  const con = await DatabaseConnection();
  try {
    await con.BeginTransaction();

    const data: Array<StatsModel> = await con.Query(
      `SELECT * FROM (
        SELECT 'Available Classes' AS label, COUNT(*) AS 'value', '#f44336' as 'backgroundColor' FROM classes c
        WHERE class_pk NOT IN (SELECT cs.class_pk FROM class_students cs
        JOIN students s ON cs.student_pk = s.student_pk
        WHERE s.user_id =@user_pk ) AND c.sts_pk = 'a' 
        UNION 
        SELECT 'Enrolled/Ongoing Classes' AS label, COUNT(*) AS 'value', '#9c27b0' as 'backgroundColor' FROM classes  c
        WHERE class_pk  IN (SELECT cs.class_pk FROM class_students cs
        JOIN students s ON cs.student_pk = s.student_pk
        WHERE s.user_id =@user_pk ) AND sts_pk = 'a'
        UNION 
        SELECT 'Ended Classes' AS label, COUNT(*) AS 'value', '#009688' as 'backgroundColor' FROM classes  c
        WHERE class_pk  IN (SELECT cs.class_pk FROM class_students cs
        JOIN students s ON cs.student_pk = s.student_pk
         WHERE s.user_id =@user_pk ) AND (c.sts_pk =  'e' )
        ) tmp
        `,
      {
        user_pk,
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

const getEndedClassRatingStats = async (): Promise<ResponseModel> => {
  const con = await DatabaseConnection();
  try {
    await con.BeginTransaction();

    const data: Array<StatsModel> = await con.Query(
      `SELECT class_desc AS label,average_rating AS 'value', if(average_rating > 2, '#03a9f4','#f44336') as backgroundColor  FROM 
        (
        SELECT class_desc,
        COALESCE((SELECT  SUM(rate_val)/COUNT(*) FROM class_rating WHERE class_pk = c.class_pk), 0) AS average_rating 
        FROM classes c 
        ) tmp
        #WHERE sts_pk = 'e'
        ORDER BY average_rating DESC 
        `,
      null
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
  addClass,
  updateClass,
  getClassDataTable,
  getSingleClass,
  getTutorClassTable,
  approveClass,
  declineClass,
  endClass,
  getStudentAvailableClassTable,
  getStudentOngoingClassTable,
  getStudentEndedClassTable,
  getStudentEnrolledClasses,
  getAllTutorClasses,
  getStudentClassByStudentPk,
  getClassSummaryStats,
  getOpenClassProgressStats,
  getTotalClasses,
  getTotalTutorClassStats,
  rateClass,
  getTotalStudentClassStats,
  getEndedClassRatingStats,
  getClassRatings,
};
