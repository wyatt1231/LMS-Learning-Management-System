"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const DatabaseConfig_1 = require("../Configurations/DatabaseConfig");
const useErrorMessage_1 = require("../Hooks/useErrorMessage");
const useFileUploader_1 = require("../Hooks/useFileUploader");
const addClassMaterial = (payload, user_pk, file) => __awaiter(void 0, void 0, void 0, function* () {
    const con = yield (0, DatabaseConfig_1.DatabaseConnection)();
    try {
        yield con.BeginTransaction();
        payload.encoder_pk = user_pk;
        const file_res = yield (0, useFileUploader_1.UploadFile)("src/Storage/Files/Materials/", file);
        if (!file_res.success) {
            con.Rollback();
            return file_res;
        }
        payload.location = file_res.data;
        const sql_add_material = yield con.Insert(`INSERT INTO class_materials SET
      class_pk=@class_pk,
      location=@location,
      descrip=@descrip,
      encoder_pk=@encoder_pk;
      `, payload);
        if (sql_add_material.insertedId > 0) {
            con.Commit();
            return {
                success: true,
                message: "The class material has been added successfully!",
            };
        }
        else {
            con.Rollback();
            return {
                success: false,
                message: "The were no rows affected when trying to add the class material!",
            };
        }
    }
    catch (error) {
        yield con.Rollback();
        console.error(`error`, error);
        return {
            success: false,
            message: (0, useErrorMessage_1.ErrorMessage)(error),
        };
    }
});
const deleteClassMaterial = (mat_pk) => __awaiter(void 0, void 0, void 0, function* () {
    const con = yield (0, DatabaseConfig_1.DatabaseConnection)();
    try {
        yield con.BeginTransaction();
        const sql_delete_material = yield con.Modify(`DELETE FROM class_materials 
      where mat_pk =@mat_pk;
      `, { mat_pk: mat_pk });
        if (sql_delete_material > 0) {
            con.Commit();
            return {
                success: true,
                message: "The class material has been deleted successfully!",
            };
        }
        else {
            con.Rollback();
            return {
                success: false,
                message: "The were no rows affected when trying to delete the class material!",
            };
        }
    }
    catch (error) {
        yield con.Rollback();
        console.error(`error`, error);
        return {
            success: false,
            message: (0, useErrorMessage_1.ErrorMessage)(error),
        };
    }
});
const getTblClassMaterial = (class_pk) => __awaiter(void 0, void 0, void 0, function* () {
    const con = yield (0, DatabaseConfig_1.DatabaseConnection)();
    try {
        yield con.BeginTransaction();
        const data = yield con.Query(`
        SELECT cm.*,sm.sts_color,sm.sts_bgcolor,u.fullname encoder_name FROM class_materials cm
        LEFT JOIN status_master sm ON cm.sts_pk = sm.sts_pk
        LEFT JOIN users u ON u.user_id = cm.encoder_pk where class_pk=@class_pk
        `, { class_pk: class_pk });
        con.Commit();
        return {
            success: true,
            data: data,
        };
    }
    catch (error) {
        yield con.Rollback();
        console.error(`error`, error);
        return {
            success: false,
            message: (0, useErrorMessage_1.ErrorMessage)(error),
        };
    }
});
exports.default = {
    addClassMaterial,
    getTblClassMaterial,
    deleteClassMaterial,
};
//# sourceMappingURL=ClassMaterialRepository.js.map