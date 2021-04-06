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
exports.currentUser = exports.loginUser = void 0;
const DatabaseConfig_1 = require("../Configurations/DatabaseConfig");
const useErrorMessage_1 = require("../Hooks/useErrorMessage");
const useFileUploader_1 = require("../Hooks/useFileUploader");
const useJwt_1 = require("../Hooks/useJwt");
const loginUser = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const con = yield DatabaseConfig_1.DatabaseConnection();
    try {
        yield con.BeginTransaction();
        const user = yield con.QuerySingle(`SELECT user_id,user_type,allow_login FROM users u WHERE u.password = AES_ENCRYPT(@password,@username)`, payload);
        if (user) {
            if (user.allow_login === "n") {
                return {
                    success: false,
                    message: "You are not allowed to login with this account yet. This maybe because your account is not yet approved by the administrator.",
                };
            }
            const token = yield useJwt_1.CreateToken(user);
            if (token) {
                yield con.Commit();
                return {
                    success: true,
                    message: "You have been logged in successfully",
                    data: {
                        user: user,
                        token: token,
                    },
                };
            }
            else {
                yield con.Rollback();
                return {
                    success: false,
                    message: "The server was not able to create a token. ",
                };
            }
        }
        else {
            yield con.Rollback();
            return {
                success: false,
                message: "Incorrent username and/or password.",
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
exports.loginUser = loginUser;
const currentUser = (user_id) => __awaiter(void 0, void 0, void 0, function* () {
    const con = yield DatabaseConfig_1.DatabaseConnection();
    try {
        yield con.BeginTransaction();
        const updated_status = yield con.Modify(`UPDATE users SET sts_pk='x' WHERE user_id = @user_id`, {
            user_id: user_id,
        });
        if (updated_status > 0) {
            const user_data = yield con.QuerySingle(`SELECT u.user_type,u.username, u.fullname, u.online_count,u.sts_pk FROM users u 
        where u.user_id = @user_id
        `, {
                user_id,
            });
            if (user_data.user_type === "admin") {
                const sql_get_pic = yield con.QuerySingle(`SELECT picture FROM administrators WHERE user_id=${user_id} LIMIT 1`, null);
                user_data.picture = yield useFileUploader_1.GetUploadedImage(sql_get_pic === null || sql_get_pic === void 0 ? void 0 : sql_get_pic.picture);
            }
            else if (user_data.user_type === "tutor") {
                const sql_get_pic = yield con.QuerySingle(`SELECT picture FROM tutors WHERE user_id=${user_id} LIMIT 1`, null);
                user_data.picture = yield useFileUploader_1.GetUploadedImage(sql_get_pic === null || sql_get_pic === void 0 ? void 0 : sql_get_pic.picture);
            }
            else if (user_data.user_type === "student") {
                const sql_get_pic = yield con.QuerySingle(`SELECT picture,rated_tutor FROM students WHERE user_id=${user_id} LIMIT 1`, null);
                user_data.picture = yield useFileUploader_1.GetUploadedImage(sql_get_pic === null || sql_get_pic === void 0 ? void 0 : sql_get_pic.picture);
                user_data.rated_tutor = sql_get_pic.rated_tutor;
            }
            yield con.Commit();
            return {
                success: true,
                data: user_data,
            };
        }
        else {
            yield con.Rollback();
            return {
                success: false,
                message: " An error occured while the process is executing. No user information has been found.",
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
exports.currentUser = currentUser;
const changeAdminPassword = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const con = yield DatabaseConfig_1.DatabaseConnection();
    try {
        yield con.BeginTransaction();
        const total_found_user = yield con.QuerySingle(`
    SELECT COUNT(*) AS total FROM users WHERE password = AES_ENCRYPT(@old_password,username) AND user_id = @user_id LIMIT 1
    `, payload);
        console.log(`payload`, payload);
        console.log(`total_found_user`, total_found_user);
        if (total_found_user.total <= 0) {
            con.Rollback();
            return {
                success: false,
                message: "You must have entered an incorrect old password. Please try again!",
            };
        }
        const res_update_user = yield con.Modify(`UPDATE users SET
       password = AES_ENCRYPT(@password,username)
       WHERE user_id =@user_id;`, payload);
        if (res_update_user > 0) {
            const res_audit_log = yield con.Insert(`insert into audit_log set 
        user_pk=@user_pk,
        activity=@activity;
        `, {
                user_pk: payload.user_id,
                activity: `change password`,
            });
            if (res_audit_log.insertedId <= 0) {
                con.Rollback();
                return {
                    success: true,
                    message: "The activity was not logged!",
                };
            }
            con.Commit();
            return {
                success: true,
                message: "The process has been executed succesfully!",
            };
        }
        else {
            con.Rollback();
            return {
                success: true,
                message: "The were no affected rows during the process!",
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
const getUserLogs = (user_pk) => __awaiter(void 0, void 0, void 0, function* () {
    const con = yield DatabaseConfig_1.DatabaseConnection();
    try {
        yield con.BeginTransaction();
        const res_tbl_audit_log = yield con.Query(`
      select * from audit_log where user_pk=@user_pk order by encoded_at desc;
    `, {
            user_pk: user_pk,
        });
        for (const log of res_tbl_audit_log) {
            log.user = yield con.QuerySingle(`select * from vw_user_info where user_id=@user_id`, {
                user_id: log.user_pk,
            });
        }
        con.Commit();
        return {
            success: true,
            data: res_tbl_audit_log,
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
const getAllLogs = () => __awaiter(void 0, void 0, void 0, function* () {
    const con = yield DatabaseConfig_1.DatabaseConnection();
    try {
        yield con.BeginTransaction();
        const res_tbl_audit_log = yield con.Query(`
      select * from audit_log order by encoded_at desc;
    `, {});
        for (const log of res_tbl_audit_log) {
            log.user = yield con.QuerySingle(`select * from vw_user_info where user_id=@user_id`, {
                user_id: log.user_pk,
            });
            if (log.user) {
                log.user.picture = yield useFileUploader_1.GetUploadedImage(log.user.picture);
            }
            else {
                log.user = {
                    fullname: "Super Admin",
                    picture: null,
                };
            }
        }
        con.Commit();
        return {
            success: true,
            data: res_tbl_audit_log,
        };
    }
    catch (error) {
        yield con.Rollback();
        console.error(`error ..`, error);
        return {
            success: false,
            message: useErrorMessage_1.ErrorMessage(error),
        };
    }
});
exports.default = {
    changeAdminPassword,
    getUserLogs,
    getAllLogs,
};
//# sourceMappingURL=UserRepository.js.map