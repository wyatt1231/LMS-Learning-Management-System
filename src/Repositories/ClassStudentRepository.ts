import { DatabaseConnection } from "../Configurations/DatabaseConfig";
import { ErrorMessage } from "../Hooks/useErrorMessage";
import { GetUploadedImage } from "../Hooks/useFileUploader";
import UseSms from "../Hooks/UseSms";
import { ClassModel } from "../Models/ClassModel";
import { ClassStudentModel } from "../Models/ClassStudentModel";
import { NotifModel } from "../Models/NotifModel";
import { ResponseModel } from "../Models/ResponseModel";
import { StudentModel } from "../Models/StudentModel";
import { TutorModel } from "../Models/TutorModel";

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

    console.log(`payload`, payload);

    const sql_enroll_student = await con.Insert(
      `
        INSERT INTO class_students 
        SET
        class_pk=@class_pk,
        student_pk=(SELECT student_pk FROM students WHERE user_id='${user_pk}' LIMIT 1),
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
          remarks=CONCAT((SELECT concat(firstname,' ',lastname) FROM students WHERE user_id='${user_pk}' LIMIT 1),' has requested to join in your ',COALESCE((SELECT class_desc FROM classes WHERE class_pk = @class_pk),''),' class' ),
          ref_table='class_students',
          ref_pk=${sql_enroll_student.insertedId},
          user_type='STUDENT',
          aud_by=@encoder_pk
          `,
        payload
      );

      if (sql_audit.affectedRows > 0) {
        const tutor_info: TutorModel = await con.QuerySingle(
          `SELECT * FROM tutors where tutor_pk=(SELECT tutor_pk FROM classes WHERE class_pk = @class_pk) limit 1;`,
          {
            class_pk: payload.class_pk,
          }
        );

        const student_info: StudentModel = await con.QuerySingle(
          `select * from students where user_id = @user_pk limit 1;`,
          { user_pk: user_pk }
        );
        const class_info: ClassModel = await con.QuerySingle(
          `select * from classes where class_pk = @class_pk limit 1;`,
          { class_pk: payload.class_pk }
        );

        const msg = `Good day ${tutor_info.firstname} ${tutor_info.lastname}. This is Catalunan Pequeño National High School informing you that ${student_info.firstname} ${student_info.lastname} wants to join your ${class_info.class_desc} class.
        `;

        const res = await UseSms.SendSms(tutor_info.mob_no, msg);

        const notif_payload: NotifModel = {
          body: `${student_info.firstname} ${student_info.lastname} wants to join your ${class_info.class_desc} class`,
          user_pk: tutor_info.user_id,
          link: `/tutor/class/${class_info.class_pk}/student`,
          user_type: "tutor",
          encoder_pk: payload.encoder_pk,
        };

        const notif_res = await con.Insert(
          `INSERT INTO notif 
            SET
            body=@body,
            link=@link;`,
          notif_payload
        );

        console.log(`notif_payload`, notif_payload);

        notif_payload.notif_pk = notif_res.insertedId;

        await con.Insert(
          ` INSERT INTO notif_users 
          SET 
          notif_pk=@notif_pk,
          user_type=@user_type,
          user_pk=@user_pk;`,
          notif_payload
        );

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
const acceptClassStudent = async (
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

    if (sql_get_sts.sts_pk != "fa") {
      con.Rollback();
      return {
        success: false,
        message: "The student is not for approval",
      };
    }

    const sql_enroll_student = await con.Insert(
      `
        UPDATE class_students set sts_pk='a' where class_stud_pk=@class_stud_pk 
        `,
      { class_stud_pk: class_stud_pk }
    );

    if (sql_enroll_student.affectedRows > 0) {
      con.Commit();
      return {
        success: true,
        message: "The student's enrollment request has been approved!",
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
  acceptClassStudent,
};
