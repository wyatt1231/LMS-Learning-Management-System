import { DatabaseConnection } from "../Configurations/DatabaseConfig";
import { ErrorMessage } from "../Hooks/useErrorMessage";
import { UploadFile } from "../Hooks/useFileUploader";
import { ClassMaterialModel } from "../Models/ClassMaterialModel";
import { ResponseModel } from "../Models/ResponseModel";

const addClassMaterial = async (
  payload: ClassMaterialModel,
  user_pk: number,
  file: any
): Promise<ResponseModel> => {
  const con = await DatabaseConnection();
  try {
    await con.BeginTransaction();

    payload.encoder_pk = user_pk;
    const file_res = await UploadFile("src/Storage/Files/Materials/", file);
    if (!file_res.success) {
      con.Rollback();
      return file_res;
    }

    payload.location = file_res.data;
    const sql_add_material = await con.Insert(
      `INSERT INTO class_materials SET
      class_pk=@class_pk,
      location=@location,
      descrip=@descrip,
      encoder_pk=@encoder_pk;
      `,
      payload
    );

    if (sql_add_material.insertedId > 0) {
      con.Commit();
      return {
        success: true,
        message: "The class material has been added successfully!",
      };
    } else {
      con.Rollback();
      return {
        success: false,
        message:
          "The were no rows affected when trying to add the class material!",
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

const deleteClassMaterial = async (mat_pk: number): Promise<ResponseModel> => {
  const con = await DatabaseConnection();
  try {
    await con.BeginTransaction();

    const sql_delete_material = await con.Modify(
      `DELETE FROM class_materials 
      where mat_pk =@mat_pk;
      `,
      { mat_pk: mat_pk }
    );

    if (sql_delete_material > 0) {
      con.Commit();
      return {
        success: true,
        message: "The class material has been deleted successfully!",
      };
    } else {
      con.Rollback();
      return {
        success: false,
        message:
          "The were no rows affected when trying to delete the class material!",
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

const getTblClassMaterial = async (
  class_pk: number
): Promise<ResponseModel> => {
  const con = await DatabaseConnection();
  try {
    await con.BeginTransaction();

    const data: Array<ClassMaterialModel> = await con.Query(
      `
        SELECT cm.*,sm.sts_color,sm.sts_bgcolor,u.fullname encoder_name FROM class_materials cm
        LEFT JOIN status_master sm ON cm.sts_pk = sm.sts_pk
        LEFT JOIN users u ON u.user_id = cm.encoder_pk where class_pk=@class_pk
        `,
      { class_pk: class_pk }
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
  addClassMaterial,
  getTblClassMaterial,
  deleteClassMaterial,
};
