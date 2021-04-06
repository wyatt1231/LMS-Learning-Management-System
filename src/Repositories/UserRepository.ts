import { DatabaseConnection } from "../Configurations/DatabaseConfig";
import { ErrorMessage } from "../Hooks/useErrorMessage";
import { GetUploadedImage } from "../Hooks/useFileUploader";
import { CreateToken } from "../Hooks/useJwt";
import { AuditLogModel } from "../Models/AuditLogModel";
import { ResponseModel } from "../Models/ResponseModel";
import { UserClaims, UserLogin, UserModel } from "../Models/UserModel";

export const loginUser = async (payload: UserLogin): Promise<ResponseModel> => {
  const con = await DatabaseConnection();
  try {
    await con.BeginTransaction();

    const user: UserClaims | null = await con.QuerySingle(
      `SELECT user_id,user_type,allow_login FROM users u WHERE u.password = AES_ENCRYPT(@password,@username)`,
      payload
    );

    if (user) {
      if (user.allow_login === "n") {
        return {
          success: false,
          message:
            "You are not allowed to login with this account yet. This maybe because your account is not yet approved by the administrator.",
        };
      }

      const token = await CreateToken(user);
      if (token) {
        await con.Commit();

        return {
          success: true,
          message: "You have been logged in successfully",
          data: {
            user: user,
            token: token,
          },
        };
      } else {
        await con.Rollback();
        return {
          success: false,
          message: "The server was not able to create a token. ",
        };
      }
    } else {
      await con.Rollback();
      return {
        success: false,
        message: "Incorrent username and/or password.",
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

export const currentUser = async (user_id: string): Promise<ResponseModel> => {
  const con = await DatabaseConnection();
  try {
    await con.BeginTransaction();

    const updated_status: number = await con.Modify(
      `UPDATE users SET sts_pk='x' WHERE user_id = @user_id`,
      {
        user_id: user_id,
      }
    );

    if (updated_status > 0) {
      const user_data = await con.QuerySingle(
        `SELECT u.user_type,u.username, u.fullname, u.online_count,u.sts_pk FROM users u 
        where u.user_id = @user_id
        `,
        {
          user_id,
        }
      );

      if (user_data.user_type === "admin") {
        const sql_get_pic = await con.QuerySingle(
          `SELECT picture FROM administrators WHERE user_id=${user_id} LIMIT 1`,
          null
        );
        user_data.picture = await GetUploadedImage(sql_get_pic?.picture);
      } else if (user_data.user_type === "tutor") {
        const sql_get_pic = await con.QuerySingle(
          `SELECT picture FROM tutors WHERE user_id=${user_id} LIMIT 1`,
          null
        );
        user_data.picture = await GetUploadedImage(sql_get_pic?.picture);
      } else if (user_data.user_type === "student") {
        const sql_get_pic = await con.QuerySingle(
          `SELECT picture,rated_tutor FROM students WHERE user_id=${user_id} LIMIT 1`,
          null
        );
        user_data.picture = await GetUploadedImage(sql_get_pic?.picture);
        user_data.rated_tutor = sql_get_pic.rated_tutor;
      }

      await con.Commit();
      return {
        success: true,
        data: user_data,
      };
    } else {
      await con.Rollback();
      return {
        success: false,
        message:
          " An error occured while the process is executing. No user information has been found.",
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

const changeAdminPassword = async (
  payload: UserModel
): Promise<ResponseModel> => {
  const con = await DatabaseConnection();
  try {
    await con.BeginTransaction();

    const total_found_user: any = await con.QuerySingle(
      `
    SELECT COUNT(*) AS total FROM users WHERE password = AES_ENCRYPT(@old_password,username) AND user_id = @user_id LIMIT 1
    `,
      payload
    );

    console.log(`payload`, payload);
    console.log(`total_found_user`, total_found_user);

    if (total_found_user.total <= 0) {
      con.Rollback();
      return {
        success: false,
        message:
          "You must have entered an incorrect old password. Please try again!",
      };
    }

    const res_update_user = await con.Modify(
      `UPDATE users SET
       password = AES_ENCRYPT(@password,username)
       WHERE user_id =@user_id;`,
      payload
    );

    if (res_update_user > 0) {
      const res_audit_log = await con.Insert(
        `insert into audit_log set 
        user_pk=@user_pk,
        activity=@activity;
        `,
        {
          user_pk: payload.user_id,
          activity: `change password`,
        }
      );

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
    } else {
      con.Rollback();
      return {
        success: true,
        message: "The were no affected rows during the process!",
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

const getUserLogs = async (user_pk: number): Promise<ResponseModel> => {
  const con = await DatabaseConnection();
  try {
    await con.BeginTransaction();

    const res_tbl_audit_log: Array<AuditLogModel> = await con.Query(
      `
      select * from audit_log where user_pk=@user_pk order by encoded_at desc;
    `,
      {
        user_pk: user_pk,
      }
    );

    for (const log of res_tbl_audit_log) {
      log.user = await con.QuerySingle(
        `select * from vw_user_info where user_id=@user_id`,
        {
          user_id: log.user_pk,
        }
      );
    }

    con.Commit();
    return {
      success: true,
      data: res_tbl_audit_log,
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

const getAllLogs = async (): Promise<ResponseModel> => {
  const con = await DatabaseConnection();
  try {
    await con.BeginTransaction();

    const res_tbl_audit_log: Array<AuditLogModel> = await con.Query(
      `
      select * from audit_log order by encoded_at desc;
    `,
      {}
    );

    for (const log of res_tbl_audit_log) {
      log.user = await con.QuerySingle(
        `select * from vw_user_info where user_id=@user_id`,
        {
          user_id: log.user_pk,
        }
      );

      if (log.user) {
        log.user.picture = await GetUploadedImage(log.user.picture);
      } else {
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
  } catch (error) {
    await con.Rollback();
    console.error(`error ..`, error);
    return {
      success: false,
      message: ErrorMessage(error),
    };
  }
};

export default {
  changeAdminPassword,
  getUserLogs,
  getAllLogs,
};
