"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.socket_con = void 0;
const SocketAuth_1 = __importDefault(require("../Middlewares/SocketAuth"));
exports.socket_con = [];
const SOCKET_NAMESPACE = "/socket/notif";
// const findRoom = (session_pk: string | number) => {
//   const found_room_index = chat_room.findIndex((room) => {
//     return room.room == sessiosn_pk;
//   });
//   return found_room_index;
// };
const NotifSocket = (io) => {
    io.of(SOCKET_NAMESPACE)
        .use(SocketAuth_1.default)
        .on("connection", (socket) => {
        const socket_id = socket.id;
        const user_pk = socket.user_id;
        exports.socket_con.push({
            socket_id: socket_id,
            user_pk: user_pk,
        });
        console.log(`socket_con`, exports.socket_con);
        socket.on("disconnect", () => {
            let find_con_socket = exports.socket_con.findIndex((s) => s.socket_id === socket_id);
            if (find_con_socket !== -1) {
                exports.socket_con.splice(find_con_socket, 1);
            }
        });
        socket.on("connect", () => {
            console.log(`connect`);
        });
        socket.on("notify_tutors", (tutor_pks) => {
            console.log(`notify tutors`, tutor_pks);
            // io.of(SOCKET_NAMESPACE).to(session_pk).emit("allMessage");
        });
    });
};
exports.default = NotifSocket;
//# sourceMappingURL=NotifStocket.js.map