import { StudentModel } from "./StudentModel";

export interface ClassRatingModel {
  class_rate_pk?: number;
  class_pk?: number;
  student_pk?: number;
  rate_val?: number;
  rated_at?: string | Date;
  comment?: string;
  student_info?: StudentModel;
}
