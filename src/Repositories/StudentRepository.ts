import { DatabaseConnection } from "../Configurations/DatabaseConfig";
import { ErrorMessage } from "../Hooks/useErrorMessage";
import { GetUploadedImage, UploadImage } from "../Hooks/useFileUploader";
import { isValidPicture } from "../Hooks/useValidator";
import { PaginationModel } from "../Models/PaginationModel";
import { ResponseModel } from "../Models/ResponseModel";
import { StatusMasterModel } from "../Models/StatusMasterModel";
import { StudentModel } from "../Models/StudentModel";
import { UserModel } from "../Models/UserModel";

import mysql from "mysql2";
import { GenerateSearch } from "../Hooks/useSearch";
const addStudent = async (
  payload: StudentModel,
  user_id: string
): Promise<ResponseModel> => {
  const con = await DatabaseConnection();
  try {
    await con.BeginTransaction();

    const user_param: UserModel = {
      fullname: `${payload.lastname}, ${payload.firstname}`,
      username: payload.user.username,
      password: payload.user.password,
      user_type: "student",
      encoder_pk: user_id,
      allow_login: "n",
    };

    const sql_insert_user = await con.Insert(
      `INSERT users SET
      username=@username,
      password=AES_ENCRYPT(@password,@username),
      user_type=@user_type,
      fullname=@fullname,
      allow_login=@allow_login;
      `,
      user_param
    );

    if (sql_insert_user.insertedId > 0) {
      if (isValidPicture(payload.picture)) {
        const upload_result = await UploadImage({
          base_url: "./src/Storage/Files/Images/",
          extension: "jpg",
          file_name: sql_insert_user.insertedId,
          file_to_upload: payload.picture,
        });

        if (upload_result.success) {
          payload.picture = upload_result.data;
        } else {
          return upload_result;
        }
      }

      const student_payload: StudentModel = {
        ...payload,
        user_id: sql_insert_user.insertedId,
        encoder_pk: user_id,
        username: payload.user.username,
      };

      const sql_create_student = await con.Insert(
        `INSERT INTO students SET
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
         gender=@gender,           
         complete_address=@complete_address;      
        `,
        student_payload
      );

      if (sql_create_student.insertedId > 0) {
        con.Commit();
        return {
          success: true,
          message:
            "Your account has been created successfully. A message will be sent to you when the administrators takes an action for this request.",
        };
      } else {
        con.Rollback();
        return {
          success: false,
          message:
            "There were no affected rows when adding the new administrator",
        };
      }
    } else {
      con.Rollback();
      return {
        success: false,
        message: "The were no affected rows when adding the new user",
      };
    }
  } catch (error) {
    await con.Rollback();
    console.error(`error`, error);
    return {
      success: false,
      message: ErrorMessage(error),
    };
  }
};

const approveStudent = async (
  student_pk: string,
  user_id: string
): Promise<ResponseModel> => {
  const con = await DatabaseConnection();
  try {
    await con.BeginTransaction();

    const payload: StudentModel = {
      student_pk: parseInt(student_pk),
      sts_pk: "A",
      encoder_pk: user_id,
    };

    const sql_approve_student = await con.Insert(
      `UPDATE administrators SET
        sts_pk=@sts_pk
        WHERE student_pk=@student_pk;
        `,
      payload
    );

    if (sql_approve_student.insertedId > 0) {
      con.Commit();
      return {
        success: true,
        message: "The student has been approved successfully",
      };
    } else {
      con.Rollback();
      return {
        success: false,
        message: "Your account was not successfully created.",
      };
    }
  } catch (error) {
    await con.Rollback();
    console.error(`error`, error);
    return {
      success: false,
      message: ErrorMessage(error),
    };
  }
};

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

const getStudentDataTable = async (
  pagination_payload: PaginationModel
): Promise<ResponseModel> => {
  const con = await DatabaseConnection();
  try {
    await con.BeginTransaction();

    const data: Array<
      StudentModel & StatusMasterModel
    > = await con.QueryPagination(
      `
      SELECT * FROM 
      (SELECT s.*,CONCAT(s.firstname,' ',s.lastname) fullname, sm.sts_desc,sm.sts_bgcolor,sm.sts_color FROM students s 
      JOIN status_master sm ON s.sts_pk = sm.sts_pk) tmp
      WHERE
      firstname like concat('%',@search,'%')
      OR lastname like concat('%',@search,'%')
      OR email like concat('%',@search,'%')
      OR mob_no like concat('%',@search,'%')
      OR grade like concat('%',@search,'%')
      `,
      pagination_payload
    );

    const hasMore: boolean = data.length > pagination_payload.page.limit;

    if (hasMore) {
      data.splice(data.length - 1, 1);
    }

    const count: number = hasMore
      ? -1
      : pagination_payload.page.begin * pagination_payload.page.limit +
        data.length;

    for (const row of data) {
      row.picture = await GetUploadedImage(row.picture);
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
  } catch (error) {
    await con.Rollback();
    console.error(`error`, error);
    return {
      success: false,
      message: ErrorMessage(error),
    };
  }
};

const getSingleStudent = async (student_pk: string): Promise<ResponseModel> => {
  const con = await DatabaseConnection();
  try {
    await con.BeginTransaction();

    const data = await con.QuerySingle(
      `select * from students where student_pk = @student_pk`,
      {
        student_pk: student_pk,
      }
    );

    con.Commit();
    return {
      success: true,
      data: data,
    };
  } catch (error) {
    await con.Rollback();
    console.error(`error`, error);
    return {
      success: false,
      message: ErrorMessage(error),
    };
  }
};

const searchStudentNotInClass = async (
  search: string,
  class_pk: number
): Promise<ResponseModel> => {
  const con = await DatabaseConnection();
  try {
    await con.BeginTransaction();

    const data: any = await con.Query(
      `
      SELECT * FROM (
      SELECT student_pk id, CONCAT(firstname,' ',lastname) label FROM students 
      WHERE student_pk NOT IN (SELECT student_pk FROM class_students WHERE class_pk =${mysql.escape(
        class_pk
      )})
      ) tmp
       ${GenerateSearch(search, "label")} limit 50
      `,
      {
        search,
      }
    );

    for (const tutor of data) {
      tutor.picture = await GetUploadedImage(tutor.picture);
    }

    con.Commit();
    return {
      success: true,
      data: data,
    };
  } catch (error) {
    await con.Rollback();
    console.error(`error`, error);
    return {
      success: false,
      message: ErrorMessage(error),
    };
  }
};

export default {
  addStudent,
  approveStudent,
  getStudentDataTable,
  getSingleStudent,
  searchStudentNotInClass,
};
