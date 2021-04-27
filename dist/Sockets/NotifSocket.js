"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.socket_con = void 0;
const SocketAuth_1 = __importDefault(require("../Middlewares/SocketAuth"));
exports.socket_con = [];
const SOCKET_NAMESPACE = "/socket/notif";
const NotifSocket = (io) => {
    io.of(SOCKET_NAMESPACE)
        .use(SocketAuth_1.default)
        .on("connection", (socket) => {
        const socket_id = socket.id;
        const user_pk = parseInt(socket.user_id);
        exports.socket_con.push({
            socket_id: socket_id,
            user_pk: user_pk,
        });
        socket.on("disconnect", () => {
            let find_con_socket = exports.socket_con.findIndex((s) => s.socket_id === socket_id);
            if (find_con_socket !== -1) {
                exports.socket_con.splice(find_con_socket, 1);
            }
        });
        socket.on("notify_tutors", (user_pk) => {
            const find_index = exports.socket_con.findIndex((s) => s.user_pk === user_pk);
            if (find_index !== -1) {
                io.of(SOCKET_NAMESPACE)
                    .to(exports.socket_con[find_index].socket_id)
                    .emit("getNotif");
            }
        });
    });
};
exports.default = NotifSocket;
//# sourceMappingURL=NotifSocket.js.map