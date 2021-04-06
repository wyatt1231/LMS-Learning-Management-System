import { StudentModel } from "./StudentModel";

export interface ClassRatingModel {
  class_rate_pk?: number;
  class_pk?: number;
  student_pk?: number;
  rate_val?: number;
  rated_at?: string | Date;
  comment?: string;
  encoded_by?: number;
  student_info?: StudentModel;
}
