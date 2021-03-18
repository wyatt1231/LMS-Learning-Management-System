export interface CourseModel {
  course_pk?: string;
  course_desc?: string;
  est_duration?: number;
  picture: string;
  notes: string;
  is_active?: string;
  encoded_at?: Date;
  encoder_pk?: number | string;
}
