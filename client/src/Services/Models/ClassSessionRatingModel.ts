import { StudentModel } from "./StudentModel";

export interface ClassSessionRatingModel {
  session_rating_pk?: number;
  session_pk?: number;
  student_pk?: number;
  rating?: number;
  encoded_by?: number;
  encoder_pk?: number;
  student_info?: StudentModel;
  //views
  class_pk?: number;
}
