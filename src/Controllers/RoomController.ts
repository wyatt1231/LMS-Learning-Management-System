import { Express, Response, Request, Router } from "express";
import Authorize from "../Middlewares/Authorize";
import { PaginationModel } from "../Models/PaginationModel";
import { RoomModel } from "../Models/RoomModel";
import { UserClaims } from "../Models/UserModel";
import RoomRepository from "../Repositories/RoomRepository";

const RoomController = async (app: Express): Promise<void> => {
  const router = Router();

  router.post(
    "/getRoomDataTable",
    Authorize("admin"),
    async (req: Request, res: Response) => {
      const payload: PaginationModel = req.body;
      res.json(await RoomRepository.getRoomDataTable(payload));
    }
  );

  router.post(
    "/addRoom",
    Authorize("admin"),
    async (req: Request & UserClaims, res: Response) => {
      const payload: RoomModel = req.body;
      res.json(await RoomRepository.addRoom(payload, req.user_id));
    }
  );

  router.post(
    "/getSingleRoom",
    Authorize("admin"),
    async (req: Request & UserClaims, res: Response) => {
      const room_pk: string = req.body.room_pk;
      res.json(await RoomRepository.getSingleRoom(room_pk));
    }
  );

  router.post(
    "/searchRoom",
    Authorize("admin"),
    async (req: Request & UserClaims, res: Response) => {
      const search: string = req.body.value;
      res.json(await RoomRepository.searchRoom(search));
    }
  );

  router.post(
    "/updateRoom",
    Authorize("admin"),
    async (req: Request & UserClaims, res: Response) => {
      const payload: RoomModel = req.body;
      payload.encoder_pk = req.user_id;
      res.json(await RoomRepository.updateRoom(payload));
    }
  );

  router.post(
    "/toggleRoomStatus",
    Authorize("admin"),
    async (req: Request & UserClaims, res: Response) => {
      const pk: number = req.body.room_pk;
      res.json(
        await RoomRepository.toggleRoomStatus(pk, parseInt(req.user_id))
      );
    }
  );

  router.post(
    "/getTotalRoom",
    Authorize("admin"),
    async (req: Request & UserClaims, res: Response) => {
      res.json(await RoomRepository.getTotalRoom());
    }
  );

  app.use("/api/room/", router);
};

export default RoomController;
