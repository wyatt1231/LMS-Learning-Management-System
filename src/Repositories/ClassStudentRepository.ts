import { DatabaseConnection } from "../Configurations/DatabaseConfig";
import { ErrorMessage } from "../Hooks/useErrorMessage";
import { GetUploadedImage } from "../Hooks/useFileUploader";
import { ClassStudentModel } from "../Models/ClassStudentModel";
import { ResponseModel } from "../Models/ResponseModel";

//Tutor actions
//select queries
const getTblClassStudents = async (
  class_pk: string
): Promise<ResponseModel> => {
  const con = await DatabaseConnection();
  try {
    await con.BeginTransaction();

    const class_students: Array<ClassStudentModel> = await con.Query(
      `select * from class_students where class_pk = @class_pk`,
      {
        class_pk: class_pk,
      }
    );

    for (const student of class_students) {
      student.student_details = await con.QuerySingle(
        `
            SELECT * from students where student_pk=@student_pk;
          `,
        { student_pk: student.student_pk }
      );
      student.student_details.picture = await GetUploadedImage(
        student.student_details.picture
      );

      student.status_details = await con.QuerySingle(
        `
            SELECT * from status_master where sts_pk=@sts_pk;
          `,
        { sts_pk: student.sts_pk }
      );
    }

    con.Commit();
    return {
      success: true,
      data: class_students,
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

//insert queries
const enrollClassStudent = async (
  payload: ClassStudentModel,
  user_id: string
): Promise<ResponseModel> => {
  const con = await DatabaseConnection();
  try {
    await con.BeginTransaction();
    payload.encoder_pk = parseInt(user_id);
    payload.sts_pk = "a";

    const sql_enroll_student = await con.Insert(
      `
        INSERT INTO class_students 
        SET
        class_pk=@class_pk,
        student_pk=@student_pk,
        sts_pk=@sts_pk,
        encoder_pk=@encoder_pk;
        `,
      payload
    );

    if (sql_enroll_student.insertedId > 0) {
      con.Commit();
      return {
        success: true,
        message: "Has been added successfully",
      };
    } else {
      con.Rollback();
      return {
        success: false,
        message: "There were no rows affected during the process!",
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

const joinStudentToClass = async (
  payload: ClassStudentModel,
  user_pk: string
): Promise<ResponseModel> => {
  const con = await DatabaseConnection();
  try {
    await con.BeginTransaction();
    payload.encoder_pk = parseInt(user_pk);
    payload.sts_pk = "fa";

    const sql_enroll_student = await con.Insert(
      `
        INSERT INTO class_students 
        SET
        class_pk=@class_pk,
        student_pk=(getStudentPK('${user_pk}')),
        sts_pk=@sts_pk,
        encoder_pk=@encoder_pk;
        `,
      payload
    );

    if (sql_enroll_student.insertedId > 0) {
      const sql_audit = await con.Insert(
        `
          INSERT INTO class_log 
          SET
          remarks=CONCAT(getStudNameByUser('${user_pk}'),' has requested to join in your ',COALESCE(getClassDesc(@class_pk),''),' class' ),
          ref_table='class_students',
          ref_pk=${sql_enroll_student.insertedId},
          user_type='STUDENT',
          aud_by=@encoder_pk
          `,
        payload
      );

      if (sql_audit.affectedRows > 0) {
        con.Commit();
        return {
          success: true,
          message: "Has been added successfully",
        };
      } else {
        con.Rollback();
        return {
          success: false,
          message: "There were no rows affected when logging this process.!",
        };
      }
    } else {
      con.Rollback();
      return {
        success: false,
        message: "There were no rows affected during the process!",
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

//udpate queries
const blockClassStudent = async (
  class_stud_pk: number
): Promise<ResponseModel> => {
  const con = await DatabaseConnection();
  try {
    await con.BeginTransaction();

    const sql_get_sts = await con.QuerySingle(
      `
        SELECT sts_pk from class_students where class_stud_pk=@class_stud_pk limit 1;
        `,
      { class_stud_pk: class_stud_pk }
    );

    if (sql_get_sts.sts_pk === "x") {
      con.Rollback();
      return {
        success: false,
        message: "The student is already in the block list.",
      };
    }

    const sql_enroll_student = await con.Insert(
      `
        UPDATE class_students set sts_pk='x' where class_stud_pk=@class_stud_pk 
        `,
      { class_stud_pk: class_stud_pk }
    );

    if (sql_enroll_student.insertedId > 0) {
      con.Commit();
      return {
        success: true,
        message: "The student has been blocked!",
      };
    } else {
      con.Rollback();
      return {
        success: false,
        message:
          "Something went wrong during the process, please try again or report this to the administrator!",
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

const reEnrollClassStudent = async (
  class_stud_pk: number
): Promise<ResponseModel> => {
  const con = await DatabaseConnection();
  try {
    await con.BeginTransaction();

    const sql_get_sts = await con.QuerySingle(
      `
        SELECT sts_pk from class_students where class_stud_pk=@class_stud_pk limit 1;
        `,
      { class_stud_pk: class_stud_pk }
    );

    if (sql_get_sts.sts_pk === "a") {
      con.Rollback();
      return {
        success: false,
        message: "You cannot re-enroll this student.",
      };
    }

    const sql_enroll_student = await con.Insert(
      `
        UPDATE class_students set sts_pk='a' where class_stud_pk=@class_stud_pk 
        `,
      { class_stud_pk: class_stud_pk }
    );

    if (sql_enroll_student.insertedId > 0) {
      con.Commit();
      return {
        success: true,
        message: "The student has been re-enrolled!",
      };
    } else {
      con.Rollback();
      return {
        success: false,
        message:
          "Something went wrong during the process, please try again or report this to the administrator!",
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

export default {
  getTblClassStudents,
  enrollClassStudent,
  blockClassStudent,
  reEnrollClassStudent,
  joinStudentToClass,
};
