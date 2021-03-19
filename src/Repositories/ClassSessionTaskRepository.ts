import { DatabaseConnection } from "../Configurations/DatabaseConfig";
import { parseInvalidDateTimeToDefault } from "../Hooks/useDateParser";
import { ErrorMessage } from "../Hooks/useErrorMessage";
import { GetUploadedImage } from "../Hooks/useFileUploader";
import { ClassSessionModel } from "../Models/ClassSessionModel";
import {
  SessionTaskModel,
  SessionTaskQuesModel,
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
  payload: SessionTaskModel
): Promise<ResponseModel> => {
  const con = await DatabaseConnection();
  try {
    await con.BeginTransaction();

    payload.due_date = parseInvalidDateTimeToDefault(payload.due_date);

    const sql_add_task = await con.Insert(
      `INSERT INTO class_tasks SET
        class_pk=@class_pk,
        task_title=@task_title,
        task_desc=@task_desc,
        due_date=@due_date,
        encoder_pk=@encoder_pk;`,
      payload
    );

    if (sql_add_task.affectedRows > 0) {
      for (const ques of payload.questions) {
        ques.class_task_pk = sql_add_task.insertedId;
        const sql_add_ques = await con.Insert(
          `INSERT INTO class_task_ques SET
          class_task_pk=@class_task_pk,
          question=@question,
          cor_answer=@cor_answer,
          pnt=@pnt;`,
          ques
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
  payload: SessionTaskModel
): Promise<ResponseModel> => {
  const con = await DatabaseConnection();
  try {
    await con.BeginTransaction();

    payload.due_date = parseInvalidDateTimeToDefault(payload.due_date);

    console.log(`payload`, payload);
    const sql_update_task = await con.Modify(
      `UPDATE  class_tasks SET
            task_title=@task_title,
            task_desc=@task_desc,
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
  class_task_pk: number
): Promise<ResponseModel> => {
  const con = await DatabaseConnection();
  try {
    await con.BeginTransaction();

    const data: Array<
      SessionTaskQuesModel & SessionTaskSubModel
    > = await con.Query(
      `
        SELECT s.*, q.question,q.pnt,q.task_ques_pk,q.class_task_pk  FROM class_task_sub s RIGHT JOIN
        class_task_ques q ON s.task_ques_pk = q.task_ques_pk
        WHERE q.class_task_pk =@class_task_pk
          `,
      {
        class_task_pk: class_task_pk,
      }
    );

    console.log(`data`, data);

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

const getAllStudentsSubmit = async (
  class_task_pk: number
): Promise<ResponseModel> => {
  const con = await DatabaseConnection();
  try {
    await con.BeginTransaction();

    const task_sub: Array<SessionTaskSubModel> = await con.Query(
      `
      SELECT s.* FROM class_task_sub s  JOIN class_task_ques q
      ON s.task_ques_pk = q.task_ques_pk WHERE q.class_task_pk =@class_task_pk GROUP BY q.class_task_pk;
          `,
      {
        class_task_pk: class_task_pk,
      }
    );

    for (const sub of task_sub) {
      console.log(`sub -> `, sub.task_ques_pk);
      const student: StudentModel = await con.QuerySingle(
        `SELECT * FROM students WHERE student_pk=@student_pk limit 1`,
        {
          student_pk: sub.student_pk,
        }
      );

      student.picture = await GetUploadedImage(student.picture);
      sub.student = student;

      sub.questions = await con.Query(
        // `SELECT * FROM class_task_ques WHERE class_task_pk = @class_task_pk`,
        `SELECT s.*,q.cor_answer,q.question,q.pnt FROM class_task_sub s  JOIN class_task_ques q
        ON s.task_ques_pk = q.task_ques_pk WHERE q.class_task_pk=@class_task_pk;`,
        {
          class_task_pk: class_task_pk,
        }
      );
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
      const sql_update_sub = await con.Modify(
        `  UPDATE class_task_sub  SET
        is_correct = @is_correct WHERE task_sub_pk=@task_sub_pk ;
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
  student_pk: number
): Promise<ResponseModel> => {
  const con = await DatabaseConnection();
  try {
    await con.BeginTransaction();

    for (const sub of payload) {
      sub.student_pk = student_pk;

      if (sub.task_sub_pk) {
        const sql_update_sub = await con.Modify(
          `UPDATE class_task_sub SET
                student_pk=(SELECT student_pk FROM students WHERE user_id=@student_pk LIMIT 1),
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
                student_pk=(SELECT student_pk FROM students WHERE user_id=@student_pk LIMIT 1),
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
};
