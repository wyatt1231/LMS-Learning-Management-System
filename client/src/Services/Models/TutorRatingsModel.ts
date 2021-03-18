export interface TutorRatingsModel {
  rate_pk?: number;
  tutor_pk?: number;
  rating?: number;
  say?: string;
  picture?: string;
  name?: string;
  bio?: string;
  student_pk?: number;
  encoded_at?: string | Date;
  encoded_by?: number;
}
