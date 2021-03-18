import {
  ClassMaterialReducerModel,
  ClassMaterialReducerTypes,
} from "../Types/ClassMaterialTypes";

const defaultState: ClassMaterialReducerModel = {
  fetch_class_material: false,
};

const ClassMaterialReducer = (
  state: ClassMaterialReducerModel = defaultState,
  action: ClassMaterialReducerTypes
): ClassMaterialReducerModel => {
  switch (action.type) {
    case "set_tbl_class_materials": {
      return {
        ...state,
        tbl_class_materials: action.tbl_class_materials,
      };
    }
    case "set_fetch_class_material": {
      return {
        ...state,
        fetch_class_material: action.fetch_class_material,
      };
    }

    default:
      return state;
  }
};

export default ClassMaterialReducer;
