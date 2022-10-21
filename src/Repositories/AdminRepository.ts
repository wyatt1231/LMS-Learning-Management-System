import { DatabaseConnection } from "../Configurations/DatabaseConfig";
import { parseInvalidDateToDefault } from "../Hooks/useDateParser";
import { ErrorMessage } from "../Hooks/useErrorMessage";
import { GetUploadedImage, UploadImage } from "../Hooks/useFileUploader";
import { isValidPicture } from "../Hooks/useValidator";
import { AdminModel } from "../Models/AdminModel";
import { PaginationModel } from "../Models/PaginationModel";
import { ResponseModel } from "../Models/ResponseModel";
import { UserModel } from "../Models/UserModel";

const addAdmin = async (
  payload: AdminModel,
  user_id: string
): Promise<ResponseModel> => {
  const con = await DatabaseConnection();
  try {
    await con.BeginTransaction();

    const user_param: UserModel = {
      fullname: `${payload.lastname}, ${payload.firstname}`,
      username: payload.email,
      password: `mymentor`,
      user_type: "admin",
      encoder_pk: user_id,
    };

    const sql_insert_user = await con.Insert(
      `INSERT users SET
      username=@username,
      password=AES_ENCRYPT(@password,@username),
      user_type=@user_type,
      fullname=@fullname,
      encoder_pk=@encoder_pk;
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

      const admin_payload: AdminModel = {
        ...payload,
        user_id: sql_insert_user.insertedId,
        encoder_pk: user_id,
        birth_date: parseInvalidDateToDefault(payload.birth_date),
      };

      const sql_create_admin = await con.Insert(
        `INSERT INTO administrators SET
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
        encoder_pk=@encoder_pk;`,
        admin_payload
      );

      if (sql_create_admin.insertedId > 0) {
        con.Commit();
        return {
          success: true,
          message: "The item has been added successfully",
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

const updateAdmin = async (
  payload: AdminModel,
  user_id: string
): Promise<ResponseModel> => {
  const con = await DatabaseConnection();
  try {
    await con.BeginTransaction();

    if (isValidPicture(payload.picture)) {
      const upload_result = await UploadImage({
        base_url: "./src/Storage/Files/Images/",
        extension: "jpg",
        file_name: payload.user_id,
        file_to_upload: payload.picture,
      });

      if (upload_result.success) {
        payload.picture = upload_result.data;
        const sql_update_pic = await con.Modify(
          `
            UPDATE administrators set
            picture=@picture,
            WHERE
            admin_pk=@admin_pk;
          `,
          payload
        );

        if (sql_update_pic < 1) {
          con.Rollback();
          return {
            success: false,
            message: "There were no rows affected while updating the picture.",
          };
        }
      } else {
        return upload_result;
      }
    }

    payload.encoder_pk = user_id;

    const admin_updated_rows = await con.Modify(
      `UPDATE administrators SET
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
        ;`,
      payload
    );

    if (admin_updated_rows > 0) {
      con.Commit();
      return {
        success: true,
        message: "The administrator has been updated successfully!",
      };
    } else {
      con.Rollback();
      return {
        success: true,
        message: "The were no affected rows when updating the administrator!",
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

const getAdminDataTable = async (
  pagination_payload: PaginationModel
): Promise<ResponseModel> => {
  const con = await DatabaseConnection();
  try {
    await con.BeginTransaction();

    const data: Array<AdminModel> = await con.QueryPagination(
      `
      SELECT * FROM (SELECT *,CONCAT(firstname,' ',lastname) fullname FROM administrators) tmp
      WHERE 
      firstname like concat('%',@search,'%')
      OR lastname like concat('%',@search,'%')
      OR email like concat('%',@search,'%')
      OR mob_no like concat('%',@search,'%')
      OR position like concat('%',@search,'%')
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

    for (const admin of data) {
      const pic = await GetUploadedImage(admin.picture);
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
  } catch (error) {
    await con.Rollback();
    console.error(`error`, error);
    return {
      success: false,
      message: ErrorMessage(error),
    };
  }
};

const getSingleAdmin = async (admin_pk: string): Promise<ResponseModel> => {
  const con = await DatabaseConnection();
  try {
    await con.BeginTransaction();

    const data = await con.QuerySingle(
      `select * from administrators where admin_pk = @admin_pk`,
      {
        admin_pk,
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

const getLoggedAdmin = async (user_id: string): Promise<ResponseModel> => {
  const con = await DatabaseConnection();
  try {
    await con.BeginTransaction();

    console.log(`user`, user_id);

    const data: AdminModel = await con.QuerySingle(
      `select * from administrators where user_id = @user_id`,
      {
        user_id,
      }
    );

    console.log(`data`, data);

    if (!!data.picture) {
      data.picture = await GetUploadedImage(data.picture);
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

const updateAdminInfo = async (payload: AdminModel): Promise<ResponseModel> => {
  const con = await DatabaseConnection();
  try {
    await con.BeginTransaction();

    payload.birth_date = parseInvalidDateToDefault(payload.birth_date);

    const admin_updated_rows = await con.Modify(
      `UPDATE administrators SET
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
        ;`,
      payload
    );

    if (admin_updated_rows > 0) {
      const audit_log = await con.Insert(
        `insert into audit_log set 
        user_pk=@user_pk,
        activity=@activity;
        `,
        {
          user_pk: payload.user_id,
          activity: `updated profile information.`,
        }
      );

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

const updateAdminImage = async (
  payload: AdminModel
): Promise<ResponseModel> => {
  const con = await DatabaseConnection();
  try {
    await con.BeginTransaction();

    if (isValidPicture(payload.picture)) {
      const upload_result = await UploadImage({
        base_url: "./src/Storage/Files/Images/",
        extension: "jpg",
        file_name: payload.user_id,
        file_to_upload: payload.picture,
      });

      if (upload_result.success) {
        payload.picture = upload_result.data;
        const sql_update_pic = await con.Modify(
          `
            UPDATE administrators set
            picture=@picture
            WHERE
            admin_pk=@admin_pk;
          `,
          payload
        );

        if (sql_update_pic < 1) {
          con.Rollback();
          return {
            success: false,
            message: "There were no rows affected while updating the picture.",
          };
        }
      } else {
        return upload_result;
      }
    }

    const audit_log = await con.Insert(
      `insert into audit_log set 
      user_pk=@user_pk,
      activity=@activity;
      `,
      {
        user_pk: payload.user_id,
        activity: `updated profile picture.`,
      }
    );

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
  } catch (error) {
    await con.Rollback();
    console.error(`error`, error);
    return {
      success: false,
      message: ErrorMessage(error),
    };
  }
};

const getTotalAdmin = async (): Promise<ResponseModel> => {
  const con = await DatabaseConnection();
  try {
    await con.BeginTransaction();

    const res_sql_count = await con.QuerySingle(
      `select count(*) as total from administrators WHERE is_active='y';`,
      {}
    );

    con.Commit();
    return {
      success: true,
      data: res_sql_count.total,
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
  addAdmin,
  updateAdmin,
  getAdminDataTable,
  getSingleAdmin,
  updateAdminInfo,
  updateAdminImage,
  getLoggedAdmin,
  getTotalAdmin, //new
};
