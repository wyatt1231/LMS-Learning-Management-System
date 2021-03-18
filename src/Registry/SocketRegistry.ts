import { Server } from "socket.io";
import ClassSessionSocket from "../Sockets/ClassSessionSocket";

export const SocketRegistry = (server: Server) => {
  ClassSessionSocket(server);
};

export default SocketRegistry;
