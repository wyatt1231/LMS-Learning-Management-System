import { AuditLogModel } from "../Models/AuditLogMode";

const UserTypes = {
  USER_SET_INFO: `USER_SET_INFO`,
} as const;

export type UserReducerTypes =
  | {
      type: "SET_CURRENT_USER";
      user: string;
    }
  | {
      type: "SET_LOADING_USER";
      isLoading: boolean;
    }
  | {
      type: "user_logs";
      user_logs: Array<AuditLogModel>;
    }
  | {
      type: "fetching_user_logs";
      fetching_user_logs: boolean;
    }
  //
  | {
      type: "all_logs";
      all_logs: Array<AuditLogModel>;
    }
  | {
      type: "fetching_all_logs";
      fetching_all_logs: boolean;
    };

export interface UserReducerModel {
  user: any;
  userLoading: boolean;
  user_logs?: Array<AuditLogModel>;
  fetch_user_logs?: boolean;
  all_logs?: Array<AuditLogModel>;
  fetch_all_logs?: boolean;
}

export default UserTypes;
