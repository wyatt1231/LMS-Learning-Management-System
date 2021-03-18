import { Express, Request, Response, Router } from "express";
import Authorize from "../Middlewares/Authorize";
import { FilterEventModel } from "../Models/CalendarModels";
import {
  ClassSesMsgModel,
  ClassSessionModel,
} from "../Models/ClassSessionModel";
import { UserClaims } from "../Models/UserModel";
import ClassSessionRepository from "../Repositories/ClassSessionRepository";

const ClassSessionController = async (app: Express): Promise<void> => {
  const router = Router();

  router.post(
    "/getClassSessions",
    Authorize("admin,tutor,student"),
    async (req: Request & UserClaims, res: Response) => {
      const class_pk: number = req.body.class_pk;
      res.json(await ClassSessionRepository.getTblClassSessions(class_pk));
    }
  );

  router.post(
    "/getTutorFutureSessions",
    Authorize("admin"),
    async (req: Request & UserClaims, res: Response) => {
      const tutor_pk: string = req.body.tutor_pk;
      res.json(await ClassSessionRepository.getTutorFutureSessions(tutor_pk));
    }
  );

  router.post(
    "/getTutorClassSessionCalendar",
    Authorize("tutor"),
    async (req: Request & UserClaims, res: Response) => {
      const payload: FilterEventModel = req.body;
      res.json(
        await ClassSessionRepository.getTutorClassSessionCalendar(
          payload,
          req.user_id
        )
      );
    }
  );

  router.post(
    "/getStatsSessionCalendar",
    Authorize("tutor"),
    async (req: Request & UserClaims, res: Response) => {
      res.json(
        await ClassSessionRepository.getStatsSessionCalendar(req.user_id)
      );
    }
  );

  router.post(
    "/getSingleClassSession",
    Authorize(),
    async (req: Request & UserClaims, res: Response) => {
      const session_pk: number = req.body.session_pk;
      res.json(await ClassSessionRepository.getSingleClassSession(session_pk));
    }
  );

  router.post(
    "/startClassSession",
    Authorize("tutor"),
    async (req: Request & UserClaims, res: Response) => {
      const payload: ClassSessionModel = req.body;
      res.json(await ClassSessionRepository.startClassSession(payload));
    }
  );

  router.post(
    "/endClassSession",
    Authorize("tutor"),
    async (req: Request & UserClaims, res: Response) => {
      const payload: ClassSessionModel = req.body;
      res.json(await ClassSessionRepository.endClassSession(payload));
    }
  );

  router.post(
    "/getAllMessage",
    Authorize(),
    async (req: Request & UserClaims, res: Response) => {
      const payload: number = req.body.session_pk;
      res.json(await ClassSessionRepository.getAllMessage(payload));
    }
  );

  router.post(
    "/saveMessage",
    Authorize(),
    async (req: Request & UserClaims, res: Response) => {
      const payload: ClassSesMsgModel = req.body;
      payload.user_pk = parseInt(req.user_id);
      res.json(await ClassSessionRepository.saveMessage(payload));
    }
  );

  router.post(
    "/hideMessage",
    Authorize(),
    async (req: Request & UserClaims, res: Response) => {
      const payload: ClassSesMsgModel = req.body;
      payload.user_pk = parseInt(req.user_id);
      res.json(await ClassSessionRepository.hideMessage(payload));
    }
  );

  app.use("/api/classsession/", router);
};

export default ClassSessionController;
