import { ClassSessionModel } from "./ClassSessionModel";
import { CourseModel } from "./CourseModel";
import { StatusMasterModel } from "./StatusMasterModel";
import { TutorModel } from "./TutorModel";

export interface ClassModel {
  class_pk?: number;
  pic?: string;
  course_pic?: string;
  class_desc?: string;
  course_pk?: number;
  course_desc?: string;
  course_duration?: number;
  room_pk?: number;
  room_desc?: string;
  class_type?: string;
  tutor_pk?: number;
  tutor_name?: string;
  tutor_pic?: string;
  start_date?: Date | string;
  start_time?: string;
  end_time?: string;
  session_count?: string;
  closed_sessions?: number;
  sts_pk?: string;
  remarks?: string;
  encoded_at?: Date;
  encoder_pk?: string;
  class_sessions: Array<ClassSessionModel>;
  tutor_info?: TutorModel;
  status?: StatusMasterModel;
  ended_session?: number;
  course_info?: CourseModel;
  student_rating?: number;
  average_rating?: number;
}
