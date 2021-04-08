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
const useErrorMessage_1 = require("../Hooks/useErrorMessage");
const useFileUploader_1 = require("../Hooks/useFileUploader");
const getTblClassSessions = (class_pk) => __awaiter(void 0, void 0, void 0, function* () {
    const con = yield DatabaseConfig_1.DatabaseConnection();
    try {
        yield con.BeginTransaction();
        const data = yield con.Query(`
      SELECT cs.*,sm.sts_desc,sm.sts_color,sm.sts_bgcolor FROM class_sessions  cs
      LEFT JOIN status_master sm ON cs.sts_pk=sm.sts_pk
      where cs.class_pk = @class_pk`, {
            class_pk: class_pk,
        });
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
const getSingleClassSession = (session_pk, user_pk, user_type) => __awaiter(void 0, void 0, void 0, function* () {
    const con = yield DatabaseConfig_1.DatabaseConnection();
    try {
        yield con.BeginTransaction();
        if (user_type === "student") {
            const count_student_session = yield con.QuerySingle(`
      SELECT COUNT(*) AS total FROM class_students cs 
      JOIN class_sessions s ON s.class_pk = cs.class_pk
      WHERE cs.student_pk = (SELECT student_pk FROM students WHERE user_id =@user_pk) AND s.session_pk = @session_pk

      `, {
                user_pk: user_pk,
                session_pk: session_pk,
            });
            if ((count_student_session === null || count_student_session === void 0 ? void 0 : count_student_session.total) <= 0) {
                yield con.Rollback();
                return {
                    success: false,
                    message: "You cannot participate a class session that you have not enrolled yet.",
                };
            }
        }
        else if (user_type === "tutor") {
            const count_tutor_session = yield con.QuerySingle(`
        SELECT COUNT(*) FROM class_sessions cs
        JOIN classes c ON cs.class_pk = c.class_pk    
             WHERE cs.session_pk = @session_pk AND c.tutor_pk = (SELECT tutor_pk FROM tutors WHERE user_id = @user_pk); 
         
      `, {
                user_pk: user_pk,
                session_pk: session_pk,
            });
            if ((count_tutor_session === null || count_tutor_session === void 0 ? void 0 : count_tutor_session.total) <= 0) {
                yield con.Rollback();
                return {
                    success: false,
                    message: "You cannot enter a class session that you are not assigned to.",
                };
            }
        }
        const data = yield con.QuerySingle(`SELECT s.*,md5(session_pk) hash_pk, c.class_desc,c.course_desc FROM class_sessions s JOIN classes c
       ON s.class_pk = c.class_pk WHERE s.session_pk=@session_pk;`, {
            session_pk: session_pk,
        });
        data.status_info = yield con.QuerySingle(`select * from status_master where sts_pk=@sts_pk`, {
            sts_pk: data.sts_pk,
        });
        data.class_info = yield con.QuerySingle(`
      select * from classes where class_pk = @class_pk;
    `, { class_pk: data.class_pk });
        data.class_info.course_info = yield con.QuerySingle(`
      select * from courses where course_pk = @course_pk;
    `, {
            course_pk: data.class_info.course_pk,
        });
        data.class_info.course_info.picture = yield useFileUploader_1.GetUploadedImage(data.class_info.course_info.picture);
        if (data.tutor_pk) {
            data.class_info.tutor_info = yield con.QuerySingle(`
        select * from tutors where tutor_pk = @tutor_pk;
      `, {
                tutor_pk: data.tutor_pk,
            });
            data.class_info.tutor_info.picture = yield useFileUploader_1.GetUploadedImage(data.class_info.tutor_info.picture);
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
const getTutorClassSessionCalendar = (payload, user_id) => __awaiter(void 0, void 0, void 0, function* () {
    const con = yield DatabaseConfig_1.DatabaseConnection();
    try {
        yield con.BeginTransaction();
        const data = yield con.Query(`SELECT * FROM 
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
      `, Object.assign(Object.assign({}, payload), { user_pk: user_id }));
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
const getStatsSessionCalendar = (user_pk) => __awaiter(void 0, void 0, void 0, function* () {
    const con = yield DatabaseConfig_1.DatabaseConnection();
    try {
        yield con.BeginTransaction();
        const { for_approval } = yield con.QuerySingle(`
      SELECT COUNT(*) AS 'for_approval' FROM class_sessions cs 
      LEFT JOIN classes c ON cs.class_pk = c.class_pk
      WHERE c.tutor_pk=getTutorPK(@user_pk) AND cs.sts_pk = @sts_pk and YEAR(cs.start_date) = YEAR(NOW());
      `, {
            user_pk: user_pk,
            sts_pk: "fa",
        });
        const { approved } = yield con.QuerySingle(`
      SELECT COUNT(*) AS 'approved' FROM class_sessions cs 
      LEFT JOIN classes c ON cs.class_pk = c.class_pk
      WHERE c.tutor_pk=getTutorPK(@user_pk) AND cs.sts_pk = @sts_pk and YEAR(cs.start_date) = YEAR(NOW());
      `, {
            user_pk: user_pk,
            sts_pk: "a",
        });
        const { started } = yield con.QuerySingle(`
      SELECT COUNT(*) AS 'started' FROM class_sessions cs 
      LEFT JOIN classes c ON cs.class_pk = c.class_pk
      WHERE c.tutor_pk=getTutorPK(@user_pk) AND cs.sts_pk = @sts_pk and YEAR(cs.start_date) = YEAR(NOW());
      `, {
            user_pk: user_pk,
            sts_pk: "e",
        });
        const { closed } = yield con.QuerySingle(`
      SELECT COUNT(*) AS 'closed' FROM class_sessions cs 
      LEFT JOIN classes c ON cs.class_pk = c.class_pk
      WHERE c.tutor_pk=getTutorPK(@user_pk) AND cs.sts_pk = @sts_pk and YEAR(cs.start_date) = YEAR(NOW());
      `, {
            user_pk: user_pk,
            sts_pk: "c",
        });
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
const getTutorFutureSessions = (tutor_pk) => __awaiter(void 0, void 0, void 0, function* () {
    const con = yield DatabaseConfig_1.DatabaseConnection();
    try {
        yield con.BeginTransaction();
        const data = yield con.Query(`
      SELECT cs.start_date, cs.start_time,cs.end_time FROM class_sessions cs
      INNER JOIN classes c
      ON c.class_pk = cs.class_pk
      WHERE c.tutor_pk =@tutor_pk
      AND cs.start_date >= DATE(NOW());
      `, {
            tutor_pk: tutor_pk,
        });
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
//update queries
const startClassSession = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const con = yield DatabaseConfig_1.DatabaseConnection();
    try {
        yield con.BeginTransaction();
        const sts_pk = yield con.QuerySingle(`SELECT sts_pk from class_sessions where session_pk=@session_pk;`, payload);
        if (sts_pk.sts_pk !== "p") {
            con.Commit();
            return {
                success: false,
                message: "Only sessions that are currenly 'PENDING' can be marked as STARTED.",
            };
        }
        const sql_update_session = yield con.Modify(`UPDATE class_sessions set sts_pk='s',began=NOW(),remarks=@remarks  where session_pk=@session_pk`, payload);
        if (sql_update_session > 0) {
            const audit_log = yield con.Insert(`insert into audit_log set 
        user_pk=@user_pk,
        activity=CONCAT('set the class session of ',(select class_desc from classes where class_pk=@class_pk limit 1),' to STARTED ');
        `, {
                user_pk: payload.encoder_pk,
                class_pk: payload.class_pk,
            });
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
                message: `The class has been marked as 'STARTED'!`,
            };
        }
        else {
            con.Rollback();
            return {
                success: false,
                message: `There were no affected rows when trying to start the class session!`,
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
const endClassSession = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const con = yield DatabaseConfig_1.DatabaseConnection();
    try {
        yield con.BeginTransaction();
        const session_sts_pk = yield con.QuerySingle(`SELECT sts_pk from class_sessions where session_pk=@session_pk;`, {
            session_pk: payload.session_pk,
        });
        if (session_sts_pk.sts_pk !== "s") {
            con.Rollback();
            return {
                success: false,
                message: "Only sessions that are currently marked as 'STARTED' can be marked as 'ENDED'",
            };
        }
        const sql_update_session = yield con.Modify(`UPDATE class_sessions set sts_pk='e',ended=NOW(),remarks=@remarks  where session_pk=@session_pk`, payload);
        if (sql_update_session > 0) {
            const audit_log = yield con.Insert(`insert into audit_log set 
        user_pk=@user_pk,
        activity=CONCAT('marked the class session ',(select class_desc from classes where class_pk=@class_pk limit 1),' to ENDED ');
        `, {
                user_pk: payload.encoder_pk,
                class_pk: payload.class_pk,
            });
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
                message: `The class has been marked as ended!`,
            };
        }
        else {
            con.Rollback();
            return {
                success: false,
                message: "Only sessions that are marked as 'STARTED' can be updated to 'ENDED'",
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
const unattendedClassSession = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const con = yield DatabaseConfig_1.DatabaseConnection();
    try {
        yield con.BeginTransaction();
        const session_sts_pk = yield con.QuerySingle(`SELECT sts_pk from class_sessions where session_pk=@session_pk;`, {
            session_pk: payload.session_pk,
        });
        if (session_sts_pk.sts_pk !== "p") {
            con.Rollback();
            return {
                success: false,
                message: "Only sessions that are marked as 'PENDING' can be updated to 'UNATTENDED'",
            };
        }
        const sql_update_session = yield con.Modify(`UPDATE class_sessions set sts_pk='u',remarks=@remarks  where session_pk=@session_pk`, payload);
        if (sql_update_session > 0) {
            const audit_log = yield con.Insert(`insert into audit_log set 
        user_pk=@user_pk,
        activity=CONCAT('marked the class session ',(select class_desc from classes where class_pk=@class_pk limit 1),' to UNATTENDED ');
        `, {
                user_pk: payload.encoder_pk,
                class_pk: payload.class_pk,
            });
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
                message: `The class has been marked as unattended!`,
            };
        }
        else {
            con.Rollback();
            return {
                success: false,
                message: `There were no affected rows when trying to end the class session!`,
            };
        }
    }
    catch (error) {
        yield con.Rollback();
        return {
            success: false,
            message: useErrorMessage_1.ErrorMessage(error),
        };
    }
});
//sendMessage
//hideMessage
//getAllMessage
const getAllMessage = (session_pk) => __awaiter(void 0, void 0, void 0, function* () {
    const con = yield DatabaseConfig_1.DatabaseConnection();
    try {
        yield con.BeginTransaction();
        const chat_room_msgs = yield con.Query(`SELECT m.*, u.fullname, u.picture FROM class_ses_msg m
       LEFT JOIN vw_user_info u on u.user_id = m.user_pk
       WHERE m.session_pk=@session_pk
       `, { session_pk: session_pk });
        for (const msg of chat_room_msgs) {
            msg.picture = yield useFileUploader_1.GetUploadedImage(msg.picture);
        }
        con.Commit();
        return {
            success: true,
            data: chat_room_msgs,
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
const saveMessage = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const con = yield DatabaseConfig_1.DatabaseConnection();
    try {
        yield con.BeginTransaction();
        const sql_save_msg = yield con.Modify(`INSERT INTO class_ses_msg SET
       session_pk=@session_pk,
       msg_body=@msg_body,
       user_pk=@user_pk,
       shown='y';
       `, payload);
        if (sql_save_msg > 0) {
            con.Commit();
            return {
                success: true,
                message: `Your message has been sent`,
            };
        }
        else {
            con.Rollback();
            return {
                success: false,
                message: `There were no affected rows in the process!`,
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
const hideMessage = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const con = yield DatabaseConfig_1.DatabaseConnection();
    try {
        yield con.BeginTransaction();
        const sql_hide_msg = yield con.Modify(`UPDATE class_ses_msg SET
       shown='n'
       WHERE ses_msg_pk=@ses_msg_pk
       `, payload);
        if (sql_hide_msg > 0) {
            con.Commit();
            return {
                success: true,
                message: `The message is now hidden!`,
            };
        }
        else {
            con.Rollback();
            return {
                success: false,
                message: `There were no affected rows in the process!`,
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
const getTutorSessionCal = (tutor_pk) => __awaiter(void 0, void 0, void 0, function* () {
    const con = yield DatabaseConfig_1.DatabaseConnection();
    try {
        yield con.BeginTransaction();
        const data = yield con.Query(`
      SELECT cs.session_pk id,
      CONCAT(cs.start_date,' ',cs.start_time) AS 'start',
      CONCAT(cs.start_date,' ',cs.end_time) AS 'end',
      c.class_desc 'title',
      sm.sts_bgcolor AS 'backgroundColor',
      sm.sts_color AS  'textColor',
      sm.sts_desc AS 'status',
      sm.sts_pk 
      FROM classes c 
      JOIN class_sessions cs ON c.class_pk = cs.class_pk 
      JOIN status_master sm ON cs.sts_pk = sm.sts_pk
      WHERE c.tutor_pk =@tutor_pk;
      `, {
            tutor_pk,
        });
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
const getStudentSessionCal = (student_pk) => __awaiter(void 0, void 0, void 0, function* () {
    const con = yield DatabaseConfig_1.DatabaseConnection();
    try {
        yield con.BeginTransaction();
        const data = yield con.Query(`
      SELECT  cs.session_pk id,
      CONCAT(cs.start_date,' ',cs.start_time) AS 'start',
      CONCAT(cs.start_date,' ',cs.end_time) AS 'end',
      c.class_desc 'title',
      sm.sts_bgcolor AS 'backgroundColor',
      sm.sts_color AS  'textColor',
      sm.sts_desc AS 'status',
      sm.sts_pk 
      FROM classes c 
      JOIN class_sessions cs ON c.class_pk = cs.class_pk 
      JOIN status_master sm ON cs.sts_pk = sm.sts_pk
      JOIN class_students s ON s.class_pk =  c.class_pk
      WHERE s.student_pk =@student_pk GROUP BY cs.session_pk;
      `, {
            student_pk,
        });
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
const getLoggedInTutorSessionCalendar = (user_pk) => __awaiter(void 0, void 0, void 0, function* () {
    const con = yield DatabaseConfig_1.DatabaseConnection();
    try {
        yield con.BeginTransaction();
        const data = yield con.Query(`
      SELECT cs.session_pk id,
      CONCAT(cs.start_date,' ',cs.start_time) AS 'start',
      CONCAT(cs.start_date,' ',cs.end_time) AS 'end',
      c.class_desc 'title',
      sm.sts_bgcolor AS 'backgroundColor',
      sm.sts_color AS  'textColor',
      sm.sts_desc AS 'status',
      sm.sts_pk 
      FROM classes c 
      JOIN class_sessions cs ON c.class_pk = cs.class_pk 
      JOIN status_master sm ON cs.sts_pk = sm.sts_pk
      WHERE c.tutor_pk =(SELECT tutor_pk FROM tutors WHERE user_id = @user_pk limit 1);
      `, {
            user_pk,
        });
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
const getLoggedStudentCalendar = (user_pk) => __awaiter(void 0, void 0, void 0, function* () {
    const con = yield DatabaseConfig_1.DatabaseConnection();
    try {
        yield con.BeginTransaction();
        const data = yield con.Query(`
      SELECT cs.session_pk id,
      CONCAT(cs.start_date,' ',cs.start_time) AS 'start',
      CONCAT(cs.start_date,' ',cs.end_time) AS 'end',
      c.class_desc 'title',
      sm.sts_bgcolor AS 'backgroundColor',
      sm.sts_color AS  'textColor',
      sm.sts_desc AS 'status',
      sm.sts_pk 
      FROM classes c 
      JOIN class_sessions cs ON c.class_pk = cs.class_pk 
      JOIN status_master sm ON cs.sts_pk = sm.sts_pk  
      JOIN class_students cst ON cst.class_pk = c.class_pk
      JOIN students s ON s.student_pk = cst.student_pk 
      WHERE s.user_id =@user_pk
      GROUP BY cs.session_pk;
      `, {
            user_pk,
        });
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
//getStudentSessionCall
exports.default = {
    getTblClassSessions,
    getTutorFutureSessions,
    getTutorClassSessionCalendar,
    getStatsSessionCalendar,
    startClassSession,
    endClassSession,
    unattendedClassSession,
    getAllMessage,
    saveMessage,
    hideMessage,
    getSingleClassSession,
    getTutorSessionCal,
    getStudentSessionCal,
    getLoggedInTutorSessionCalendar,
    getLoggedStudentCalendar,
};
//# sourceMappingURL=ClassSessionRepository.js.map