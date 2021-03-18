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

  // app.use(express.static("./"));
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
    express.static(path.join(__dirname, "../client/build//static"))
  );

  console.log(`__dirname`, __dirname);
  console.log(`path`, path.join(__dirname, "../client/build//static"));

  app.get("*", function (req, res) {
    res.sendFile("index.html", {
      root: path.join(__dirname, "../../client/build/"),
    });
  });

  if (process.env.NODE_ENV === "production") {
    // Set static folder
    // app.use(express.static("../client/build"));
    // app.get("*", (req, res) => {
    //   res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
    // });
  }

  server.listen(process.env.PORT || 4040, () =>
    console.log(`listening to ports 4040`)
  );
};

main();
