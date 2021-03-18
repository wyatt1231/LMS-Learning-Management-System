"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.chat_room = void 0;
const SocketAuth_1 = __importDefault(require("../Middlewares/SocketAuth"));
exports.chat_room = [];
const SOCKET_NAMESPACE = "/socket/chat";
const findRoom = (session_pk) => {
    const found_room_index = exports.chat_room.findIndex((room) => {
        return room.room == session_pk;
    });
    return found_room_index;
};
const ClassSessionSocket = (io) => {
    io.of(SOCKET_NAMESPACE)
        .use(SocketAuth_1.default)
        .on("connection", (socket) => {
        const socket_id = socket.id;
        const user_pk = socket.user_id;
        socket.on("disconnect", () => {
            var _a, _b;
            const chat_room_temp = [...exports.chat_room];
            let found_room_index;
            let found_room_user_index;
            for (let i = 0; i < chat_room_temp.length; i++) {
                const curr_room = chat_room_temp[i];
                for (let x = 0; x < curr_room.con.length; x++) {
                    if (((_a = curr_room.con[x]) === null || _a === void 0 ? void 0 : _a.socket_id) === socket_id) {
                        found_room_index = i;
                        found_room_user_index = x;
                    }
                }
            }
            if (found_room_index >= 0) {
                const found_room_data = chat_room_temp[found_room_index];
                if (((_b = found_room_data === null || found_room_data === void 0 ? void 0 : found_room_data.con) === null || _b === void 0 ? void 0 : _b.length) > 0) {
                    const new_room = chat_room_temp[found_room_index].con.splice(found_room_user_index);
                    io.of(SOCKET_NAMESPACE)
                        .to(chat_room_temp[found_room_index].room)
                        .emit("updateRoom", chat_room_temp[found_room_index].con);
                }
                else {
                    io.of(SOCKET_NAMESPACE)
                        .to(chat_room_temp[found_room_index].room)
                        .emit("updateRoom", []);
                    chat_room_temp.splice(found_room_index, 1);
                }
                exports.chat_room = chat_room_temp;
            }
        });
        socket.on("joinSession", (session_pk) => {
            socket.join(session_pk);
            const found_room_index = findRoom(session_pk);
            if (found_room_index != -1) {
                const found_room_user_index = exports.chat_room[found_room_index].con.findIndex((userRoom) => userRoom.user_pk === user_pk);
                if (found_room_user_index === -1) {
                    exports.chat_room[found_room_index].con = [
                        ...exports.chat_room[found_room_index].con,
                        {
                            socket_id: socket_id,
                            user_pk: user_pk,
                        },
                    ];
                }
            }
            else {
                exports.chat_room.push({
                    room: session_pk,
                    con: [
                        {
                            socket_id: socket_id,
                            user_pk: user_pk,
                        },
                    ],
                });
            }
            const updated_found_room = findRoom(session_pk);
            if (updated_found_room >= 0) {
                io.of(SOCKET_NAMESPACE)
                    .to(exports.chat_room[updated_found_room].room)
                    .emit("updateRoom", exports.chat_room[updated_found_room].con);
            }
        });
        socket.on("sendMessage", (session_pk) => {
            io.of(SOCKET_NAMESPACE).to(session_pk).emit("allMessage");
        });
    });
};
exports.default = ClassSessionSocket;
//# sourceMappingURL=ClassSessionSocket.js.map