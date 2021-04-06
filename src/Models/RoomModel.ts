export interface RoomModel {
  room_pk?: number;
  room_desc?: string;
  notes?: string;
  is_active?: 1 | 0;
  updated_at?: Date;
  encoder_pk?: number | string;
}
