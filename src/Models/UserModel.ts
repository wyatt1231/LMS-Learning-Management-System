export interface UserLogin {
  username: string;
  password: string;
}

export interface UserClaims {
  user_id?: string;
  user_type?: string;
  allow_login?: "y" | "n";
}

export interface UserModel {
  user_id?: string;
  username?: string;
  password?: string;
  user_type?: string;
  fullname?: string;
  online_count?: string;
  sts_pk?: string;
  sts_desc?: string;
  encoded_at?: Date;
  encoder_pk?: string;
  allow_login?: "y" | "n";
  old_password?: string;
  picture?: string;
}
