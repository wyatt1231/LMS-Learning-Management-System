export interface RoomModel {
  room_pk?: number;
  room_desc?: string;
  notes?: string;
  is_active?: "y" | "n";
  encoded_at?: Date;
  encoder_pk?: number | string;
}
