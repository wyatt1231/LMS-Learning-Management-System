import jwt from "jsonwebtoken";
import { JWT_SECRET_KEY } from "../Configurations/Constants";
import { UserClaims } from "../Models/UserModel";

const SocketAuth = (socket: any, next) => {
  const token = socket?.handshake?.query?.token;
  jwt.verify(token, JWT_SECRET_KEY, (error, claims: any) => {
    if (error) {
      next(new Error("Authentication error"));
    } else {
      if (typeof claims?.user !== "undefined") {
        const user: UserClaims = claims.user;
        socket.user_id = user.user_id;
        next();
      }
    }
  });
};

export default SocketAuth;
