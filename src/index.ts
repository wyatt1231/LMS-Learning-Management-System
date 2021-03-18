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

  if (process.env.NODE_ENV === "production") {
    // app.use(express.static("client/build/static"));
    app.use(
      "/static",
      express.static(path.join(__dirname, "../client/build//static"))
    );
    app.get("*", (req, res) => {
      // res.sendFile('index.htm;',path.join(__dirname, "client"));
      res.sendFile("index.html", {
        root: path.join(__dirname, "../../client/build/"),
      });
    });
  }

  server.listen(process.env.PORT || 4040, () =>
    console.log(`listening to ports 4040`)
  );
};

main();
