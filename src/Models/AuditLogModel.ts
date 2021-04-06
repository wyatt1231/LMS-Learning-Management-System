import { UserModel } from "./UserModel";

export interface AuditLogModel {
  log_id?: number;
  user_pk?: number;
  activity?: string;
  encoded_at?: string | Date;
  user?: UserModel;
}
