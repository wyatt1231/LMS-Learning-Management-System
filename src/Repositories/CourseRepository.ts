import { DatabaseConnection } from "../Configurations/DatabaseConfig";
import { ErrorMessage } from "../Hooks/useErrorMessage";
import { GetUploadedImage, UploadImage } from "../Hooks/useFileUploader";
import { GenerateSearch } from "../Hooks/useSearch";
import { isValidPicture } from "../Hooks/useValidator";
import { CourseModel } from "../Models/CourseModel";
import { PaginationModel } from "../Models/PaginationModel";
import { ResponseModel } from "../Models/ResponseModel";

const addCourse = async (
  payload: CourseModel,
  user_id: string
): Promise<ResponseModel> => {
  const con = await DatabaseConnection();
  try {
    await con.BeginTransaction();

    payload.encoder_pk = parseInt(user_id);

    if (isValidPicture(payload.picture)) {
      const upload_result = await UploadImage({
        base_url: "./src/Storage/Files/Images/",
        extension: "jpg",
        file_name: "course",
        file_to_upload: payload.picture,
      });

      if (upload_result.success) {
        payload.picture = upload_result.data;
      } else {
        return upload_result;
      }
    }

    const sql_insert_room = await con.Insert(
      `
        INSERT INTO courses SET
        course_desc=@course_desc,
        est_duration=@est_duration,
        picture=@picture,
        notes=@notes,
        encoder_pk=@encoder_pk;
        `,
      payload
    );

    if (sql_insert_room.insertedId > 0) {
      con.Commit();
      return {
        success: true,
        message: "The item has been added successfully",
      };
    } else {
      con.Rollback();
      return {
        success: false,
        message: "There were no rows affected while inserting the new record.",
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

const updateCourse = async (
  payload: CourseModel,
  user_id: string
): Promise<ResponseModel> => {
  const con = await DatabaseConnection();
  try {
    await con.BeginTransaction();

    payload.encoder_pk = parseInt(user_id);

    if (isValidPicture(payload.picture)) {
      const upload_result = await UploadImage({
        base_url: "./src/Storage/Files/Images/",
        extension: "jpg",
        file_name: "course",
        file_to_upload: payload.picture,
      });

      if (upload_result.success) {
        payload.picture = upload_result.data;
        const sql_update_course_pic = await con.Modify(
          `
            UPDATE course set
            picture=@picture,
            WHERE
            course_pk=@course_pk;
          `,
          payload
        );

        if (sql_update_course_pic < 1) {
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

    const sql_update_course = await con.Modify(
      `
        UPDATE courses SET
        course_desc=@course_desc,
        est_duration=@est_duration,
        notes=@notes,
        encoder_pk=@encoder_pk,
        WHERE
        course_pk=@course_pk;
          `,
      payload
    );

    if (sql_update_course > 0) {
      con.Commit();
      return {
        success: true,
        message: "The item has been updated successfully",
      };
    } else {
      con.Rollback();
      return {
        success: false,
        message: "There were no rows affected while updating the new record.",
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

const getCourseDataTable = async (
  pagination_payload: PaginationModel
): Promise<ResponseModel> => {
  const con = await DatabaseConnection();
  try {
    await con.BeginTransaction();

    const data: Array<CourseModel> = await con.QueryPagination(
      `SELECT * FROM courses
      WHERE
      course_desc like concat('%',@search,'%')
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

    for (const course of data) {
      course.picture = await GetUploadedImage(course.picture);
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

const getSingleCourse = async (course_pk: string): Promise<ResponseModel> => {
  const con = await DatabaseConnection();
  try {
    await con.BeginTransaction();

    const data: CourseModel = await con.QuerySingle(
      `select * from courses where course_pk = @course_pk`,
      {
        course_pk: course_pk,
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

const getCourseDuration = async (course_pk: string): Promise<ResponseModel> => {
  const con = await DatabaseConnection();
  try {
    await con.BeginTransaction();

    const data: CourseModel = await con.QuerySingle(
      `select est_duration from courses where course_pk = @course_pk limit 1`,
      {
        course_pk: course_pk,
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

const searchCourse = async (search: string): Promise<ResponseModel> => {
  const con = await DatabaseConnection();
  try {
    await con.BeginTransaction();

    const data = await con.Query(
      `select course_pk id, course_desc label from courses
       ${GenerateSearch(search, "course_desc")}
      `,
      {
        search,
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

export default {
  addCourse,
  updateCourse,
  getCourseDataTable,
  getSingleCourse,
  searchCourse,
  getCourseDuration,
};
