export interface ClassMaterialModel {
  mat_pk?: number;
  class_pk?: number;
  location?: string;
  thumbnail?: string;
  descrip?: string;
  encoded_at?: Date | string;
  encoder_pk?: number;
  sts_pk?: number;
  sts_color?: string;
  sts_bgcolor?: string;
  encoder_name?: string;
}
