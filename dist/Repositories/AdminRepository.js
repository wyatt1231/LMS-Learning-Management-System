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
const useValidator_1 = require("../Hooks/useValidator");
const addAdmin = (payload, user_id) => __awaiter(void 0, void 0, void 0, function* () {
    const con = yield (0, DatabaseConfig_1.DatabaseConnection)();
    try {
        yield con.BeginTransaction();
        const user_param = {
            fullname: `${payload.lastname}, ${payload.firstname}`,
            username: payload.email,
            password: `mymentor`,
            user_type: "admin",
            encoder_pk: user_id,
        };
        const sql_insert_user = yield con.Insert(`INSERT users SET
      username=@username,
      password=AES_ENCRYPT(@password,@username),
      user_type=@user_type,
      fullname=@fullname,
      encoder_pk=@encoder_pk;
      `, user_param);
        if (sql_insert_user.insertedId > 0) {
            if ((0, useValidator_1.isValidPicture)(payload.picture)) {
                const upload_result = yield (0, useFileUploader_1.UploadImage)({
                    base_url: "./src/Storage/Files/Images/",
                    extension: "jpg",
                    file_name: sql_insert_user.insertedId,
                    file_to_upload: payload.picture,
                });
                if (upload_result.success) {
                    payload.picture = upload_result.data;
                }
                else {
                    return upload_result;
                }
            }
            const admin_payload = Object.assign(Object.assign({}, payload), { user_id: sql_insert_user.insertedId, encoder_pk: user_id, birth_date: (0, useDateParser_1.parseInvalidDateToDefault)(payload.birth_date) });
            const sql_create_admin = yield con.Insert(`INSERT INTO administrators SET
        user_id=@user_id,
        position=@position,
        picture=@picture,
        firstname=@firstname,
        middlename=@middlename,
        lastname=@lastname,
        suffix=@suffix,
        prefix=@prefix,
        birth_date=@birth_date,
        email=@email,
        mob_no=@mob_no,
        gender=@gender,
        encoder_pk=@encoder_pk;`, admin_payload);
            if (sql_create_admin.insertedId > 0) {
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
                    message: "There were no affected rows when adding the new administrator",
                };
            }
        }
        else {
            con.Rollback();
            return {
                success: false,
                message: "The were no affected rows when adding the new user",
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
const updateAdmin = (payload, user_id) => __awaiter(void 0, void 0, void 0, function* () {
    const con = yield (0, DatabaseConfig_1.DatabaseConnection)();
    try {
        yield con.BeginTransaction();
        if ((0, useValidator_1.isValidPicture)(payload.picture)) {
            const upload_result = yield (0, useFileUploader_1.UploadImage)({
                base_url: "./src/Storage/Files/Images/",
                extension: "jpg",
                file_name: payload.user_id,
                file_to_upload: payload.picture,
            });
            if (upload_result.success) {
                payload.picture = upload_result.data;
                const sql_update_pic = yield con.Modify(`
            UPDATE administrators set
            picture=@picture,
            WHERE
            admin_pk=@admin_pk;
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
        payload.encoder_pk = user_id;
        const admin_updated_rows = yield con.Modify(`UPDATE administrators SET
        position=@position,
        firstname=@firstname,
        middlename=@middlename,
        lastname=@lastname,
        suffix=@suffix,
        prefix=@prefix,
        birth_date=@birth_date,
        email=@email,
        mob_no=@mob_no,
        gender=@gender,
        encoder_pk=@encoder_pk
        WHERE admin_pk=@admin_pk;
        ;`, payload);
        if (admin_updated_rows > 0) {
            con.Commit();
            return {
                success: true,
                message: "The administrator has been updated successfully!",
            };
        }
        else {
            con.Rollback();
            return {
                success: true,
                message: "The were no affected rows when updating the administrator!",
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
const getAdminDataTable = (pagination_payload) => __awaiter(void 0, void 0, void 0, function* () {
    const con = yield (0, DatabaseConfig_1.DatabaseConnection)();
    try {
        yield con.BeginTransaction();
        const data = yield con.QueryPagination(`
      SELECT * FROM (SELECT *,CONCAT(firstname,' ',lastname) fullname FROM administrators) tmp
      WHERE 
      firstname like concat('%',@search,'%')
      OR lastname like concat('%',@search,'%')
      OR email like concat('%',@search,'%')
      OR mob_no like concat('%',@search,'%')
      OR position like concat('%',@search,'%')
      `, pagination_payload);
        const hasMore = data.length > pagination_payload.page.limit;
        if (hasMore) {
            data.splice(data.length - 1, 1);
        }
        const count = hasMore
            ? -1
            : pagination_payload.page.begin * pagination_payload.page.limit +
                data.length;
        for (const admin of data) {
            const pic = yield (0, useFileUploader_1.GetUploadedImage)(admin.picture);
            admin.picture = pic;
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
            message: (0, useErrorMessage_1.ErrorMessage)(error),
        };
    }
});
const getSingleAdmin = (admin_pk) => __awaiter(void 0, void 0, void 0, function* () {
    const con = yield (0, DatabaseConfig_1.DatabaseConnection)();
    try {
        yield con.BeginTransaction();
        const data = yield con.QuerySingle(`select * from administrators where admin_pk = @admin_pk`, {
            admin_pk,
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
const getLoggedAdmin = (user_id) => __awaiter(void 0, void 0, void 0, function* () {
    const con = yield (0, DatabaseConfig_1.DatabaseConnection)();
    try {
        yield con.BeginTransaction();
        console.log(`user`, user_id);
        const data = yield con.QuerySingle(`select * from administrators where user_id = @user_id`, {
            user_id,
        });
        console.log(`data`, data);
        if (!!data.picture) {
            data.picture = yield (0, useFileUploader_1.GetUploadedImage)(data.picture);
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
            message: (0, useErrorMessage_1.ErrorMessage)(error),
        };
    }
});
const updateAdminInfo = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const con = yield (0, DatabaseConfig_1.DatabaseConnection)();
    try {
        yield con.BeginTransaction();
        payload.birth_date = (0, useDateParser_1.parseInvalidDateToDefault)(payload.birth_date);
        const admin_updated_rows = yield con.Modify(`UPDATE administrators SET
        position=@position,
        firstname=@firstname,
        middlename=@middlename,
        lastname=@lastname,
        suffix=@suffix,
        prefix=@prefix,
        birth_date=@birth_date,
        mob_no=@mob_no,
        gender=@gender
        WHERE admin_pk=@admin_pk;
        ;`, payload);
        if (admin_updated_rows > 0) {
            const audit_log = yield con.Insert(`insert into audit_log set 
        user_pk=@user_pk,
        activity=@activity;
        `, {
                user_pk: payload.user_id,
                activity: `updated profile information.`,
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
            message: (0, useErrorMessage_1.ErrorMessage)(error),
        };
    }
});
const updateAdminImage = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const con = yield (0, DatabaseConfig_1.DatabaseConnection)();
    try {
        yield con.BeginTransaction();
        if ((0, useValidator_1.isValidPicture)(payload.picture)) {
            const upload_result = yield (0, useFileUploader_1.UploadImage)({
                base_url: "./src/Storage/Files/Images/",
                extension: "jpg",
                file_name: payload.user_id,
                file_to_upload: payload.picture,
            });
            if (upload_result.success) {
                payload.picture = upload_result.data;
                const sql_update_pic = yield con.Modify(`
            UPDATE administrators set
            picture=@picture
            WHERE
            admin_pk=@admin_pk;
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
            user_pk: payload.user_id,
            activity: `updated profile picture.`,
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
            message: (0, useErrorMessage_1.ErrorMessage)(error),
        };
    }
});
const getTotalAdmin = () => __awaiter(void 0, void 0, void 0, function* () {
    const con = yield (0, DatabaseConfig_1.DatabaseConnection)();
    try {
        yield con.BeginTransaction();
        const res_sql_count = yield con.QuerySingle(`select count(*) as total from administrators WHERE is_active='y';`, {});
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
            message: (0, useErrorMessage_1.ErrorMessage)(error),
        };
    }
});
exports.default = {
    addAdmin,
    updateAdmin,
    getAdminDataTable,
    getSingleAdmin,
    updateAdminInfo,
    updateAdminImage,
    getLoggedAdmin,
    getTotalAdmin, //new
};
//# sourceMappingURL=AdminRepository.js.map