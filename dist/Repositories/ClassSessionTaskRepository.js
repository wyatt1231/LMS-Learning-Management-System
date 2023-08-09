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
const addClassTask = (payload, file) => __awaiter(void 0, void 0, void 0, function* () {
    const con = yield (0, DatabaseConfig_1.DatabaseConnection)();
    try {
        yield con.BeginTransaction();
        console.log(`payload.due_date`, payload.questions);
        payload.due_date = (0, useDateParser_1.parseInvalidDateTimeToDefault)(payload.due_date);
        // let file_res: any = null;
        // if (!!file) {
        //   file_res = await UploadFile("src/Storage/Files/Tasks/", file);
        //   if (!file_res.success) {
        //     con.Rollback();
        //     return file_res;
        //   }
        // }
        // payload = {
        //   ...payload,
        //   file_location: file_res?.data,
        // };
        const sql_add_task = yield con.Insert(`INSERT INTO class_tasks SET
        class_pk=@class_pk,
        task_title=@task_title,
        task_desc=@task_desc,
        due_date=@due_date,
        file_location=@file_location,
        encoder_pk=@encoder_pk;`, Object.assign(Object.assign({}, payload), { file_location: null }));
        if (sql_add_task.affectedRows > 0) {
            for (const ques of payload === null || payload === void 0 ? void 0 : payload.questions) {
                const params = Object.assign(Object.assign({}, ques), { class_task_pk: sql_add_task.insertedId });
                console.log(`ques`, ques);
                const sql_add_ques = yield con.Insert(`INSERT INTO class_task_ques SET
          class_task_pk=@class_task_pk,
          question=@question,
          cor_answer=@cor_answer,
          pnt=@pnt;`, params);
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
const updateClassTask = (payload, file) => __awaiter(void 0, void 0, void 0, function* () {
    const con = yield (0, DatabaseConfig_1.DatabaseConnection)();
    try {
        yield con.BeginTransaction();
        payload.due_date = (0, useDateParser_1.parseInvalidDateTimeToDefault)(payload.due_date);
        const file_res = yield (0, useFileUploader_1.UploadFile)("src/Storage/Files/Tasks/", file);
        if (!file_res.success) {
            con.Rollback();
            return file_res;
        }
        payload = Object.assign(Object.assign({}, payload), { file_location: file_res.data });
        const sql_update_task = yield con.Modify(`UPDATE  class_tasks SET
            task_title=@task_title,
            task_desc=@task_desc,
            file_location=@file_location,
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
const addClassTaskQues = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const con = yield (0, DatabaseConfig_1.DatabaseConnection)();
    try {
        yield con.BeginTransaction();
        const sql_add_task = yield con.Modify(`INSERT class_task_ques SET
       class_task_pk=@class_task_pk,
       question=@question,
       cor_answer=@cor_answer,
       pnt=@pnt;
       `, payload);
        if (sql_add_task > 0) {
            con.Commit();
            return {
                success: true,
                message: `The task has been added successfully.`,
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
const getAllClassTaskSub = (class_task_pk, user_pk) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const con = yield (0, DatabaseConfig_1.DatabaseConnection)();
    try {
        yield con.BeginTransaction();
        const data = yield con.Query(`
        SELECT question, pnt, task_ques_pk, class_task_pk FROM class_task_ques  WHERE class_task_pk = @class_task_pk;
          `, {
            class_task_pk: class_task_pk,
        });
        let entity = [];
        if ((data === null || data === void 0 ? void 0 : data.length) > 0) {
            for (let sub of data) {
                const fileSub = yield con.QuerySingle(`SELECT * FROM class_task_sub_file WHERE class_task_pk=@class_task_pk limit 1`, {
                    class_task_pk: sub.class_task_pk,
                });
                const studentSubmit = yield con.QuerySingle(`SELECT task_sub_pk,task_ques_pk,student_pk,answered_at,is_correct, answer, tutor_comment FROM class_task_sub WHERE task_ques_pk = @task_ques_pk AND student_pk=(SELECT student_pk FROM students WHERE user_id=@user_pk LIMIT 1) LIMIT 1`, {
                    task_ques_pk: sub.task_ques_pk,
                    user_pk: user_pk,
                });
                entity.push(Object.assign(Object.assign({}, sub), { task_sub_pk: studentSubmit === null || studentSubmit === void 0 ? void 0 : studentSubmit.task_sub_pk, student_pk: studentSubmit === null || studentSubmit === void 0 ? void 0 : studentSubmit.student_pk, answered_at: studentSubmit === null || studentSubmit === void 0 ? void 0 : studentSubmit.answered_at, answer: studentSubmit === null || studentSubmit === void 0 ? void 0 : studentSubmit.answer, is_correct: studentSubmit === null || studentSubmit === void 0 ? void 0 : studentSubmit.is_correct, tutor_comment: (_a = studentSubmit === null || studentSubmit === void 0 ? void 0 : studentSubmit.tutor_comment) !== null && _a !== void 0 ? _a : ``, stu_ans_file_loc: fileSub === null || fileSub === void 0 ? void 0 : fileSub.stu_ans_file_loc, tut_file_loc: fileSub === null || fileSub === void 0 ? void 0 : fileSub.tut_file_loc }));
                // console.log(`getAllClassTaskSub sub ${class_task_pk}`, sub);
            }
        }
        else {
            const fileSub = yield con.QuerySingle(`SELECT * FROM class_task_sub_file WHERE class_task_pk=@class_task_pk limit 1`, {
                class_task_pk: class_task_pk,
            });
            entity.push({
                stu_ans_file_loc: fileSub === null || fileSub === void 0 ? void 0 : fileSub.stu_ans_file_loc,
                tut_file_loc: fileSub === null || fileSub === void 0 ? void 0 : fileSub.tut_file_loc,
            });
        }
        con.Commit();
        return {
            success: true,
            data: entity,
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
      SELECT s.*,q.class_task_pk FROM class_task_sub s  JOIN class_task_ques q
      ON s.task_ques_pk = q.task_ques_pk WHERE q.class_task_pk =@class_task_pk GROUP BY q.class_task_pk,s.student_pk;
          `, {
            class_task_pk: class_task_pk,
        });
        // console.log(`getAllStudentsSubmit`, getAllStudentsSubmit);
        if ((task_sub === null || task_sub === void 0 ? void 0 : task_sub.length) > 0) {
            for (let sub of task_sub) {
                const fileSub = yield con.QuerySingle(`SELECT * FROM class_task_sub_file WHERE class_task_pk=@class_task_pk AND student_pk=@student_pk limit 1 `, {
                    class_task_pk: class_task_pk,
                    student_pk: sub.student_pk,
                });
                const student = yield con.QuerySingle(`SELECT * FROM students WHERE student_pk=@student_pk limit 1`, {
                    student_pk: sub.student_pk,
                });
                student.picture = yield (0, useFileUploader_1.GetUploadedImage)(student.picture);
                sub.student = student;
                console.log(`class_task_pk`, class_task_pk);
                sub.questions = yield con.Query(`SELECT s.*,q.cor_answer,q.question,q.pnt FROM class_task_sub s  JOIN class_task_ques q
          ON s.task_ques_pk = q.task_ques_pk WHERE q.class_task_pk=@class_task_pk AND s.student_pk=@student_pk ;`, {
                    class_task_pk: class_task_pk,
                    student_pk: sub.student_pk,
                    // task_ques_pk: sub.task_ques_pk,
                });
                sub.stu_ans_file_loc = fileSub === null || fileSub === void 0 ? void 0 : fileSub.stu_ans_file_loc;
                sub.tut_file_loc = fileSub === null || fileSub === void 0 ? void 0 : fileSub.tut_file_loc;
            }
        }
        else {
            const fileSub = yield con.Query(`SELECT * FROM class_task_sub_file WHERE class_task_pk=@class_task_pk limit 1 `, {
                class_task_pk: class_task_pk,
            });
            const task_subs = [];
            for (const sub of fileSub) {
                console.log(`sub`, sub);
                const student = yield con.QuerySingle(`SELECT * FROM students WHERE student_pk=@student_pk limit 1`, {
                    student_pk: sub.student_pk,
                });
                student.picture = yield (0, useFileUploader_1.GetUploadedImage)(student.picture);
                task_subs.push({
                    student: student,
                    class_task_pk: sub.class_task_pk,
                    stu_ans_file_loc: sub === null || sub === void 0 ? void 0 : sub.stu_ans_file_loc,
                    tut_file_loc: sub === null || sub === void 0 ? void 0 : sub.tut_file_loc,
                    answered_at: new Date(),
                });
            }
            con.Commit();
            return {
                success: true,
                data: task_subs,
            };
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
    var _b, _c;
    const con = yield (0, DatabaseConfig_1.DatabaseConnection)();
    try {
        yield con.BeginTransaction();
        for (const sub of payload) {
            console.log(`update task sub`, sub);
            const sql_update_sub = yield con.Modify(`  UPDATE class_task_sub  SET
        is_correct = @is_correct,
        tutor_comment = @tutor_comment
        WHERE task_sub_pk=@task_sub_pk ;
              `, {
                task_sub_pk: sub.task_sub_pk,
                is_correct: (_b = sub === null || sub === void 0 ? void 0 : sub.is_correct) !== null && _b !== void 0 ? _b : "n",
                tutor_comment: (_c = sub === null || sub === void 0 ? void 0 : sub.tutor_comment) !== null && _c !== void 0 ? _c : ``,
            });
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
const addClassTaskSub = (payload, user_pk) => __awaiter(void 0, void 0, void 0, function* () {
    const con = yield (0, DatabaseConfig_1.DatabaseConnection)();
    try {
        yield con.BeginTransaction();
        // const sudent_result = await con.QuerySingle(
        //   `SELECT student_pk FROM students WHERE user_id=@user_id limit 1`,
        //   {
        //     user_id: user_id,
        //   }
        // );
        for (const sub of payload) {
            sub.user_pk = user_pk;
            const existingSub = yield con.QuerySingle(`SELECT COUNT(*) as total FROM class_task_sub WHERE task_ques_pk=@task_ques_pk AND student_pk=(SELECT student_pk FROM students WHERE user_id=@user_pk LIMIT 1) limit 1`, {
                task_ques_pk: sub === null || sub === void 0 ? void 0 : sub.task_ques_pk,
                user_pk: sub === null || sub === void 0 ? void 0 : sub.user_pk,
            });
            console.log(`sub`, sub, existingSub);
            if ((existingSub === null || existingSub === void 0 ? void 0 : existingSub.total) > 0) {
                const sql_update_sub = yield con.Modify(`UPDATE class_task_sub SET
                student_pk=(SELECT student_pk FROM students WHERE user_id=@user_pk LIMIT 1),
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
                student_pk=(SELECT student_pk FROM students WHERE user_id=@user_pk LIMIT 1),
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
const addClassTaskFileSub = (payload, student_pk, file) => __awaiter(void 0, void 0, void 0, function* () {
    const con = yield (0, DatabaseConfig_1.DatabaseConnection)();
    try {
        yield con.BeginTransaction();
        const file_res = yield (0, useFileUploader_1.UploadFile)("src/Storage/Files/Materials/", file);
        if (!file_res.success) {
            con.Rollback();
            return file_res;
        }
        payload = Object.assign(Object.assign({}, payload), { student_pk: student_pk, tut_file_loc: ``, stu_ans_file_loc: `` });
        if (payload.submit_type == `tutor`) {
            payload.tut_file_loc = file_res.data;
        }
        else {
            payload.stu_ans_file_loc = file_res.data;
        }
        console.log(`payload addClassTaskFileSub`, payload);
        // payload = {
        //   ...payload,
        //   student_pk: student_pk,
        // };
        var existingRecord = yield con.QuerySingle(`SELECT * from class_task_sub_file where class_task_pk=@class_task_pk limit 1;`, {
            class_task_pk: payload.class_task_pk,
        });
        if (existingRecord == null) {
            if (payload.submit_type == `tutor`) {
                yield con.Insert(`INSERT INTO class_task_sub_file SET
                student_pk=(SELECT student_pk FROM students WHERE user_id=@student_pk LIMIT 1),
                class_task_pk=@class_task_pk,
                tut_file_loc=@tut_file_loc;`, payload);
            }
            else {
                yield con.Insert(`INSERT INTO class_task_sub_file SET
                student_pk=(SELECT student_pk FROM students WHERE user_id=@student_pk LIMIT 1),
                class_task_pk=@class_task_pk,
                stu_ans_file_loc=@stu_ans_file_loc;`, payload);
            }
        }
        else {
            if (payload.submit_type == `tutor`) {
                yield con.Modify(`UPDATE class_task_sub_file SET
                tut_file_loc=@tut_file_loc
                WHERE class_task_pk=@class_task_pk ;`, payload);
            }
            else {
                yield con.Modify(`UPDATE class_task_sub_file SET
                student_pk=(SELECT student_pk FROM students WHERE user_id=@student_pk LIMIT 1),
                stu_ans_file_loc=@stu_ans_file_loc
                WHERE class_task_pk=@class_task_pk ;`, payload);
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
    addClassTaskFileSub,
    addClassTaskQues,
};
//# sourceMappingURL=ClassSessionTaskRepository.js.map