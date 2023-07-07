import { StatusMasterModel } from "./StatusMasterModel";
import { TutorModel } from "./TutorModels";

export interface ClassRequestModel {
  class_req_pk?: number;
  course_pk?: number;
  course_desc?: string;
  tutor_pk?: number;
  tutor_name?: string;
  start_date?: Date | string;
  start_time?: string;
  end_time?: string;
  class_type?: "o" | "f" | "";
  admin_remarks?: string;
  sts_pk?: string;
  encoded_at?: Date | string;
  encoder_pk?: number;
  status?: StatusMasterModel;
  tutor?: TutorModel;
}
