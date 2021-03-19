"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const Constants_1 = require("../Configurations/Constants");
const SocketAuth = (socket, next) => {
    var _a, _b;
    const token = (_b = (_a = socket === null || socket === void 0 ? void 0 : socket.handshake) === null || _a === void 0 ? void 0 : _a.query) === null || _b === void 0 ? void 0 : _b.token;
    jsonwebtoken_1.default.verify(token, Constants_1.JWT_SECRET_KEY, (error, claims) => {
        if (error) {
            next(new Error("Authentication error"));
        }
        else {
            if (typeof (claims === null || claims === void 0 ? void 0 : claims.user) !== "undefined") {
                const user = claims.user;
                socket.user_id = user.user_id;
                next();
            }
        }
    });
};
exports.default = SocketAuth;
//# sourceMappingURL=SocketAuth.js.map