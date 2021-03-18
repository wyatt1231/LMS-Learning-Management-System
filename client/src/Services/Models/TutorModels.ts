export interface TutorModel {
  tutor_pk?: string;
  user_id?: number;
  username?: string;
  position?: string;
  picture?: string;
  firstname?: string;
  middlename?: string;
  lastname?: string;
  suffix?: string;
  prefix?: string;
  birth_date?: Date;
  bio?: string;
  email?: string;
  mob_no?: string;
  gender?: "m" | "f";
  complete_address?: string;
  is_active?: "y" | "n";
  encoded_at?: Date;
  encoder_pk?: number | string;
}
