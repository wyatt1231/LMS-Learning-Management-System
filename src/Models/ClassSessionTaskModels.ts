import { StatusMasterModel } from "./StatusMasterModel";
import { StudentModel } from "./StudentModel";

export interface SessionTaskModel {
  class_task_pk?: number;
  class_pk?: number;
  task_title?: string;
  task_desc?: string;
  file_location?: string;
  due_date?: string | Date;
  allow_view?: "y" | "n";
  allow_submit?: "y" | "n";
  sts_pk?: string;
  encoded_at?: string | Date;
  encoder_pk?: number;
  questions?: Array<SessionTaskQuesModel>;
  sub?: Array<SessionTaskSubModel>;
  student_dtls?: StudentModel;
  status_dtls?: StatusMasterModel;
}

export interface SessionTaskQuesModel {
  class_task_pk?: number;
  task_ques_pk?: number;
  question?: string;
  cor_answer?: string;
  pnt?: number;
}

export interface SessionTaskSubModel {
  task_sub_pk?: number;
  task_ques_pk?: number;
  student_pk?: number;
  answer?: string;
  answered_at?: string | Date;
  student?: StudentModel;
  questions?: Array<SessionTaskQuesModel>;
  is_correct?: any;
  tutor_comment?: string;
  //
  class_task_pk?: number;
  stu_ans_file_loc?: string;
  tut_file_loc?: string;
  user_pk?: number;
}

export interface SessionTaskSubFileModel {
  task_sub_file_pk?: number;
  class_task_pk?: number;
  student_pk?: number;
  stu_ans_file_loc?: string;
  tut_file_loc?: string;
  submit_type: `tutor` | `student`;
}
