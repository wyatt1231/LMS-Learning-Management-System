import { SharedReducerModel, SharedReducerTypes } from "../Types/SharedTypes";

const defaultState: SharedReducerModel = {};

const SharedReducer = (
  state: SharedReducerModel = defaultState,
  action: SharedReducerTypes
): SharedReducerModel => {
  switch (action.type) {
    case "selected_tutor_rate": {
      return {
        ...state,
        selected_tutor_rate: action.selected_tutor_rate,
      };
    }

    default:
      return state;
  }
};

export default SharedReducer;
