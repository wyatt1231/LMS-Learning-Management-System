import { AdminModel } from "../Models/AdminModel";

export type AdminReducerTypes =
  | {
      type: "set_admin_data_table";
      admin_data_table: AdminDataTable;
    }
  | {
      type: "fetching_admin_data_table";
      fetching_admin_data_table: boolean;
    }
  | {
      type: "set_selected_admin";
      selected_admin: AdminModel;
    }
  | {
      type: "fetching_selected_admin";
      fetching_selected_admin: boolean;
    }
  | {
      type: "set_logged_admin";
      logged_admin: AdminModel;
    }
  | {
      type: "fetching_logged_admin";
      fetching_logged_admin: boolean;
    };

export interface AdminReducerModel {
  admin_data_table?: null | AdminDataTable;
  fetching_admin_data_table: boolean;
  selected_admin?: AdminModel;
  fetching_selected_admin: boolean;

  logged_admin?: AdminModel;
  fetching_logged_admin?: boolean;
}

interface AdminDataTable {
  limit: number;
  count: number;
  begin: number;
  table: Array<AdminModel>;
}
