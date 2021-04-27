import { UserReducerModel, UserReducerTypes } from "../Types/UserTypes";

const defaultState: UserReducerModel = {
  user: null,
  userLoading: false,
};

const UserReducer = (
  state: UserReducerModel = defaultState,
  action: UserReducerTypes
) => {
  switch (action.type) {
    case "SET_CURRENT_USER": {
      return {
        ...state,
        user: action.user,
      };
    }

    case "SET_LOADING_USER": {
      return {
        ...state,
        userLoading: action.isLoading,
      };
    }

    case "user_logs": {
      return {
        ...state,
        user_logs: action.user_logs,
      };
    }

    case "fetching_user_logs": {
      return {
        ...state,
        fetching_user_logs: action.fetching_user_logs,
      };
    }
    //
    case "all_logs": {
      return {
        ...state,
        all_logs: action.all_logs,
      };
    }

    case "fetching_all_logs": {
      return {
        ...state,
        fetching_all_logs: action.fetching_all_logs,
      };
    }
    //
    case "user_notif": {
      return {
        ...state,
        user_notif: action.user_notif,
      };
    }
    //
    case "fetch_user_notif": {
      return {
        ...state,
        fetch_user_notif: action.fetch_user_notif,
      };
    }

    default:
      return state;
  }
};

export default UserReducer;
