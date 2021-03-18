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
//Tutor actions
//select queries
const getTblClassStudents = (class_pk) => __awaiter(void 0, void 0, void 0, function* () {
    const con = yield DatabaseConfig_1.DatabaseConnection();
    try {
        yield con.BeginTransaction();
        const class_students = yield con.Query(`select * from class_students where class_pk = @class_pk`, {
            class_pk: class_pk,
        });
        for (const student of class_students) {
            student.student_details = yield con.QuerySingle(`
            SELECT * from students where student_pk=@student_pk;
          `, { student_pk: student.student_pk });
            student.student_details.picture = yield useFileUploader_1.GetUploadedImage(student.student_details.picture);
            student.status_details = yield con.QuerySingle(`
            SELECT * from status_master where sts_pk=@sts_pk;
          `, { sts_pk: student.sts_pk });
        }
        con.Commit();
        return {
            success: true,
            data: class_students,
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
//insert queries
const enrollClassStudent = (payload, user_id) => __awaiter(void 0, void 0, void 0, function* () {
    const con = yield DatabaseConfig_1.DatabaseConnection();
    try {
        yield con.BeginTransaction();
        payload.encoder_pk = parseInt(user_id);
        payload.sts_pk = "a";
        const sql_enroll_student = yield con.Insert(`
        INSERT INTO class_students 
        SET
        class_pk=@class_pk,
        student_pk=@student_pk,
        sts_pk=@sts_pk,
        encoder_pk=@encoder_pk;
        `, payload);
        if (sql_enroll_student.insertedId > 0) {
            con.Commit();
            return {
                success: true,
                message: "Has been added successfully",
            };
        }
        else {
            con.Rollback();
            return {
                success: false,
                message: "There were no rows affected during the process!",
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
const joinStudentToClass = (payload, user_pk) => __awaiter(void 0, void 0, void 0, function* () {
    const con = yield DatabaseConfig_1.DatabaseConnection();
    try {
        yield con.BeginTransaction();
        payload.encoder_pk = parseInt(user_pk);
        payload.sts_pk = "fa";
        const sql_enroll_student = yield con.Insert(`
        INSERT INTO class_students 
        SET
        class_pk=@class_pk,
        student_pk=(getStudentPK('${user_pk}')),
        sts_pk=@sts_pk,
        encoder_pk=@encoder_pk;
        `, payload);
        if (sql_enroll_student.insertedId > 0) {
            const sql_audit = yield con.Insert(`
          INSERT INTO class_log 
          SET
          remarks=CONCAT(getStudNameByUser('${user_pk}'),' has requested to join in your ',COALESCE(getClassDesc(@class_pk),''),' class' ),
          ref_table='class_students',
          ref_pk=${sql_enroll_student.insertedId},
          user_type='STUDENT',
          aud_by=@encoder_pk
          `, payload);
            if (sql_audit.affectedRows > 0) {
                con.Commit();
                return {
                    success: true,
                    message: "Has been added successfully",
                };
            }
            else {
                con.Rollback();
                return {
                    success: false,
                    message: "There were no rows affected when logging this process.!",
                };
            }
        }
        else {
            con.Rollback();
            return {
                success: false,
                message: "There were no rows affected during the process!",
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
//udpate queries
const blockClassStudent = (class_stud_pk) => __awaiter(void 0, void 0, void 0, function* () {
    const con = yield DatabaseConfig_1.DatabaseConnection();
    try {
        yield con.BeginTransaction();
        const sql_get_sts = yield con.QuerySingle(`
        SELECT sts_pk from class_students where class_stud_pk=@class_stud_pk limit 1;
        `, { class_stud_pk: class_stud_pk });
        if (sql_get_sts.sts_pk === "x") {
            con.Rollback();
            return {
                success: false,
                message: "The student is already in the block list.",
            };
        }
        const sql_enroll_student = yield con.Insert(`
        UPDATE class_students set sts_pk='x' where class_stud_pk=@class_stud_pk 
        `, { class_stud_pk: class_stud_pk });
        if (sql_enroll_student.insertedId > 0) {
            con.Commit();
            return {
                success: true,
                message: "The student has been blocked!",
            };
        }
        else {
            con.Rollback();
            return {
                success: false,
                message: "Something went wrong during the process, please try again or report this to the administrator!",
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
const reEnrollClassStudent = (class_stud_pk) => __awaiter(void 0, void 0, void 0, function* () {
    const con = yield DatabaseConfig_1.DatabaseConnection();
    try {
        yield con.BeginTransaction();
        const sql_get_sts = yield con.QuerySingle(`
        SELECT sts_pk from class_students where class_stud_pk=@class_stud_pk limit 1;
        `, { class_stud_pk: class_stud_pk });
        if (sql_get_sts.sts_pk === "a") {
            con.Rollback();
            return {
                success: false,
                message: "You cannot re-enroll this student.",
            };
        }
        const sql_enroll_student = yield con.Insert(`
        UPDATE class_students set sts_pk='a' where class_stud_pk=@class_stud_pk 
        `, { class_stud_pk: class_stud_pk });
        if (sql_enroll_student.insertedId > 0) {
            con.Commit();
            return {
                success: true,
                message: "The student has been re-enrolled!",
            };
        }
        else {
            con.Rollback();
            return {
                success: false,
                message: "Something went wrong during the process, please try again or report this to the administrator!",
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
exports.default = {
    getTblClassStudents,
    enrollClassStudent,
    blockClassStudent,
    reEnrollClassStudent,
    joinStudentToClass,
};
//# sourceMappingURL=ClassStudentRepository.js.map