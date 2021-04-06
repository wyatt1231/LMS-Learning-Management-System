export interface AdminModel {
  admin_pk?: number;
  user_id?: number | string;
  position?: string;
  picture?: string;
  firstname?: string;
  middlename?: string;
  lastname?: string;
  suffix?: string;
  prefix?: string;
  birth_date?: string;
  email?: string;
  mob_no?: string;
  gender?: "m" | "f";
  is_active?: "y" | "n";
  encoder_pk?: number | string;
}
