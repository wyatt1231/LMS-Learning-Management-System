export interface NotifModel {
  notif_pk?: number;
  body?: string;
  link?: string;
  checked?: "y" | "n";
  encoded_at?: Date | string;
  encoder_pk?: number;
  notif_user_pk?: number;
  user_pk?: number;
  user_type: string;
}
