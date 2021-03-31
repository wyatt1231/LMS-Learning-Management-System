"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const DatabaseConfig_1 = require("../Configurations/DatabaseConfig");
const useDateParser_1 = require("../Hooks/useDateParser");
const useErrorMessage_1 = require("../Hooks/useErrorMessage");
const useFileUploader_1 = require("../Hooks/useFileUploader");
const addClass = (payload, user_id) => __awaiter(void 0, void 0, void 0, function* () {
    const con = yield DatabaseConfig_1.DatabaseConnection();
    try {
        yield con.BeginTransaction();
        payload.encoder_pk = user_id;
        payload.start_date = useDateParser_1.parseInvalidDateToDefault(payload.start_date);
        payload.start_time = useDateParser_1.parseInvalidTimeToDefault(payload.start_time);
        payload.end_time = useDateParser_1.parseInvalidTimeToDefault(payload.end_time);
        const sql_insert_class = yield con.Insert(`
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
        `, payload);
        if (sql_insert_class.insertedId > 0) {
            for (const session of payload.class_sessions) {
                session.class_pk = sql_insert_class.insertedId;
                session.encoder_pk = user_id;
                session.start_date = useDateParser_1.parseInvalidDateToDefault(session.start_date);
                session.start_time = useDateParser_1.parseInvalidTimeToDefault(payload.start_time);
                session.end_time = useDateParser_1.parseInvalidTimeToDefault(payload.end_time);
                const sql_insert_session = yield con.Insert(`
            INSERT INTO class_sessions SET
            class_pk=@class_pk,
            start_date=@start_date,
            start_time=@start_time,
            end_time=@end_time,
            encoder_pk=@encoder_pk;
            `, session);
                if (sql_insert_session.affectedRows < 1) {
                    con.Rollback();
                    return {
                        success: false,
                        message: "There were no rows affected while inserting the class session.",
                    };
                }
            }
            con.Commit();
            return {
                success: true,
                message: "The item has been added successfully",
            };
        }
        else {
            con.Rollback();
            return {
                success: false,
                message: "There were no rows affected while inserting the new record.",
            };
        }
    }
    catch (error) {
        yield con.Rollback();
        console.error(`error`, error);
        return {
            success: false,
            message: useErrorMessage_1.ErrorMessage(error),
        };
    }
});
const updateClass = (payload, user_id) => __awaiter(void 0, void 0, void 0, function* () {
    const con = yield DatabaseConfig_1.DatabaseConnection();
    try {
        yield con.BeginTransaction();
        payload.encoder_pk = user_id;
        const sql_update_class = yield con.Insert(`
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
        `, payload);
        if (sql_update_class.insertedId > 0) {
            con.Commit();
            return {
                success: true,
                message: "The item has been added successfully",
            };
        }
        else {
            con.Rollback();
            return {
                success: false,
                message: "There were no rows affected while inserting the new record.",
            };
        }
    }
    catch (error) {
        yield con.Rollback();
        console.error(`error`, error);
        return {
            success: false,
            message: useErrorMessage_1.ErrorMessage(error),
        };
    }
});
const approveClass = (class_pk, user_pk) => __awaiter(void 0, void 0, void 0, function* () {
    const con = yield DatabaseConfig_1.DatabaseConnection();
    try {
        yield con.BeginTransaction();
        const sql_insert_audit_log = yield con.Insert(`
      INSERT INTO audit_log SET 
      user_pk='${user_pk}',
      activity=CONCAT('approved class ',(SELECT class_desc from classes where class_pk=@class_pk limit 1));
        `, {
            class_pk: class_pk,
        });
        if (sql_insert_audit_log.affectedRows > 0) {
            const sql_approve_class = yield con.Insert(`
        UPDATE classes
        SET 
        sts_pk='a'
        WHERE
        class_pk=@class_pk;
          `, {
                class_pk: class_pk,
            });
            if (sql_approve_class.affectedRows > 0) {
                con.Commit();
                return {
                    success: true,
                    message: "The class has been approved successfully",
                };
            }
            else {
                con.Rollback();
                return {
                    success: false,
                    message: "There were no rows affected in the process",
                };
            }
        }
        else {
            con.Rollback();
            return {
                success: false,
                message: "There were no rows affected in the process",
            };
        }
    }
    catch (error) {
        yield con.Rollback();
        console.error(`error`, error);
        return {
            success: false,
            message: useErrorMessage_1.ErrorMessage(error),
        };
    }
});
const getClassDataTable = (pagination_payload) => __awaiter(void 0, void 0, void 0, function* () {
    const con = yield DatabaseConfig_1.DatabaseConnection();
    try {
        yield con.BeginTransaction();
        const data = yield con.QueryPagination(`SELECT * FROM 
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
      `, pagination_payload);
        const hasMore = data.length > pagination_payload.page.limit;
        if (hasMore) {
            data.splice(data.length - 1, 1);
        }
        const count = hasMore
            ? -1
            : pagination_payload.page.begin * pagination_payload.page.limit +
                data.length;
        for (const c of data) {
            c.pic = yield useFileUploader_1.GetUploadedImage(c.pic);
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
    }
    catch (error) {
        yield con.Rollback();
        console.error(`error`, error);
        return {
            success: false,
            message: useErrorMessage_1.ErrorMessage(error),
        };
    }
});
const getTutorClassTable = (payload, user_pk) => __awaiter(void 0, void 0, void 0, function* () {
    const con = yield DatabaseConfig_1.DatabaseConnection();
    try {
        yield con.BeginTransaction();
        const data = yield con.QueryPagination(`SELECT * FROM 
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
      `, payload);
        const hasMore = data.length > payload.page.limit;
        if (hasMore) {
            data.splice(data.length - 1, 1);
        }
        const count = hasMore
            ? -1
            : payload.page.begin * payload.page.limit + data.length;
        for (const c of data) {
            c.pic = yield useFileUploader_1.GetUploadedImage(c.pic);
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
    }
    catch (error) {
        yield con.Rollback();
        console.error(`error`, error);
        return {
            success: false,
            message: useErrorMessage_1.ErrorMessage(error),
        };
    }
});
const getSingleClass = (class_pk) => __awaiter(void 0, void 0, void 0, function* () {
    const con = yield DatabaseConfig_1.DatabaseConnection();
    try {
        yield con.BeginTransaction();
        const data = yield con.QuerySingle(`SELECT c.*, sm.sts_desc,sm.sts_color,sm.sts_bgcolor,crs.picture as 'pic',
      (SELECT count(*) FROM class_sessions WHERE sts_pk='e' AND class_pk=c.class_pk) closed_sessions
      FROM classes c
      JOIN status_master sm
      ON sm.sts_pk = c.sts_pk
      LEFT JOIN courses crs 
      ON crs.course_pk = c.course_pk where c.class_pk=@class_pk limit 1`, {
            class_pk: class_pk,
        });
        if (data === null || data === void 0 ? void 0 : data.pic) {
            data.pic = yield useFileUploader_1.GetUploadedImage(data.pic);
        }
        data.tutor_info = yield con.QuerySingle(`select * from tutors where tutor_pk=@tutor_pk`, {
            tutor_pk: data.tutor_pk,
        });
        data.tutor_info.picture = yield useFileUploader_1.GetUploadedImage(data.pic);
        con.Commit();
        return {
            success: true,
            data: data,
        };
    }
    catch (error) {
        yield con.Rollback();
        console.error(`error`, error);
        return {
            success: false,
            message: useErrorMessage_1.ErrorMessage(error),
        };
    }
});
const getStudentUnenrolledClassTable = (payload, user_pk) => __awaiter(void 0, void 0, void 0, function* () {
    const con = yield DatabaseConfig_1.DatabaseConnection();
    try {
        yield con.BeginTransaction();
        const data = yield con.QueryPagination(`SELECT * FROM 
        (
          SELECT c.class_pk,c.class_desc,cr.course_desc,c.start_time, c.end_time,c.start_date,cr.picture course_pic, t.picture tutor_pic, c.tutor_name, sm.sts_pk,sm.sts_desc,sm.sts_color,sm.sts_bgcolor,c.encoded_at FROM classes c
          LEFT JOIN tutors t ON c.tutor_pk = c.tutor_pk
          LEFT JOIN class_students cs ON cs.class_pk = c.class_pk
          LEFT JOIN courses cr ON cr.course_pk = c.course_pk
          LEFT JOIN status_master sm ON sm.sts_pk = c.sts_pk
          WHERE c.class_pk NOT IN (SELECT class_pk FROM class_students  WHERE student_pk =(SELECT student_pk FROM students WHERE user_id='${user_pk}' LIMIT 1) )  AND c.sts_pk = 'a'
          GROUP BY c.class_pk
        ) tmp
      WHERE
      class_desc LIKE CONCAT('%',@search,'%')
      OR course_desc LIKE CONCAT('%',@search,'%')
      `, payload);
        const hasMore = data.length > payload.page.limit;
        if (hasMore) {
            data.splice(data.length - 1, 1);
        }
        const count = hasMore
            ? -1
            : payload.page.begin * payload.page.limit + data.length;
        for (const c of data) {
            c.tutor_pic = yield useFileUploader_1.GetUploadedImage(c.tutor_pic);
            c.course_pic = yield useFileUploader_1.GetUploadedImage(c.course_pic);
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
    }
    catch (error) {
        yield con.Rollback();
        console.error(`error`, error);
        return {
            success: false,
            message: useErrorMessage_1.ErrorMessage(error),
        };
    }
});
const getStudentEnrolledClasses = (user_pk) => __awaiter(void 0, void 0, void 0, function* () {
    const con = yield DatabaseConfig_1.DatabaseConnection();
    try {
        yield con.BeginTransaction();
        const data = yield con.Query(`SELECT c.class_pk,c.class_desc,c.course_desc,c.start_time, c.end_time,t.picture tutor_pic, c.tutor_name,
      IF((SELECT COUNT(*) FROM class_sessions WHERE sts_pk ='s' AND class_pk = c.class_pk ) > 0 , TRUE, FALSE) is_ongoing
      FROM classes c
      LEFT JOIN tutors t ON c.tutor_pk = c.tutor_pk
      LEFT JOIN class_students cs ON cs.class_pk = c.class_pk
      WHERE cs.student_pk =(SELECT student_pk FROM students WHERE user_id='${user_pk}' LIMIT 1) 
      GROUP BY c.class_pk`, null);
        for (const t of data) {
            t.tutor_pic = yield useFileUploader_1.GetUploadedImage(t.tutor_pic);
            t.course_pic = yield useFileUploader_1.GetUploadedImage(t.course_pic);
        }
        con.Commit();
        return {
            success: true,
            data: data,
        };
    }
    catch (error) {
        yield con.Rollback();
        console.error(`error`, error);
        return {
            success: false,
            message: useErrorMessage_1.ErrorMessage(error),
        };
    }
});
exports.default = {
    addClass,
    updateClass,
    getClassDataTable,
    getSingleClass,
    getTutorClassTable,
    approveClass,
    getStudentUnenrolledClassTable,
    getStudentEnrolledClasses,
};
//# sourceMappingURL=ClassRepository.js.map