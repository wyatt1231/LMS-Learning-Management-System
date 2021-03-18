export interface SocketModel {
  socket_id: string;
  user_pk: string | number;
}

export interface ChatRoomModel {
  room: string;
  con: Array<SocketModel>;
}
