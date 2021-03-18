import { StatusMasterModel } from "./StatusMasterModel";
import { StudentModel } from "./StudentModel";

export interface ClassStudentModel {
  class_stud_pk?: string;
  class_pk?: number;
  student_pk?: number;
  student_name?: string;
  sts_pk?: string;
  sts_desc?: string;
  sts_color?: string;
  encoded_at?: Date;
  encoder_pk?: number;
  encoder_name?: string;

  student_details: StudentModel;
  status_details: StatusMasterModel;
}
