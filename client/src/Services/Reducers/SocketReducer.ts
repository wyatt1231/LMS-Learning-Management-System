import { SocketReducerModel, SocketReducerTypes } from "../Types/SocketTypes";

const defaultState: SocketReducerModel = {};

const SocketReducer = (
  state: SocketReducerModel = defaultState,
  action: SocketReducerTypes
): SocketReducerModel => {
  switch (action.type) {
    case "set_notif": {
      return {
        ...state,
        set_notif: action.set_notif,
      };
    }
    default:
      return state;
  }
};

export default SocketReducer;
