export interface UserLogin {
  username: string;
  password: string;
}

export interface UserClaims {
  user_id: string;
  user_type?: string;
}

export interface UserModel {
  user_id?: string;
  username?: string;
  password?: string;
  confirm_password?: string;
  user_type?: string;
  full_name?: string;
  fullname?: string;
  online_count?: string;
  sts_pk?: string;
  sts_desc?: string;
  encoded_at?: Date;
  encoder_id?: string;
  encoder_name?: string;
  old_password?: string;
  picture?: string;
}
