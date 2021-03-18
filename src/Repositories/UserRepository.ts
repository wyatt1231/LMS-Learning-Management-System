import { DatabaseConnection } from "../Configurations/DatabaseConfig";
import { ErrorMessage } from "../Hooks/useErrorMessage";
import { GetUploadedImage } from "../Hooks/useFileUploader";
import { CreateToken } from "../Hooks/useJwt";
import { ResponseModel } from "../Models/ResponseModel";
import { UserClaims, UserLogin } from "../Models/UserModel";

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
