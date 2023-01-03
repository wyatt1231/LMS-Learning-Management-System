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
const getAllClassTask = (class_pk) => __awaiter(void 0, void 0, void 0, function* () {
    const con = yield (0, DatabaseConfig_1.DatabaseConnection)();
    try {
        yield con.BeginTransaction();
        const tasks = yield con.Query(`
      SELECT * FROM class_tasks where class_pk=@class_pk
      `, {
            class_pk: class_pk,
        });
        for (const task of tasks) {
            task.status_dtls = yield con.QuerySingle(`SELECT * from status_master where sts_pk=@sts_pk limit 1;`, {
                sts_pk: task.sts_pk,
            });
        }
        con.Commit();
        return {
            success: true,
            data: tasks,
        };
    }
    catch (error) {
        yield con.Rollback();
        console.error(`error`, error);
        return {
            success: false,
            message: (0, useErrorMessage_1.ErrorMessage)(error),
        };
    }
});
const getSingleClassTask = (class_task_pk) => __awaiter(void 0, void 0, void 0, function* () {
    const con = yield (0, DatabaseConfig_1.DatabaseConnection)();
    try {
        yield con.BeginTransaction();
        const data = yield con.QuerySingle(`
        SELECT * FROM class_tasks where class_task_pk=@class_task_pk
        `, {
            class_task_pk: class_task_pk,
        });
        data.status_dtls = yield con.QuerySingle(`SELECT * from status_master where sts_pk=@sts_pk limit 1;`, {
            sts_pk: data.sts_pk,
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
            message: (0, useErrorMessage_1.ErrorMessage)(error),
        };
    }
});
const addClassTask = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const con = yield (0, DatabaseConfig_1.DatabaseConnection)();
    try {
        yield con.BeginTransaction();
        payload.due_date = (0, useDateParser_1.parseInvalidDateTimeToDefault)(payload.due_date);
        const sql_add_task = yield con.Insert(`INSERT INTO class_tasks SET
        class_pk=@class_pk,
        task_title=@task_title,
        task_desc=@task_desc,
        due_date=@due_date,
        encoder_pk=@encoder_pk;`, payload);
        if (sql_add_task.affectedRows > 0) {
            for (const ques of payload.questions) {
                ques.class_task_pk = sql_add_task.insertedId;
                const sql_add_ques = yield con.Insert(`INSERT INTO class_task_ques SET
          class_task_pk=@class_task_pk,
          question=@question,
          cor_answer=@cor_answer,
          pnt=@pnt;`, ques);
                if (sql_add_ques.affectedRows <= 0) {
                    con.Rollback();
                    return {
                        success: false,
                        message: `There were no affected rows in the process!`,
                    };
                }
            }
            con.Commit();
            return {
                success: true,
                message: `The task has been created successfully.`,
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
            message: (0, useErrorMessage_1.ErrorMessage)(error),
        };
    }
});
const updateClassTask = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const con = yield (0, DatabaseConfig_1.DatabaseConnection)();
    try {
        yield con.BeginTransaction();
        payload.due_date = (0, useDateParser_1.parseInvalidDateTimeToDefault)(payload.due_date);
        console.log(`payload`, payload);
        const sql_update_task = yield con.Modify(`UPDATE  class_tasks SET
            task_title=@task_title,
            task_desc=@task_desc,
            due_date=@due_date
            WHERE class_task_pk=@class_task_pk;`, payload);
        if (sql_update_task > 0) {
            con.Commit();
            return {
                success: true,
                message: `The task has been updated successfully.`,
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
            message: (0, useErrorMessage_1.ErrorMessage)(error),
        };
    }
});
const toggleSubmitClassTask = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const con = yield (0, DatabaseConfig_1.DatabaseConnection)();
    try {
        yield con.BeginTransaction();
        const sql_update_task = yield con.Modify(`UPDATE  class_tasks SET
            allow_submit=@allow_submit
            WHERE class_task_pk=@class_task_pk;`, payload);
        if (sql_update_task > 0) {
            con.Commit();
            return {
                success: true,
                message: `The task has been updated successfully.`,
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
            message: (0, useErrorMessage_1.ErrorMessage)(error),
        };
    }
});
const changeStatusClassTask = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const con = yield (0, DatabaseConfig_1.DatabaseConnection)();
    try {
        yield con.BeginTransaction();
        const sql_update_task = yield con.Modify(`UPDATE  class_tasks SET
       sts_pk=@sts_pk
       WHERE class_task_pk=@class_task_pk;`, payload);
        if (sql_update_task > 0) {
            con.Commit();
            return {
                success: true,
                message: `The task has started.`,
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
            message: (0, useErrorMessage_1.ErrorMessage)(error),
        };
    }
});
//Class questions
const getAllClassTaskQues = (class_task_pk) => __awaiter(void 0, void 0, void 0, function* () {
    const con = yield (0, DatabaseConfig_1.DatabaseConnection)();
    try {
        yield con.BeginTransaction();
        const data = yield con.Query(`
        SELECT * FROM class_task_ques WHERE class_task_pk=@class_task_pk
        `, {
            class_task_pk: class_task_pk,
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
            message: (0, useErrorMessage_1.ErrorMessage)(error),
        };
    }
});
const getSingleClassTaskQues = (task_ques_pk) => __awaiter(void 0, void 0, void 0, function* () {
    const con = yield (0, DatabaseConfig_1.DatabaseConnection)();
    try {
        yield con.BeginTransaction();
        const data = yield con.Query(`
          SELECT * FROM class_task_ques WHERE task_ques_pk=@task_ques_pk
          `, {
            task_ques_pk: task_ques_pk,
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
            message: (0, useErrorMessage_1.ErrorMessage)(error),
        };
    }
});
const updateClassTaskQues = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const con = yield (0, DatabaseConfig_1.DatabaseConnection)();
    try {
        yield con.BeginTransaction();
        const sql_update_task = yield con.Modify(`UPDATE  class_task_ques SET
       question=@question,
       cor_answer=@cor_answer,
       pnt=@pnt
       WHERE task_ques_pk=@task_ques_pk;
       `, payload);
        if (sql_update_task > 0) {
            con.Commit();
            return {
                success: true,
                message: `The task has been updated successfully.`,
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
            message: (0, useErrorMessage_1.ErrorMessage)(error),
        };
    }
});
//class task submissions
const getAllClassTaskSub = (class_task_pk) => __awaiter(void 0, void 0, void 0, function* () {
    const con = yield (0, DatabaseConfig_1.DatabaseConnection)();
    try {
        yield con.BeginTransaction();
        const data = yield con.Query(`
        SELECT s.*, q.question,q.pnt,q.task_ques_pk,q.class_task_pk  FROM class_task_sub s RIGHT JOIN
        class_task_ques q ON s.task_ques_pk = q.task_ques_pk
        WHERE q.class_task_pk =@class_task_pk
          `, {
            class_task_pk: class_task_pk,
        });
        console.log(`data`, data);
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
            message: (0, useErrorMessage_1.ErrorMessage)(error),
        };
    }
});
const getAllStudentsSubmit = (class_task_pk) => __awaiter(void 0, void 0, void 0, function* () {
    const con = yield (0, DatabaseConfig_1.DatabaseConnection)();
    try {
        yield con.BeginTransaction();
        const task_sub = yield con.Query(`
      SELECT s.* FROM class_task_sub s  JOIN class_task_ques q
      ON s.task_ques_pk = q.task_ques_pk WHERE q.class_task_pk =@class_task_pk GROUP BY q.class_task_pk;
          `, {
            class_task_pk: class_task_pk,
        });
        for (const sub of task_sub) {
            console.log(`sub -> `, sub.task_ques_pk);
            const student = yield con.QuerySingle(`SELECT * FROM students WHERE student_pk=@student_pk limit 1`, {
                student_pk: sub.student_pk,
            });
            student.picture = yield (0, useFileUploader_1.GetUploadedImage)(student.picture);
            sub.student = student;
            sub.questions = yield con.Query(
            // `SELECT * FROM class_task_ques WHERE class_task_pk = @class_task_pk`,
            `SELECT s.*,q.cor_answer,q.question,q.pnt FROM class_task_sub s  JOIN class_task_ques q
        ON s.task_ques_pk = q.task_ques_pk WHERE q.class_task_pk=@class_task_pk;`, {
                class_task_pk: class_task_pk,
            });
        }
        con.Commit();
        return {
            success: true,
            data: task_sub,
        };
    }
    catch (error) {
        yield con.Rollback();
        console.error(`error`, error);
        return {
            success: false,
            message: (0, useErrorMessage_1.ErrorMessage)(error),
        };
    }
});
const updateTaskSub = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const con = yield (0, DatabaseConfig_1.DatabaseConnection)();
    try {
        yield con.BeginTransaction();
        for (const sub of payload) {
            const sql_update_sub = yield con.Modify(`  UPDATE class_task_sub  SET
        is_correct = @is_correct WHERE task_sub_pk=@task_sub_pk ;
              `, sub);
            if (sql_update_sub < 1) {
                con.Rollback();
                return {
                    success: true,
                    message: `Your work has been submitted successfully.`,
                };
            }
        }
        con.Commit();
        return {
            success: true,
            message: `Your work has been submitted successfully.`,
        };
    }
    catch (error) {
        yield con.Rollback();
        console.error(`error`, error);
        return {
            success: false,
            message: (0, useErrorMessage_1.ErrorMessage)(error),
        };
    }
});
const addClassTaskSub = (payload, student_pk) => __awaiter(void 0, void 0, void 0, function* () {
    const con = yield (0, DatabaseConfig_1.DatabaseConnection)();
    try {
        yield con.BeginTransaction();
        for (const sub of payload) {
            sub.student_pk = student_pk;
            if (sub.task_sub_pk) {
                const sql_update_sub = yield con.Modify(`UPDATE class_task_sub SET
                student_pk=(SELECT student_pk FROM students WHERE user_id=@student_pk LIMIT 1),
                task_ques_pk=@task_ques_pk,
                answer=@answer WHERE task_sub_pk = @task_sub_pk ;
                `, sub);
                if (sql_update_sub < 1) {
                    con.Rollback();
                    return {
                        success: true,
                        message: `Your work has been submitted successfully.`,
                    };
                }
            }
            else {
                const sql_add_sub = yield con.Insert(`INSERT INTO class_task_sub SET
                student_pk=(SELECT student_pk FROM students WHERE user_id=@student_pk LIMIT 1),
                task_ques_pk=@task_ques_pk,
                answer=@answer;
                ;`, sub);
                if (sql_add_sub.affectedRows < 1) {
                    con.Rollback();
                    return {
                        success: true,
                        message: `Your work has been submitted successfully.`,
                    };
                }
            }
        }
        con.Commit();
        return {
            success: true,
            message: `Your work has been submitted successfully.`,
        };
    }
    catch (error) {
        yield con.Rollback();
        console.error(`error`, error);
        return {
            success: false,
            message: (0, useErrorMessage_1.ErrorMessage)(error),
        };
    }
});
exports.default = {
    getAllClassTask,
    getSingleClassTask,
    addClassTask,
    updateClassTask,
    toggleSubmitClassTask,
    changeStatusClassTask,
    getAllClassTaskQues,
    getSingleClassTaskQues,
    updateClassTaskQues,
    getAllClassTaskSub,
    addClassTaskSub,
    getAllStudentsSubmit,
    updateTaskSub,
};
//# sourceMappingURL=ClassSessionTaskRepository.js.map