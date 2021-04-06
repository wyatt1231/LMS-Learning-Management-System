export interface CourseModel {
  course_pk?: string | number;
  course_desc?: string;
  est_duration?: number;
  picture?: string;
  notes?: string;
  is_active?: string | number;
  encoded_at?: Date;
  encoder_pk?: number | string;
}
