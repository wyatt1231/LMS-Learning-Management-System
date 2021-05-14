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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const DatabaseConfig_1 = require("../Configurations/DatabaseConfig");
const useErrorMessage_1 = require("../Hooks/useErrorMessage");
const useFileUploader_1 = require("../Hooks/useFileUploader");
const useValidator_1 = require("../Hooks/useValidator");
const mysql2_1 = __importDefault(require("mysql2"));
const useSearch_1 = require("../Hooks/useSearch");
const useSql_1 = __importDefault(require("../Hooks/useSql"));
const addStudent = (payload, user_id) => __awaiter(void 0, void 0, void 0, function* () {
    const con = yield DatabaseConfig_1.DatabaseConnection();
    try {
        yield con.BeginTransaction();
        const user_param = {
            fullname: `${payload.lastname}, ${payload.firstname}`,
            username: payload.user.username,
            password: payload.user.password,
            user_type: "student",
            encoder_pk: user_id,
            allow_login: "n",
        };
        const sql_insert_user = yield con.Insert(`INSERT users SET
      username=@username,
      password=AES_ENCRYPT(@password,@username),
      user_type=@user_type,
      fullname=@fullname,
      allow_login=@allow_login;
      `, user_param);
        if (sql_insert_user.insertedId > 0) {
            if (useValidator_1.isValidPicture(payload.picture)) {
                const upload_result = yield useFileUploader_1.UploadImage({
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
            const student_payload = Object.assign(Object.assign({}, payload), { user_id: sql_insert_user.insertedId, encoder_pk: user_id, username: payload.user.username });
            const sql_create_student = yield con.Insert(`INSERT INTO students SET
         user_id=@user_id,          
         username=@username,         
         grade=@grade,            
         picture=@picture,          
         firstname=@firstname,        
         middlename=@middlename,       
         lastname=@lastname,         
         suffix=@suffix,           
         email=@email,            
         mob_no=@mob_no,           
         gender=@gender;      
        `, student_payload);
            if (sql_create_student.insertedId > 0) {
                con.Commit();
                return {
                    success: true,
                    message: "Your account has been created successfully. A message will be sent to you when the administrators takes an action for this request.",
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
            message: useErrorMessage_1.ErrorMessage(error),
        };
    }
});
const updateStudent = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const con = yield DatabaseConfig_1.DatabaseConnection();
    try {
        yield con.BeginTransaction();
        const sql_update_student = yield con.Modify(`
        UPDATE students SET
        grade=@grade,            
        firstname=@firstname,        
        middlename=@middlename,       
        lastname=@lastname,         
        suffix=@suffix,           
        email=@email,            
        mob_no=@mob_no,           
        gender=@gender,           
        where user_id=@encoder_pk;     
        `, payload);
        if (sql_update_student > 0) {
            const audit_log = yield con.Insert(`insert into audit_log set 
        user_pk=@user_pk,
        activity=@activity;
        `, {
                user_pk: payload.encoder_pk,
                activity: `updated his/her basic information`,
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
                message: "Your basic information has been updated!",
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
const updateStudentImage = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const con = yield DatabaseConfig_1.DatabaseConnection();
    try {
        yield con.BeginTransaction();
        if (useValidator_1.isValidPicture(payload.picture)) {
            const upload_result = yield useFileUploader_1.UploadImage({
                base_url: "./src/Storage/Files/Images/",
                extension: "jpg",
                file_name: payload.user_id,
                file_to_upload: payload.picture,
            });
            if (upload_result.success) {
                payload.picture = upload_result.data;
                const sql_update_pic = yield con.Modify(`
            UPDATE students set
            picture=@picture
            WHERE
            student_pk=@student_pk;
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
            activity: `updated his/her profile picture.`,
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
const approveStudent = (student_pk, user_id) => __awaiter(void 0, void 0, void 0, function* () {
    const con = yield DatabaseConfig_1.DatabaseConnection();
    try {
        yield con.BeginTransaction();
        const payload = {
            student_pk: parseInt(student_pk),
            sts_pk: "a",
            encoder_pk: user_id,
        };
        const sql_approve_student = yield con.Insert(`UPDATE administrators SET
        sts_pk=@sts_pk
        WHERE student_pk=@student_pk;
        `, payload);
        if (sql_approve_student.insertedId > 0) {
            const sql_allow_login = con.Modify(`
        update users set allow_login ='y' where user_id = (select user_id from students where student_pk=@student_pk)
      `, {
                student_pk: student_pk,
            });
            con.Commit();
            return {
                success: true,
                message: "The student has been approved successfully",
            };
        }
        else {
            con.Rollback();
            return {
                success: false,
                message: "Your account was not successfully created.",
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
const changeStudentStatus = (student_pk, user_id, sts_pk, sts_desc) => __awaiter(void 0, void 0, void 0, function* () {
    const con = yield DatabaseConfig_1.DatabaseConnection();
    try {
        yield con.BeginTransaction();
        const payload = {
            student_pk: parseInt(student_pk),
            sts_pk: sts_pk,
        };
        if (sts_pk === "a") {
            const sql_allow_login = con.Modify(`
        update users set allow_login ='y' where user_id = (select user_id from students where student_pk=@student_pk)
      `, {
                student_pk: student_pk,
            });
        }
        if (sts_pk === "x") {
            const sql_allow_login = con.Modify(`
        update users set allow_login ='n' where user_id = (select user_id from students where student_pk=@student_pk)
      `, {
                student_pk: student_pk,
            });
        }
        const sql_approve_student = yield con.Modify(`UPDATE students SET
        sts_pk=@sts_pk
        WHERE student_pk=@student_pk;
        `, payload);
        if (sql_approve_student > 0) {
            const audit_log = yield con.Insert(`insert into audit_log set 
        user_pk=@user_pk,
        activity=@activity;
        `, {
                user_pk: user_id,
                activity: `changed student status to ${sts_desc}`,
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
                message: "The student has been approved successfully",
            };
        }
        else {
            con.Rollback();
            return {
                success: false,
                message: "The student status was not successfully updated!",
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
// const updateAdmin = async (
//   payload: AdminModel,
//   user_id: string
// ): Promise<ResponseModel> => {
//   const con = await DatabaseConnection();
//   try {
//     await con.BeginTransaction();
//     if (isValidPicture(payload.picture)) {
//       const upload_result = await UploadImage({
//         base_url: "./src/Storage/Files/Images/",
//         extension: "jpg",
//         file_name: payload.user_id,
//         file_to_upload: payload.picture,
//       });
//       if (upload_result.success) {
//         payload.picture = upload_result.data;
//         const sql_update_pic = await con.Modify(
//           `
//             UPDATE administrators set
//             picture=@picture,
//             WHERE
//             admin_pk=@admin_pk;
//           `,
//           payload
//         );
//         if (sql_update_pic < 1) {
//           con.Rollback();
//           return {
//             success: false,
//             message: "There were no rows affected while updating the picture.",
//           };
//         }
//       } else {
//         return upload_result;
//       }
//     }
//     payload.encoder_pk = user_id;
//     const admin_updated_rows = await con.Modify(
//       `UPDATE administrators SET
//         position=@position,
//         firstname=@firstname,
//         middlename=@middlename,
//         lastname=@lastname,
//         suffix=@suffix,
//         prefix=@prefix,
//         birth_date=@birth_date,
//         email=@email,
//         mob_no=@mob_no,
//         gender=@gender,
//         encoder_pk=@encoder_pk
//         WHERE admin_pk=@admin_pk;
//         ;`,
//       payload
//     );
//     if (admin_updated_rows > 0) {
//       con.Commit();
//       return {
//         success: true,
//         message: "The administrator has been updated successfully!",
//       };
//     } else {
//       con.Rollback();
//       return {
//         success: true,
//         message: "The were no affected rows when updating the administrator!",
//       };
//     }
//   } catch (error) {
//     await con.Rollback();
//     console.error(`error`, error);
//     return {
//       success: false,
//       message: ErrorMessage(error),
//     };
//   }
// };
const getStudentDataTable = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const con = yield DatabaseConfig_1.DatabaseConnection();
    try {
        yield con.BeginTransaction();
        console.log(`payload`, payload);
        const data = yield con.QueryPagination(`
      SELECT * FROM 
      (SELECT s.*,CONCAT(s.firstname,' ',s.lastname) fullname, sm.sts_desc,sm.sts_bgcolor,sm.sts_color FROM students s 
      JOIN status_master sm ON s.sts_pk = sm.sts_pk) tmp
      WHERE
      (firstname like concat('%',@search,'%')
      OR lastname like concat('%',@search,'%'))
      AND grade in @grade
      AND sts_pk in @sts_pk
      ${useSql_1.default.DateWhereClause("encoded_at", ">=", payload.filters.encoded_from)}
      ${useSql_1.default.DateWhereClause("encoded_at", "<=", payload.filters.encoded_to)}
      `, payload);
        const hasMore = data.length > payload.page.limit;
        if (hasMore) {
            data.splice(data.length - 1, 1);
        }
        const count = hasMore
            ? -1
            : payload.page.begin * payload.page.limit + data.length;
        for (const row of data) {
            row.picture = yield useFileUploader_1.GetUploadedImage(row.picture);
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
const getSingleStudent = (student_pk) => __awaiter(void 0, void 0, void 0, function* () {
    const con = yield DatabaseConfig_1.DatabaseConnection();
    try {
        yield con.BeginTransaction();
        const data = yield con.QuerySingle(`select * from students where student_pk = @student_pk`, {
            student_pk: student_pk,
        });
        data.status = yield con.QuerySingle(`select * from status_master where sts_pk=@sts_pk`, {
            sts_pk: data.sts_pk,
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
const searchStudentNotInClass = (search, class_pk) => __awaiter(void 0, void 0, void 0, function* () {
    const con = yield DatabaseConfig_1.DatabaseConnection();
    try {
        yield con.BeginTransaction();
        const data = yield con.Query(`
      SELECT * FROM (
      SELECT student_pk id, CONCAT(firstname,' ',lastname) label FROM students 
      WHERE student_pk NOT IN (SELECT student_pk FROM class_students WHERE class_pk =${mysql2_1.default.escape(class_pk)})
      ) tmp
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
const getTotalStudents = () => __awaiter(void 0, void 0, void 0, function* () {
    const con = yield DatabaseConfig_1.DatabaseConnection();
    try {
        yield con.BeginTransaction();
        const res_sql_count = yield con.QuerySingle(`select count(*) as total from students WHERE is_active='y';`, {});
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
const getLoggedStudentInfo = (user_pk) => __awaiter(void 0, void 0, void 0, function* () {
    const con = yield DatabaseConfig_1.DatabaseConnection();
    try {
        yield con.BeginTransaction();
        const data = yield con.QuerySingle(`select * from students where user_id = @user_pk`, {
            user_pk,
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
exports.default = {
    addStudent,
    approveStudent,
    getStudentDataTable,
    getSingleStudent,
    searchStudentNotInClass,
    changeStudentStatus,
    getTotalStudents,
    getLoggedStudentInfo,
    updateStudentImage,
    updateStudent,
};
//# sourceMappingURL=StudentRepository.js.map