export interface TutorFavModel {
  tutor_fav_pk?: number;
  student_pk?: number;
  tutor_pk?: number;
  is_fav?: "y" | "n";
  rated_at?: string | Date;
  encoded_by?: number;
}
