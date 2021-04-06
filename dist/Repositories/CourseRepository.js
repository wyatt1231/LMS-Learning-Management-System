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
const useSearch_1 = require("../Hooks/useSearch");
const useValidator_1 = require("../Hooks/useValidator");
const addCourse = (payload, user_id) => __awaiter(void 0, void 0, void 0, function* () {
    const con = yield DatabaseConfig_1.DatabaseConnection();
    try {
        yield con.BeginTransaction();
        payload.encoder_pk = parseInt(user_id);
        if (useValidator_1.isValidPicture(payload.picture)) {
            const upload_result = yield useFileUploader_1.UploadImage({
                base_url: "./src/Storage/Files/Images/",
                extension: "jpg",
                file_name: "course",
                file_to_upload: payload.picture,
            });
            if (upload_result.success) {
                payload.picture = upload_result.data;
            }
            else {
                return upload_result;
            }
        }
        const sql_insert_room = yield con.Insert(`
        INSERT INTO courses SET
        course_desc=@course_desc,
        est_duration=@est_duration,
        picture=@picture,
        notes=@notes,
        encoder_pk=@encoder_pk;
        `, payload);
        if (sql_insert_room.insertedId > 0) {
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
const getCourseDataTable = (pagination_payload) => __awaiter(void 0, void 0, void 0, function* () {
    const con = yield DatabaseConfig_1.DatabaseConnection();
    try {
        yield con.BeginTransaction();
        const data = yield con.QueryPagination(`SELECT * FROM courses
      WHERE
      course_desc like concat('%',@search,'%')
      `, pagination_payload);
        const hasMore = data.length > pagination_payload.page.limit;
        if (hasMore) {
            data.splice(data.length - 1, 1);
        }
        const count = hasMore
            ? -1
            : pagination_payload.page.begin * pagination_payload.page.limit +
                data.length;
        for (const course of data) {
            course.picture = yield useFileUploader_1.GetUploadedImage(course.picture);
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
const getSingleCourse = (course_pk) => __awaiter(void 0, void 0, void 0, function* () {
    const con = yield DatabaseConfig_1.DatabaseConnection();
    try {
        yield con.BeginTransaction();
        const data = yield con.QuerySingle(`select * from courses where course_pk = @course_pk`, {
            course_pk: course_pk,
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
const getCourseDuration = (course_pk) => __awaiter(void 0, void 0, void 0, function* () {
    const con = yield DatabaseConfig_1.DatabaseConnection();
    try {
        yield con.BeginTransaction();
        const data = yield con.QuerySingle(`select est_duration from courses where course_pk = @course_pk limit 1`, {
            course_pk: course_pk,
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
const searchCourse = (search) => __awaiter(void 0, void 0, void 0, function* () {
    const con = yield DatabaseConfig_1.DatabaseConnection();
    try {
        yield con.BeginTransaction();
        const data = yield con.Query(`select course_pk id, course_desc label from courses
       ${useSearch_1.GenerateSearch(search, "course_desc")}
      `, {
            search,
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
const getTotalCourses = () => __awaiter(void 0, void 0, void 0, function* () {
    const con = yield DatabaseConfig_1.DatabaseConnection();
    try {
        yield con.BeginTransaction();
        const res_sql_count = yield con.QuerySingle(`select count(*) as total from courses WHERE is_active=1;`, {});
        con.Commit();
        return {
            success: true,
            data: res_sql_count.total,
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
const updateCourse = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const con = yield DatabaseConfig_1.DatabaseConnection();
    try {
        yield con.BeginTransaction();
        const sql_update_course = yield con.Modify(`
        UPDATE courses SET
        course_desc=@course_desc,
        est_duration=@est_duration,
        notes=@notes,
        encoder_pk=@encoder_pk
        WHERE
        course_pk=@course_pk;
          `, payload);
        if (sql_update_course > 0) {
            con.Commit();
            return {
                success: true,
                message: "The item has been updated successfully",
            };
        }
        else {
            con.Rollback();
            return {
                success: false,
                message: "There were no rows affected while updating the new record.",
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
const toggleCourseStatus = (course_pk, user_pk) => __awaiter(void 0, void 0, void 0, function* () {
    const con = yield DatabaseConfig_1.DatabaseConnection();
    try {
        yield con.BeginTransaction();
        const current_course_status = yield con.QuerySingle(`
      select is_active from courses where course_pk=@course_pk;
    `, {
            course_pk: course_pk,
        });
        const payload = {
            course_pk: course_pk,
            is_active: current_course_status.is_active === 1 ? 0 : 1,
        };
        const res_course_status = yield con.Modify(`update courses set is_active =@is_active where course_pk = @course_pk`, payload);
        if (res_course_status > 0) {
            const audit_log = yield con.Insert(`insert into audit_log set 
        user_pk=@user_pk,
        activity=@activity;
        `, {
                user_pk: user_pk,
                activity: `change course status to ${current_course_status.is_active === "y" ? "inactive" : "active"}`,
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
                message: "The process has been executed successfully!",
            };
        }
        else {
            yield con.Rollback();
            return {
                success: false,
                message: `No rows are affected when trying to update the status`,
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
const updateCourseImage = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const con = yield DatabaseConfig_1.DatabaseConnection();
    try {
        yield con.BeginTransaction();
        if (useValidator_1.isValidPicture(payload.picture)) {
            const upload_result = yield useFileUploader_1.UploadImage({
                base_url: "./src/Storage/Files/Images/",
                extension: "jpg",
                file_name: payload.encoder_pk,
                file_to_upload: payload.picture,
            });
            if (upload_result.success) {
                payload.picture = upload_result.data;
                const sql_update_pic = yield con.Modify(`
            UPDATE courses set
            picture=@picture
            WHERE
            course_pk=@course_pk;
          `, payload);
                if (sql_update_pic < 1) {
                    con.Rollback();
                    return {
                        success: false,
                        message: "There were no rows affected while updating the picture.",
                    };
                }
            }
            else {
                return upload_result;
            }
        }
        const audit_log = yield con.Insert(`insert into audit_log set 
      user_pk=@user_pk,
      activity=@activity;
      `, {
            user_pk: payload.encoder_pk,
            activity: `updated course picture.`,
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
            message: "The process has been executed succesfully!",
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
    addCourse,
    getCourseDataTable,
    getSingleCourse,
    searchCourse,
    getCourseDuration,
    getTotalCourses,
    updateCourse,
    toggleCourseStatus,
    updateCourseImage,
};
//# sourceMappingURL=CourseRepository.js.map