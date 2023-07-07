import { ClassModel } from "./ClassModel";
import { StatusMasterModel } from "./StatusMasterModel";

export interface ClassSessionModel {
  session_pk?: number;
  class_pk?: number;
  start_date?: Date | string;
  start_time?: string;
  end_time?: string;
  sts_pk?: string;
  remarks?: string;
  encoded_at?: Date;
  encoder_pk?: string;
  video_url?: string;
  class_desc?: string;
  tutor_name?: string;
  tutor_pk?: string;
  sts_desc?: string;
  sts_bgcolor?: string;
  sts_color?: string;
  hash_pk?: string;
  class_info?: ClassModel;
  status_info?: StatusMasterModel;
  //
  student_rating?: number;
}

export interface TutorFutureSessionModel {
  start_date?: Date | string;
  start_time?: string;
  end_time?: string;
}

export interface StatsClassSession {
  for_approval: number;
  approved: number;
  started: number;
  closed: number;
}

export interface ClassSesMsgModel {
  ses_msg_pk?: number;
  session_pk?: number;
  msg_body?: string;
  sent_at?: Date | string;
  user_pk?: number;
  fullname?: string;
  picture?: string;

  shown?: "y" | "n";
}
