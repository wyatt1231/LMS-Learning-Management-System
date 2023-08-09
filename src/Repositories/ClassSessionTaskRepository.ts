import { DatabaseConnection } from "../Configurations/DatabaseConfig";
import { parseInvalidDateTimeToDefault } from "../Hooks/useDateParser";
import { ErrorMessage } from "../Hooks/useErrorMessage";
import { GetUploadedImage, UploadFile } from "../Hooks/useFileUploader";
import { ClassSessionModel } from "../Models/ClassSessionModel";
import {
  SessionTaskModel,
  SessionTaskQuesModel,
  SessionTaskSubFileModel,
  SessionTaskSubModel,
} from "../Models/ClassSessionTaskModels";
import { ResponseModel } from "../Models/ResponseModel";
import { StudentModel } from "../Models/StudentModel";

const getAllClassTask = async (class_pk: number): Promise<ResponseModel> => {
  const con = await DatabaseConnection();
  try {
    await con.BeginTransaction();

    const tasks: Array<SessionTaskModel> = await con.Query(
      `
      SELECT * FROM class_tasks where class_pk=@class_pk
      `,
      {
        class_pk: class_pk,
      }
    );

    for (const task of tasks) {
      task.status_dtls = await con.QuerySingle(
        `SELECT * from status_master where sts_pk=@sts_pk limit 1;`,
        {
          sts_pk: task.sts_pk,
        }
      );
    }

    con.Commit();
    return {
      success: true,
      data: tasks,
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

const getSingleClassTask = async (
  class_task_pk: number
): Promise<ResponseModel> => {
  const con = await DatabaseConnection();
  try {
    await con.BeginTransaction();

    const data: SessionTaskModel = await con.QuerySingle(
      `
        SELECT * FROM class_tasks where class_task_pk=@class_task_pk
        `,
      {
        class_task_pk: class_task_pk,
      }
    );

    data.status_dtls = await con.QuerySingle(
      `SELECT * from status_master where sts_pk=@sts_pk limit 1;`,
      {
        sts_pk: data.sts_pk,
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

const addClassTask = async (
  payload: SessionTaskModel,
  file: any
): Promise<ResponseModel> => {
  const con = await DatabaseConnection();
  try {
    await con.BeginTransaction();

    console.log(`payload.due_date`, payload.questions);
    payload.due_date = parseInvalidDateTimeToDefault(payload.due_date);

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

    const sql_add_task = await con.Insert(
      `INSERT INTO class_tasks SET
        class_pk=@class_pk,
        task_title=@task_title,
        task_desc=@task_desc,
        due_date=@due_date,
        file_location=@file_location,
        encoder_pk=@encoder_pk;`,
      {
        ...payload,
        file_location: null,
      }
    );

    if (sql_add_task.affectedRows > 0) {
      for (const ques of payload?.questions) {
        const params = {
          ...ques,
          class_task_pk: sql_add_task.insertedId,
        };

        console.log(`ques`, ques);

        const sql_add_ques = await con.Insert(
          `INSERT INTO class_task_ques SET
          class_task_pk=@class_task_pk,
          question=@question,
          cor_answer=@cor_answer,
          pnt=@pnt;`,
          params
        );

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
    } else {
      con.Rollback();
      return {
        success: false,
        message: `There were no affected rows in the process!`,
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

const updateClassTask = async (
  payload: SessionTaskModel,
  file: any
): Promise<ResponseModel> => {
  const con = await DatabaseConnection();
  try {
    await con.BeginTransaction();

    payload.due_date = parseInvalidDateTimeToDefault(payload.due_date);

    const file_res = await UploadFile("src/Storage/Files/Tasks/", file);
    if (!file_res.success) {
      con.Rollback();
      return file_res;
    }

    payload = {
      ...payload,
      file_location: file_res.data,
    };

    const sql_update_task = await con.Modify(
      `UPDATE  class_tasks SET
            task_title=@task_title,
            task_desc=@task_desc,
            file_location=@file_location,
            due_date=@due_date
            WHERE class_task_pk=@class_task_pk;`,
      payload
    );

    if (sql_update_task > 0) {
      con.Commit();
      return {
        success: true,
        message: `The task has been updated successfully.`,
      };
    } else {
      con.Rollback();
      return {
        success: false,
        message: `There were no affected rows in the process!`,
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

const toggleSubmitClassTask = async (
  payload: SessionTaskModel
): Promise<ResponseModel> => {
  const con = await DatabaseConnection();
  try {
    await con.BeginTransaction();

    const sql_update_task = await con.Modify(
      `UPDATE  class_tasks SET
            allow_submit=@allow_submit
            WHERE class_task_pk=@class_task_pk;`,
      payload
    );

    if (sql_update_task > 0) {
      con.Commit();
      return {
        success: true,
        message: `The task has been updated successfully.`,
      };
    } else {
      con.Rollback();
      return {
        success: false,
        message: `There were no affected rows in the process!`,
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

const changeStatusClassTask = async (
  payload: SessionTaskModel
): Promise<ResponseModel> => {
  const con = await DatabaseConnection();
  try {
    await con.BeginTransaction();

    const sql_update_task = await con.Modify(
      `UPDATE  class_tasks SET
       sts_pk=@sts_pk
       WHERE class_task_pk=@class_task_pk;`,
      payload
    );

    if (sql_update_task > 0) {
      con.Commit();
      return {
        success: true,
        message: `The task has started.`,
      };
    } else {
      con.Rollback();
      return {
        success: false,
        message: `There were no affected rows in the process!`,
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

//Class questions

const getAllClassTaskQues = async (
  class_task_pk: number
): Promise<ResponseModel> => {
  const con = await DatabaseConnection();
  try {
    await con.BeginTransaction();

    const data: Array<SessionTaskQuesModel> = await con.Query(
      `
        SELECT * FROM class_task_ques WHERE class_task_pk=@class_task_pk
        `,
      {
        class_task_pk: class_task_pk,
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

const getSingleClassTaskQues = async (
  task_ques_pk: number
): Promise<ResponseModel> => {
  const con = await DatabaseConnection();
  try {
    await con.BeginTransaction();

    const data: Array<SessionTaskQuesModel> = await con.Query(
      `
          SELECT * FROM class_task_ques WHERE task_ques_pk=@task_ques_pk
          `,
      {
        task_ques_pk: task_ques_pk,
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

const addClassTaskQues = async (
  payload: SessionTaskQuesModel
): Promise<ResponseModel> => {
  const con = await DatabaseConnection();
  try {
    await con.BeginTransaction();

    const sql_add_task = await con.Modify(
      `INSERT class_task_ques SET
       class_task_pk=@class_task_pk,
       question=@question,
       cor_answer=@cor_answer,
       pnt=@pnt;
       `,
      payload
    );

    if (sql_add_task > 0) {
      con.Commit();
      return {
        success: true,
        message: `The task has been added successfully.`,
      };
    } else {
      con.Rollback();
      return {
        success: false,
        message: `There were no affected rows in the process!`,
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

const updateClassTaskQues = async (
  payload: SessionTaskQuesModel
): Promise<ResponseModel> => {
  const con = await DatabaseConnection();
  try {
    await con.BeginTransaction();

    const sql_update_task = await con.Modify(
      `UPDATE  class_task_ques SET
       question=@question,
       cor_answer=@cor_answer,
       pnt=@pnt
       WHERE task_ques_pk=@task_ques_pk;
       `,
      payload
    );

    if (sql_update_task > 0) {
      con.Commit();
      return {
        success: true,
        message: `The task has been updated successfully.`,
      };
    } else {
      con.Rollback();
      return {
        success: false,
        message: `There were no affected rows in the process!`,
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

//class task submissions

const getAllClassTaskSub = async (
  class_task_pk: number,
  user_pk: number
): Promise<ResponseModel> => {
  const con = await DatabaseConnection();
  try {
    await con.BeginTransaction();

    const data: Array<SessionTaskQuesModel & SessionTaskSubModel> =
      await con.Query(
        `
        SELECT question, pnt, task_ques_pk, class_task_pk FROM class_task_ques  WHERE class_task_pk = @class_task_pk;
          `,
        {
          class_task_pk: class_task_pk,
        }
      );

    let entity: Array<SessionTaskQuesModel & SessionTaskSubModel> = [];

    if (data?.length > 0) {
      for (let sub of data) {
        const fileSub: SessionTaskSubFileModel = await con.QuerySingle(
          `SELECT * FROM class_task_sub_file WHERE class_task_pk=@class_task_pk limit 1`,
          {
            class_task_pk: sub.class_task_pk,
          }
        );

        const studentSubmit: SessionTaskSubModel = await con.QuerySingle(
          `SELECT task_sub_pk,task_ques_pk,student_pk,answered_at,is_correct, answer, tutor_comment FROM class_task_sub WHERE task_ques_pk = @task_ques_pk AND student_pk=(SELECT student_pk FROM students WHERE user_id=@user_pk LIMIT 1) LIMIT 1`,
          {
            task_ques_pk: sub.task_ques_pk,
            user_pk: user_pk,
          }
        );

        entity.push({
          ...sub,
          task_sub_pk: studentSubmit?.task_sub_pk,
          student_pk: studentSubmit?.student_pk,
          answered_at: studentSubmit?.answered_at,
          answer: studentSubmit?.answer,
          is_correct: studentSubmit?.is_correct,
          tutor_comment: studentSubmit?.tutor_comment ?? ``,
          stu_ans_file_loc: fileSub?.stu_ans_file_loc,
          tut_file_loc: fileSub?.tut_file_loc,
        });

        // console.log(`getAllClassTaskSub sub ${class_task_pk}`, sub);
      }
    } else {
      const fileSub: SessionTaskSubFileModel = await con.QuerySingle(
        `SELECT * FROM class_task_sub_file WHERE class_task_pk=@class_task_pk limit 1`,
        {
          class_task_pk: class_task_pk,
        }
      );

      entity.push({
        stu_ans_file_loc: fileSub?.stu_ans_file_loc,
        tut_file_loc: fileSub?.tut_file_loc,
      });
    }

    con.Commit();
    return {
      success: true,
      data: entity,
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

const getAllStudentsSubmit = async (
  class_task_pk: number
): Promise<ResponseModel> => {
  const con = await DatabaseConnection();
  try {
    await con.BeginTransaction();

    const task_sub: Array<SessionTaskSubModel> = await con.Query(
      `
      SELECT s.*,q.class_task_pk FROM class_task_sub s  JOIN class_task_ques q
      ON s.task_ques_pk = q.task_ques_pk WHERE q.class_task_pk =@class_task_pk GROUP BY q.class_task_pk,s.student_pk;
          `,
      {
        class_task_pk: class_task_pk,
      }
    );

    // console.log(`getAllStudentsSubmit`, getAllStudentsSubmit);

    if (task_sub?.length > 0) {
      for (let sub of task_sub) {
        const fileSub: SessionTaskSubFileModel = await con.QuerySingle(
          `SELECT * FROM class_task_sub_file WHERE class_task_pk=@class_task_pk AND student_pk=@student_pk limit 1 `,
          {
            class_task_pk: class_task_pk,
            student_pk: sub.student_pk,
          }
        );

        const student: StudentModel = await con.QuerySingle(
          `SELECT * FROM students WHERE student_pk=@student_pk limit 1`,
          {
            student_pk: sub.student_pk,
          }
        );

        student.picture = await GetUploadedImage(student.picture);
        sub.student = student;

        console.log(`class_task_pk`, class_task_pk);

        sub.questions = await con.Query(
          `SELECT s.*,q.cor_answer,q.question,q.pnt FROM class_task_sub s  JOIN class_task_ques q
          ON s.task_ques_pk = q.task_ques_pk WHERE q.class_task_pk=@class_task_pk AND s.student_pk=@student_pk ;`,
          {
            class_task_pk: class_task_pk,
            student_pk: sub.student_pk,
            // task_ques_pk: sub.task_ques_pk,
          }
        );

        sub.stu_ans_file_loc = fileSub?.stu_ans_file_loc;
        sub.tut_file_loc = fileSub?.tut_file_loc;
      }
    } else {
      const fileSub: SessionTaskSubFileModel[] = await con.Query(
        `SELECT * FROM class_task_sub_file WHERE class_task_pk=@class_task_pk limit 1 `,
        {
          class_task_pk: class_task_pk,
        }
      );

      const task_subs: SessionTaskSubModel[] = [];

      for (const sub of fileSub) {
        console.log(`sub`, sub);
        const student: StudentModel = await con.QuerySingle(
          `SELECT * FROM students WHERE student_pk=@student_pk limit 1`,
          {
            student_pk: sub.student_pk,
          }
        );

        student.picture = await GetUploadedImage(student.picture);

        task_subs.push({
          student: student,
          class_task_pk: sub.class_task_pk,
          stu_ans_file_loc: sub?.stu_ans_file_loc,
          tut_file_loc: sub?.tut_file_loc,
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
  } catch (error) {
    await con.Rollback();
    console.error(`error`, error);
    return {
      success: false,
      message: ErrorMessage(error),
    };
  }
};

const updateTaskSub = async (
  payload: Array<SessionTaskSubModel>
): Promise<ResponseModel> => {
  const con = await DatabaseConnection();
  try {
    await con.BeginTransaction();

    for (const sub of payload) {
      console.log(`update task sub`, sub);
      const sql_update_sub = await con.Modify(
        `  UPDATE class_task_sub  SET
        is_correct = @is_correct,
        tutor_comment = @tutor_comment
        WHERE task_sub_pk=@task_sub_pk ;
              `,
        {
          task_sub_pk: sub.task_sub_pk,
          is_correct: sub?.is_correct ?? "n",
          tutor_comment: sub?.tutor_comment ?? ``,
        }
      );
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
  } catch (error) {
    await con.Rollback();
    console.error(`error`, error);
    return {
      success: false,
      message: ErrorMessage(error),
    };
  }
};

const addClassTaskSub = async (
  payload: Array<SessionTaskSubModel>,
  user_pk: number
): Promise<ResponseModel> => {
  const con = await DatabaseConnection();
  try {
    await con.BeginTransaction();

    // const sudent_result = await con.QuerySingle(
    //   `SELECT student_pk FROM students WHERE user_id=@user_id limit 1`,
    //   {
    //     user_id: user_id,
    //   }
    // );

    for (const sub of payload) {
      sub.user_pk = user_pk;

      const existingSub: any = await con.QuerySingle(
        `SELECT COUNT(*) as total FROM class_task_sub WHERE task_ques_pk=@task_ques_pk AND student_pk=(SELECT student_pk FROM students WHERE user_id=@user_pk LIMIT 1) limit 1`,
        {
          task_ques_pk: sub?.task_ques_pk,
          user_pk: sub?.user_pk,
        }
      );

      console.log(`sub`, sub, existingSub);

      if (existingSub?.total > 0) {
        const sql_update_sub = await con.Modify(
          `UPDATE class_task_sub SET
                student_pk=(SELECT student_pk FROM students WHERE user_id=@user_pk LIMIT 1),
                task_ques_pk=@task_ques_pk,
                answer=@answer WHERE task_sub_pk = @task_sub_pk ;
                `,
          sub
        );
        if (sql_update_sub < 1) {
          con.Rollback();
          return {
            success: true,
            message: `Your work has been submitted successfully.`,
          };
        }
      } else {
        const sql_add_sub = await con.Insert(
          `INSERT INTO class_task_sub SET
                student_pk=(SELECT student_pk FROM students WHERE user_id=@user_pk LIMIT 1),
                task_ques_pk=@task_ques_pk,
                answer=@answer;
                ;`,
          sub
        );
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
  } catch (error) {
    await con.Rollback();
    console.error(`error`, error);
    return {
      success: false,
      message: ErrorMessage(error),
    };
  }
};

const addClassTaskFileSub = async (
  payload: SessionTaskSubFileModel,
  student_pk: number,
  file: any
): Promise<ResponseModel> => {
  const con = await DatabaseConnection();
  try {
    await con.BeginTransaction();

    const file_res = await UploadFile("src/Storage/Files/Materials/", file);
    if (!file_res.success) {
      con.Rollback();
      return file_res;
    }

    payload = {
      ...payload,
      student_pk: student_pk,
      tut_file_loc: ``,
      stu_ans_file_loc: ``,
    };

    if (payload.submit_type == `tutor`) {
      payload.tut_file_loc = file_res.data;
    } else {
      payload.stu_ans_file_loc = file_res.data;
    }

    console.log(`payload addClassTaskFileSub`, payload);
    // payload = {
    //   ...payload,
    //   student_pk: student_pk,
    // };

    var existingRecord = await con.QuerySingle(
      `SELECT * from class_task_sub_file where class_task_pk=@class_task_pk limit 1;`,
      {
        class_task_pk: payload.class_task_pk,
      }
    );

    if (existingRecord == null) {
      if (payload.submit_type == `tutor`) {
        await con.Insert(
          `INSERT INTO class_task_sub_file SET
                student_pk=(SELECT student_pk FROM students WHERE user_id=@student_pk LIMIT 1),
                class_task_pk=@class_task_pk,
                tut_file_loc=@tut_file_loc;`,
          payload
        );
      } else {
        await con.Insert(
          `INSERT INTO class_task_sub_file SET
                student_pk=(SELECT student_pk FROM students WHERE user_id=@student_pk LIMIT 1),
                class_task_pk=@class_task_pk,
                stu_ans_file_loc=@stu_ans_file_loc;`,
          payload
        );
      }
    } else {
      if (payload.submit_type == `tutor`) {
        await con.Modify(
          `UPDATE class_task_sub_file SET
                tut_file_loc=@tut_file_loc
                WHERE class_task_pk=@class_task_pk ;`,
          payload
        );
      } else {
        await con.Modify(
          `UPDATE class_task_sub_file SET
                student_pk=(SELECT student_pk FROM students WHERE user_id=@student_pk LIMIT 1),
                stu_ans_file_loc=@stu_ans_file_loc
                WHERE class_task_pk=@class_task_pk ;`,
          payload
        );
      }
    }

    con.Commit();
    return {
      success: true,
      message: `Your work has been submitted successfully.`,
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
