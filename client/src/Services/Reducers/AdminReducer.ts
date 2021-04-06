import { AdminReducerModel, AdminReducerTypes } from "../Types/AdminTypes";

const defaultState: AdminReducerModel = {
  fetching_admin_data_table: false,
  fetching_selected_admin: false,
};

const AdminReducer = (
  state: AdminReducerModel = defaultState,
  action: AdminReducerTypes
): AdminReducerModel => {
  switch (action.type) {
    case "set_admin_data_table": {
      return {
        ...state,
        admin_data_table: action.admin_data_table,
      };
    }
    case "fetching_admin_data_table": {
      return {
        ...state,
        fetching_admin_data_table: action.fetching_admin_data_table,
      };
    }

    //--

    case "set_selected_admin": {
      return {
        ...state,
        selected_admin: action.selected_admin,
      };
    }
    case "fetching_selected_admin": {
      return {
        ...state,
        fetching_selected_admin: action.fetching_selected_admin,
      };
    }

    case "set_logged_admin": {
      return {
        ...state,
        logged_admin: action.logged_admin,
      };
    }
    case "fetching_logged_admin": {
      return {
        ...state,
        fetching_logged_admin: action.fetching_logged_admin,
      };
    }

    default:
      return state;
  }
};

export default AdminReducer;
