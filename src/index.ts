import BodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import FileUpload from "express-fileupload";
import http from "http";
import { Server } from "socket.io";
import { ControllerRegistry } from "./Registry/ControllerRegistry";
import SocketRegistry from "./Registry/SocketRegistry";
import path from "path";
export const app = express();

const main = async () => {
  dotenv.config();

  app.use(cors());
  app.use(BodyParser.json({ limit: "50mb" }));
  app.use(FileUpload());

  const server = http.createServer(app);
  const socketServer = new Server(server, {
    cors: {
      origin: "*",
    },
  });

  ControllerRegistry(app);
  SocketRegistry(socketServer);

  app.use(express.static("./"));

  if (process.env.NODE_ENV === "production") {
    app.use(
      "/static",
      express.static(path.join(__dirname, "../client/build//static"))
    );

    app.use(
      "/lib",
      express.static(path.join(__dirname, "../client/build//lib"))
    );

    app.get("*", function (req, res) {
      res.sendFile("index.html", {
        root: path.join(__dirname, "../client/build/"),
      });
    });

    app.get("*", function (req, res) {
      res.sendFile("lib", {
        root: path.join(__dirname, "../client/lib/"),
      });
    });
  }

  const PORT = process.env.PORT || 4040;
  server.listen(PORT, () => console.log(`listening to ports ${PORT}`));
};

main();
