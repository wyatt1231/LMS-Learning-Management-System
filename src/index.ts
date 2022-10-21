import BodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import FileUpload from "express-fileupload";
import http from "http";
import path from "path";
import { Server } from "socket.io";
import { ControllerRegistry } from "./Registry/ControllerRegistry";
import SocketRegistry from "./Registry/SocketRegistry";
export const app = express();

const main = async () => {
  dotenv.config();

  app.use(cors());
  app.use(BodyParser.json({ limit: "50mb" }));
  app.use(FileUpload());

  app.use(express.static("./"));

  const server = http.createServer(app);
  const socketServer = new Server(server, {
    cors: {
      origin: "*",
    },
  });

  ControllerRegistry(app);
  SocketRegistry(socketServer);

  app.use(
    "/static",
    express.static(path.join(__dirname, "../client/build/static"))
  );

  app.get("*", function (req, res) {
    res.sendFile("index.html", {
      root: path.join(__dirname, "../client/build/"),
    });
  });

  // if (process.env.NODE_ENV === "production") {
  // app.use(
  //   "/static",
  //   express.static(path.join(__dirname, "../client/build//static"))
  // );

  // app.use("/lib", express.static(path.join(__dirname, "../client/build//lib")));

  // app.get("*", function (req, res) {
  //   res.sendFile("index.html", {
  //     root: path.join(__dirname, "../client/build/"),
  //   });
  // });

  // app.get("*", function (req, res) {
  //   res.sendFile("lib", {
  //     root: path.join(__dirname, "../client/lib/"),
  //   });
  // });
  // }

  // const PORT = process.env.PORT || 4040;
  // server.listen(PORT, () => console.log(`listening to ports ${PORT}`));
  // const PORT = process.env.PORT || 6000;
  const PORT = 80;

  server.listen(PORT, () => console.log(`listening to ports ${PORT}`));
};

main();
