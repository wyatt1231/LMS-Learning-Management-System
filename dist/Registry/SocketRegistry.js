"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SocketRegistry = void 0;
const ClassSessionSocket_1 = __importDefault(require("../Sockets/ClassSessionSocket"));
const NotifSocket_1 = __importDefault(require("../Sockets/NotifSocket"));
const SocketRegistry = (server) => {
    (0, ClassSessionSocket_1.default)(server);
    (0, NotifSocket_1.default)(server);
};
exports.SocketRegistry = SocketRegistry;
exports.default = exports.SocketRegistry;
//# sourceMappingURL=SocketRegistry.js.map