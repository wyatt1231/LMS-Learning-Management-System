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
const useSearch_1 = require("../Hooks/useSearch");
const addTutor = (params, user_id) => __awaiter(void 0, void 0, void 0, function* () {
    const con = yield DatabaseConfig_1.DatabaseConnection();
    try {
        yield con.BeginTransaction();
        const user_param = {
            fullname: `${params.lastname}, ${params.firstname}`,
            username: params.email,
            password: `mymentor`,
            user_type: "tutor",
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
            if (typeof params.picture !== "undefined" &&
                params.picture !== "" &&
                params.picture !== null) {
                const upload_result = yield useFileUploader_1.UploadImage({
                    base_url: "./src/Storage/Files/Images/",
                    extension: "jpg",
                    file_name: sql_insert_user.insertedId,
                    file_to_upload: params.picture,
                });
                if (upload_result.success) {
                    params.picture = upload_result.data.toString();
                }
                else {
                    return upload_result;
                }
            }
            const tutor_payload = Object.assign(Object.assign({}, params), { username: params.email, user_id: sql_insert_user.insertedId, encoder_pk: user_id, birth_date: useDateParser_1.parseInvalidDateToDefault(params.birth_date) });
            const sql_insert_tutor = yield con.Insert(`
        INSERT INTO tutors
        SET
        user_id=@user_id,
        username=@username,
        position=@position,
        picture=@picture,
        firstname=@firstname,
        middlename=@middlename,
        lastname=@lastname,
        birth_date=DATE_FORMAT(@birth_date,'%Y-%m-%d'),
        suffix=@suffix,
        bio=@bio,
        email=@email,
        mob_no=@mob_no,
        gender=@gender,
        complete_address=@complete_address,
        encoder_pk=@encoder_pk;
        `, tutor_payload);
            if (sql_insert_tutor.insertedId > 0) {
                con.Commit();
                return {
                    success: true,
                    message: "The tutor has been created successfully",
                };
            }
            else {
                con.Rollback();
                return {
                    success: false,
                    message: "Server error has occured. Tutor creation process was not successful.",
                };
            }
        }
        else {
            con.Rollback();
            return {
                success: false,
                message: "Server error has occured. User creation process was not successful.",
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
const updateTutor = (tutor_payload, user_id) => __awaiter(void 0, void 0, void 0, function* () {
    const con = yield DatabaseConfig_1.DatabaseConnection();
    try {
        yield con.BeginTransaction();
        if (typeof tutor_payload.picture !== "undefined" &&
            tutor_payload.picture !== "") {
            const upload_result = yield useFileUploader_1.UploadImage({
                base_url: "./src/Storage/Files/Images/",
                extension: "jpg",
                file_name: tutor_payload.user_id,
                file_to_upload: tutor_payload.picture,
            });
            if (upload_result.success) {
                tutor_payload.picture = upload_result.data;
                const sql_update_pic = yield con.Modify(`
            UPDATE tutors set
            picture=@picture,
            WHERE
            admin_pk=@admin_pk;
          `, tutor_payload);
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
        tutor_payload.encoder_pk = user_id;
        const sql_update_tutor = yield con.Modify(`
        UPDATE tutors SET
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
        encoder_pk=@encoder_pk,
        WHERE tutor_pk=@tutor_pk;
        `, tutor_payload);
        if (sql_update_tutor > 0) {
            con.Commit();
            return {
                success: true,
                message: "The tutor information has been updated successfully",
            };
        }
        else {
            con.Rollback();
            return {
                success: true,
                message: "Server error has occured. The process was unsuccessful.",
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
const getTutorDataTable = (pagination_payload) => __awaiter(void 0, void 0, void 0, function* () {
    const con = yield DatabaseConfig_1.DatabaseConnection();
    try {
        yield con.BeginTransaction();
        const data = yield con.QueryPagination(`SELECT * FROM tutors
      WHERE
      is_dummy = 'n' AND
      (firstname like concat('%',@search,'%')
      OR lastname like concat('%',@search,'%')
      OR email like concat('%',@search,'%')
      OR mob_no like concat('%',@search,'%')
      OR position like concat('%',@search,'%'))
      `, pagination_payload);
        const hasMore = data.length > pagination_payload.page.limit;
        if (hasMore) {
            data.splice(data.length - 1, 1);
        }
        const count = hasMore
            ? -1
            : pagination_payload.page.begin * pagination_payload.page.limit +
                data.length;
        for (const tutor of data) {
            const pic = yield useFileUploader_1.GetUploadedImage(tutor.picture);
            tutor.picture = pic;
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
const getSingleTutor = (tutor_pk) => __awaiter(void 0, void 0, void 0, function* () {
    const con = yield DatabaseConfig_1.DatabaseConnection();
    try {
        yield con.BeginTransaction();
        const data = yield con.QuerySingle(`select * from tutors where tutor_pk = @tutor_pk`, {
            tutor_pk,
        });
        data.picture = yield useFileUploader_1.GetUploadedImage(data.picture);
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
const searchTutor = (search) => __awaiter(void 0, void 0, void 0, function* () {
    const con = yield DatabaseConfig_1.DatabaseConnection();
    try {
        yield con.BeginTransaction();
        const data = yield con.Query(`SELECT * FROM (select tutor_pk id, concat(firstname,' ',lastname) label,picture from tutors) tmp 
       ${useSearch_1.GenerateSearch(search, "label")} limit 50
      `, {
            search,
        });
        for (const tutor of data) {
            tutor.picture = yield useFileUploader_1.GetUploadedImage(tutor.picture);
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
const getDummyTutors = (user_pk) => __awaiter(void 0, void 0, void 0, function* () {
    const con = yield DatabaseConfig_1.DatabaseConnection();
    try {
        yield con.BeginTransaction();
        const data = yield con.Query(`
      SELECT tutor_pk,'${user_pk}' student_pk,picture,concat(firstname,' ',lastname) name,bio, 0 as rating FROM tutors WHERE is_dummy = 'y'
      `, null);
        for (const tutor of data) {
            tutor.picture = yield useFileUploader_1.GetUploadedImage(tutor.picture);
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
const insertDummyTutorRatings = (payload, user_pk) => __awaiter(void 0, void 0, void 0, function* () {
    const con = yield DatabaseConfig_1.DatabaseConnection();
    try {
        yield con.BeginTransaction();
        const sql_update_student = yield con.Modify(`
      UPDATE students set rated_tutor=@rated_tutor where user_id=@user_id;
    `, { user_id: user_pk, rated_tutor: "y" });
        if (sql_update_student < 1) {
            con.Rollback();
            return {
                success: false,
                message: "There were no rows affected when trying to update the student.",
            };
        }
        for (const tutor of payload) {
            tutor.encoded_by = user_pk;
            const sql_insert_tutor = yield con.Insert(`
        INSERT INTO tutor_ratings SET
        tutor_pk=@tutor_pk,
        student_pk=@student_pk,
        rating=@rating,
        encoded_by=@encoded_by
          `, tutor);
            if (sql_insert_tutor.affectedRows < 1) {
                con.Rollback();
                return {
                    success: false,
                    message: "There were no rows affected when trying to save the tutor rating.",
                };
            }
        }
        con.Commit();
        return {
            success: true,
            message: "Your ratings has been saved successfully!",
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
    addTutor,
    updateTutor,
    getTutorDataTable,
    getSingleTutor,
    searchTutor,
    getDummyTutors,
    insertDummyTutorRatings,
};
//# sourceMappingURL=TutorRepository.js.map