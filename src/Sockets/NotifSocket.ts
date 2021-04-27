import { Server, Socket } from "socket.io";
import SocketAuth from "../Middlewares/SocketAuth";
import { SocketConModel } from "../Models/SocketConModel";
import { UserClaims } from "../Models/UserModel";

export let socket_con: Array<SocketConModel> = [];

const SOCKET_NAMESPACE = "/socket/notif";

const NotifSocket = (io: Server) => {
  io.of(SOCKET_NAMESPACE)
    .use(SocketAuth)
    .on("connection", (socket: Socket & UserClaims) => {
      const socket_id = socket.id;
      const user_pk = parseInt(socket.user_id);

      socket_con.push({
        socket_id: socket_id,
        user_pk: user_pk,
      });

      socket.on("disconnect", () => {
        let find_con_socket = socket_con.findIndex(
          (s) => s.socket_id === socket_id
        );

        if (find_con_socket !== -1) {
          socket_con.splice(find_con_socket, 1);
        }
      });

      socket.on("notify_tutors", (user_pk: number) => {
        const find_index = socket_con.findIndex((s) => s.user_pk === user_pk);
        if (find_index !== -1) {
          io.of(SOCKET_NAMESPACE)
            .to(socket_con[find_index].socket_id)
            .emit("getNotif");
        }
      });
    });
};

export default NotifSocket;
