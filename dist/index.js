"use strict";
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
const express_fileupload_1 = __importDefault(require("express-fileupload"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const ControllerRegistry_1 = require("./Registry/ControllerRegistry");
const SocketRegistry_1 = __importDefault(require("./Registry/SocketRegistry"));
const path_1 = __importDefault(require("path"));
exports.app = express_1.default();
const main = () =>
  __awaiter(void 0, void 0, void 0, function* () {
    dotenv_1.default.config();
    exports.app.use(cors_1.default());
    exports.app.use(body_parser_1.default.json({ limit: "50mb" }));
    exports.app.use(express_fileupload_1.default());
    // app.use(express.static("./"));
    const server = http_1.default.createServer(exports.app);
    const socketServer = new socket_io_1.Server(server, {
      cors: {
        origin: "*",
      },
    });
    ControllerRegistry_1.ControllerRegistry(exports.app);
    SocketRegistry_1.default(socketServer);
    if (process.env.NODE_ENV === "production") {
      // Set static folder
      // exports.app.use(express_1.default.static("../client/build"));
      app.use(
        "/static",
        express.static(path.join(__dirname, "../client/build//static"))
      );
      exports.app.get("*", (req, res) => {
        // res.sendFile(path_1.default.resolve(__dirname, "client", "build", "index.html"));
        res.sendFile("index.html", {
          root: path.join(__dirname, "../../client/build/"),
        });
      });
    }
    server.listen(process.env.PORT || 4040, () =>
      console.log(`listening to ports 4040`)
    );
  });
main();
//# sourceMappingURL=index.js.map
