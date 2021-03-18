import { UserModel } from "./UserModel";

export interface StudentModel {
  student_pk?: number;
  user_id?: number;
  username?: string;
  grade?: number;
  picture?: string;
  firstname?: string;
  middlename?: string;
  lastname?: string;
  suffix?: string;
  email?: string;
  mob_no?: string;
  gender?: "m" | "f";
  complete_address?: string;
  sts_pk?: string;
  is_active?: string;
  encoded_at?: Date;
  encoder_pk?: string;
  user?: UserModel;
}
