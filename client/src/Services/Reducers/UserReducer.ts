export type UserActionTypes =
  | {
      type: "SET_CURRENT_USER";
      user: string;
    }
  | {
      type: "SET_LOADING_USER";
      isLoading: boolean;
    };

export interface IUserReducer {
  user: any;
  userLoading: boolean;
}

const defaultState: IUserReducer = {
  user: null,
  userLoading: false,
};

const UserReducer = (
  state: IUserReducer = defaultState,
  action: UserActionTypes
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

    default:
      return state;
  }
};

export default UserReducer;
