import { DatabaseConnection } from "../Configurations/DatabaseConfig";
import { parseInvalidDateToDefault } from "../Hooks/useDateParser";
import { ErrorMessage } from "../Hooks/useErrorMessage";
import { GetUploadedImage, UploadImage } from "../Hooks/useFileUploader";
import { GenerateSearch } from "../Hooks/useSearch";
import { isValidPicture } from "../Hooks/useValidator";
import { PaginationModel } from "../Models/PaginationModel";
import { ResponseModel } from "../Models/ResponseModel";
import { TutorFavModel } from "../Models/TutorFavModel";
import { TutorModel } from "../Models/TutorModel";
import { TutorRatingsModel } from "../Models/TutorRatingModel";
import { UserModel } from "../Models/UserModel";

const addTutor = async (
  params: TutorModel,
  user_id: string
): Promise<ResponseModel> => {
  const con = await DatabaseConnection();
  try {
    await con.BeginTransaction();

    const user_param: UserModel = {
      fullname: `${params.lastname}, ${params.firstname}`,
      username: params.email,
      password: `mymentor`,
      user_type: "tutor",
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
      if (
        typeof params.picture !== "undefined" &&
        params.picture !== "" &&
        params.picture !== null
      ) {
        const upload_result = await UploadImage({
          base_url: "./src/Storage/Files/Images/",
          extension: "jpg",
          file_name: sql_insert_user.insertedId,
          file_to_upload: params.picture,
        });

        if (upload_result.success) {
          params.picture = upload_result.data.toString();
        } else {
          return upload_result;
        }
      }

      const tutor_payload: TutorModel = {
        ...params,
        username: params.email,
        user_id: sql_insert_user.insertedId,
        encoder_pk: user_id,
        birth_date: parseInvalidDateToDefault(params.birth_date),
      };

      const sql_insert_tutor = await con.Insert(
        `
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
        `,
        tutor_payload
      );

      if (sql_insert_tutor.insertedId > 0) {
        con.Commit();
        return {
          success: true,
          message: "The tutor has been created successfully",
        };
      } else {
        con.Rollback();
        return {
          success: false,
          message:
            "Server error has occured. Tutor creation process was not successful.",
        };
      }
    } else {
      con.Rollback();
      return {
        success: false,
        message:
          "Server error has occured. User creation process was not successful.",
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

const updateTutor = async (
  tutor_payload: TutorModel,
  user_id: string
): Promise<ResponseModel> => {
  const con = await DatabaseConnection();
  try {
    await con.BeginTransaction();

    tutor_payload.encoder_pk = user_id;

    const sql_update_tutor = await con.Modify(
      `
        UPDATE tutors SET
        position=@position,
        firstname=@firstname,
        middlename=@middlename,
        lastname=@lastname,
        suffix=@suffix,
        birth_date=@birth_date,
        email=@email,
        mob_no=@mob_no,
        gender=@gender,
        encoder_pk=@encoder_pk
        WHERE tutor_pk=@tutor_pk;
        `,
      tutor_payload
    );

    if (sql_update_tutor > 0) {
      const audit_log = await con.Insert(
        `insert into audit_log set 
        user_pk=@user_pk,
        activity=@activity;
        `,
        {
          user_pk: tutor_payload.user_id,
          activity: `updated tutor ${tutor_payload.firstname} ${tutor_payload.lastname}`,
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
        message: "The tutor information has been updated successfully",
      };
    } else {
      con.Rollback();
      return {
        success: true,
        message: "Server error has occured. The process was unsuccessful.",
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

const updateTutorImage = async (
  payload: TutorModel
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
            UPDATE tutors set
            picture=@picture
            WHERE
            tutor_pk=@tutor_pk;
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

const toggleActiveStatus = async (
  tutor_pk: number,
  user_pk: number
): Promise<ResponseModel> => {
  const con = await DatabaseConnection();
  try {
    await con.BeginTransaction();
    console.log(`tutor_pk`, tutor_pk);

    const tutor_active_status = await con.QuerySingle(
      `
    select is_active from tutors where tutor_pk = @tutor_pk;
    `,
      {
        tutor_pk: tutor_pk,
      }
    );

    const res_update_tutor_sts = await con.Modify(
      `
        UPDATE tutors SET
        is_active=@is_active
        WHERE tutor_pk=@tutor_pk;
        `,
      {
        is_active: tutor_active_status.is_active === "y" ? "n" : "y",
        tutor_pk: tutor_pk,
      }
    );

    if (res_update_tutor_sts > 0) {
      const audit_log = await con.Insert(
        `insert into audit_log set 
        user_pk=@user_pk,
        activity=@activity;
        `,
        {
          user_pk: user_pk,
          activity: `${
            tutor_active_status.is_active === "y" ? "deactivated" : "activated"
          } tutor status`,
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
        message: "The tutor information has been updated successfully",
      };
    } else {
      con.Rollback();
      return {
        success: true,
        message: "Server error has occured. The process was unsuccessful.",
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

const getTutorDataTable = async (
  pagination_payload: PaginationModel
): Promise<ResponseModel> => {
  const con = await DatabaseConnection();
  try {
    await con.BeginTransaction();

    const data: Array<TutorModel> = await con.QueryPagination(
      `SELECT * FROM tutors
      WHERE
      is_dummy = 'n' AND
      (firstname like concat('%',@search,'%')
      OR lastname like concat('%',@search,'%')
      OR email like concat('%',@search,'%')
      OR mob_no like concat('%',@search,'%')
      OR position like concat('%',@search,'%'))
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

    for (const tutor of data) {
      const pic = await GetUploadedImage(tutor.picture);
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
  } catch (error) {
    await con.Rollback();
    console.error(`error`, error);
    return {
      success: false,
      message: ErrorMessage(error),
    };
  }
};

const getSingleTutor = async (tutor_pk: string): Promise<ResponseModel> => {
  const con = await DatabaseConnection();
  try {
    await con.BeginTransaction();

    const data: TutorModel = await con.QuerySingle(
      `select *,
      (SELECT SUM(rating)/COUNT(rating) FROM tutor_ratings WHERE tutor_pk = @tutor_pk) as average_rating
      from tutors where tutor_pk = @tutor_pk`,
      {
        tutor_pk,
      }
    );

    data.picture = await GetUploadedImage(data.picture);

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

const getSingTutorToStudent = async (
  tutor_pk: number,
  user_pk: number
): Promise<ResponseModel> => {
  const con = await DatabaseConnection();
  try {
    await con.BeginTransaction();

    const data: TutorModel = await con.QuerySingle(
      `select * from tutors where tutor_pk = @tutor_pk`,
      {
        tutor_pk,
      }
    );

    data.picture = await GetUploadedImage(data.picture);

    const favorited = await con.QuerySingle(
      `
    select is_fav from tutor_fav where student_pk = (select student_pk from students where user_id=@user_pk limit 1) and tutor_pk=@tutor_pk
    `,
      {
        tutor_pk: tutor_pk,
        user_pk: user_pk,
      }
    );

    console.log(`favorited?.is_fav`, favorited?.is_fav);

    if (favorited?.is_fav) {
      data.favorited = favorited?.is_fav;
    } else {
      data.favorited = "n";
    }

    const rating = await con.QuerySingle(
      `
    select rating from tutor_ratings where student_pk = (select student_pk from students where user_id=@user_pk limit 1) and tutor_pk=@tutor_pk
    `,
      {
        tutor_pk: tutor_pk,
        user_pk: user_pk,
      }
    );

    if (rating?.rating) {
      data.rating = rating?.rating;
    } else {
      data.rating = 0;
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

const searchTutor = async (search: string): Promise<ResponseModel> => {
  const con = await DatabaseConnection();
  try {
    await con.BeginTransaction();

    const data: any = await con.Query(
      `SELECT * FROM (select tutor_pk id, concat(firstname,' ',lastname) label,picture from tutors where is_dummy='n') tmp 
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

const getDummyTutors = async (user_pk: number): Promise<ResponseModel> => {
  const con = await DatabaseConnection();
  try {
    await con.BeginTransaction();

    const data: any = await con.Query(
      `
      SELECT tutor_pk,'${user_pk}' student_pk,picture,concat(firstname,' ',lastname) name,bio, 0 as rating FROM tutors WHERE is_dummy = 'y'
      `,
      null
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

const insertDummyTutorRatings = async (
  payload: Array<TutorRatingsModel>,
  user_pk: number
): Promise<ResponseModel> => {
  const con = await DatabaseConnection();
  try {
    await con.BeginTransaction();

    const sql_update_student = await con.Modify(
      `
      UPDATE students set rated_tutor=@rated_tutor where user_id=@user_id;
    `,
      { user_id: user_pk, rated_tutor: "y" }
    );

    if (sql_update_student < 1) {
      con.Rollback();
      return {
        success: false,
        message:
          "There were no rows affected when trying to update the student.",
      };
    }

    for (const tutor of payload) {
      tutor.encoded_by = user_pk;
      const sql_insert_tutor = await con.Insert(
        `
        INSERT INTO tutor_ratings SET
        tutor_pk=@tutor_pk,
        student_pk=@student_pk,
        rating=@rating,
        encoded_by=@encoded_by
          `,
        tutor
      );

      if (sql_insert_tutor.affectedRows < 1) {
        con.Rollback();
        return {
          success: false,
          message:
            "There were no rows affected when trying to save the tutor rating.",
        };
      }
    }

    con.Commit();
    return {
      success: true,
      message: "Your ratings has been saved successfully!",
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

const getTotalTutors = async (): Promise<ResponseModel> => {
  const con = await DatabaseConnection();
  try {
    await con.BeginTransaction();

    const res_sql_count = await con.QuerySingle(
      `select count(*) as total from tutors  WHERE is_active='y' and is_dummy='n';`,
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

//logged-in tutors
const getLoggedInTutor = async (user_pk: number): Promise<ResponseModel> => {
  const con = await DatabaseConnection();
  try {
    await con.BeginTransaction();

    const data: TutorModel = await con.QuerySingle(
      `select t.*,
      (SELECT SUM(rating)/COUNT(rating) FROM tutor_ratings WHERE tutor_pk = t.tutor_pk) as average_rating,
      (SELECT COUNT(tutor_pk) FROM tutor_fav WHERE  tutor_pk =t.tutor_pk) as fav_count
      from tutors t where user_id = @user_pk`,

      {
        user_pk,
      }
    );

    data.picture = await GetUploadedImage(data.picture);

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

const updateLoggedInTutorBio = async (
  payload: TutorModel
): Promise<ResponseModel> => {
  const con = await DatabaseConnection();
  try {
    await con.BeginTransaction();

    const res_update_tutor_bio = await con.Modify(
      `
      update tutors set bio=@bio where tutor_pk = @tutor_pk;
    `,
      payload
    );

    if (res_update_tutor_bio > 0) {
      const audit_log = await con.Insert(
        `insert into audit_log set 
        user_pk=@user_pk,
        activity=@activity;
        `,
        {
          user_pk: payload.user_id,
          activity: `updated his/her biography.`,
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
      return {
        success: false,
        message: `There were no affected rows when trying to update the tutor's biography!`,
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

const rateTutor = async (
  payload: TutorRatingsModel
): Promise<ResponseModel> => {
  const con = await DatabaseConnection();
  try {
    await con.BeginTransaction();

    const res_count_rating = await con.QuerySingle(
      `
    SELECT rate_pk FROM tutor_ratings WHERE tutor_pk =@tutor_pk AND student_pk =(select student_pk from students where user_id=@encoded_by limit 1);`,
      payload
    );

    if (res_count_rating?.rate_pk) {
      payload.rate_pk = res_count_rating.rate_pk;

      const sql_update_student = await con.Modify(
        `
        UPDATE tutor_ratings set rating=@rating where rate_pk=@rate_pk;
      `,
        payload
      );

      if (sql_update_student < 1) {
        con.Rollback();
        return {
          success: false,
          message: "There were no rows affected during the process.",
        };
      }
    } else {
      const sql_insert_rating = await con.Insert(
        `
        INSERT into tutor_ratings set rating=@rating,encoded_by=@encoded_by,student_pk=(select student_pk from students where user_id=@encoded_by limit 1),tutor_pk=@tutor_pk;
      `,
        payload
      );

      if (sql_insert_rating.insertedId < 1) {
        con.Rollback();
        return {
          success: false,
          message: "There were no rows affected during the process.",
        };
      }
    }

    const audit_log = await con.Insert(
      `insert into audit_log set 
      user_pk=@user_pk,
      activity=CONCAT('gave 5 ratings to tutor ',(select concat(firstname,' ',lastname) from tutors where tutor_pk=@tutor_pk limit 1));
      `,
      {
        user_pk: payload.encoded_by,
        tutor_pk: payload.tutor_pk,
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
      message: `The rating has been saved successfully!`,
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

const favoriteTutor = async (
  payload: TutorFavModel
): Promise<ResponseModel> => {
  const con = await DatabaseConnection();
  try {
    await con.BeginTransaction();

    const res_existing_fav = await con.QuerySingle(
      `
    SELECT tutor_fav_pk FROM tutor_fav WHERE tutor_pk =@tutor_pk AND student_pk =(select student_pk from students where user_id=@encoded_by limit 1);`,
      payload
    );

    if (res_existing_fav?.tutor_fav_pk) {
      payload.tutor_fav_pk = res_existing_fav.tutor_fav_pk;

      const sql_change_fav = await con.Modify(
        `
        UPDATE tutor_fav set is_fav=if(is_fav = 'y', 'n','y') where tutor_fav_pk=@tutor_fav_pk;
      `,
        payload
      );

      console.log(`updated`, payload.tutor_fav_pk);

      if (sql_change_fav < 1) {
        con.Rollback();
        return {
          success: false,
          message: "There were no rows affected during the process.",
        };
      }
    } else {
      const sql_insert_fav = await con.Insert(
        `
        INSERT into tutor_fav set is_fav='y',student_pk=(select student_pk from students where user_id=@encoded_by limit 1),tutor_pk=@tutor_pk;
      `,
        payload
      );

      if (sql_insert_fav.insertedId < 1) {
        con.Rollback();
        return {
          success: false,
          message: "There were no rows affected during the process.",
        };
      }
    }

    console.log(`fav`);

    const audit_log = await con.Insert(
      `insert into audit_log set 
      user_pk=@user_pk,
      activity=CONCAT('favorited tutor ',(select concat(firstname,' ',lastname) from tutors where tutor_pk=@tutor_pk limit 1));
      `,
      {
        user_pk: payload.encoded_by,
        tutor_pk: payload.tutor_pk,
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
      message: `The process has been executed successfully!`,
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

const getMostRatedTutors = async (): Promise<ResponseModel> => {
  const con = await DatabaseConnection();
  try {
    await con.BeginTransaction();

    const tutor_table: Array<TutorModel> = await con.Query(
      `
        SELECT * FROM 
        (
        SELECT *,
        COALESCE((SELECT  SUM(rating)/COUNT(*) FROM tutor_ratings WHERE tutor_pk = t.tutor_pk), 0) AS average_rating 
        FROM tutors t where t,is_dummy='n'
        ) tmp
        where average_rating > 0 
        ORDER BY average_rating DESC LIMIT 15
      `,
      null
    );

    for (const tutor of tutor_table) {
      tutor.picture = await GetUploadedImage(tutor.picture);
    }

    con.Commit();
    return {
      success: true,
      data: tutor_table,
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
  addTutor,
  updateTutor,
  getTutorDataTable,
  getSingleTutor,
  searchTutor,
  getDummyTutors,
  insertDummyTutorRatings,
  updateTutorImage, //new
  toggleActiveStatus,
  getTotalTutors,
  getLoggedInTutor,
  updateLoggedInTutorBio,
  rateTutor,
  favoriteTutor,
  getSingTutorToStudent,
  getMostRatedTutors,
};
