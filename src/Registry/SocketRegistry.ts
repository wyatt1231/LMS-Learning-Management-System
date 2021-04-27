import { Server } from "socket.io";
import ClassSessionSocket from "../Sockets/ClassSessionSocket";
import NotifSocket from "../Sockets/NotifSocket";

export const SocketRegistry = (server: Server) => {
  ClassSessionSocket(server);
  NotifSocket(server);
};

export default SocketRegistry;
