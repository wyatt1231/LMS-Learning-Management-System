import { ClassMaterialModel } from "../Models/ClassMaterialModel";

export type ClassMaterialReducerTypes =
  | {
      type: "set_tbl_class_materials";
      tbl_class_materials: Array<ClassMaterialModel>;
    }
  | {
      type: "set_fetch_class_material";
      fetch_class_material: boolean;
    };

export interface ClassMaterialReducerModel {
  tbl_class_materials?: Array<ClassMaterialModel>;
  fetch_class_material: boolean;
}
