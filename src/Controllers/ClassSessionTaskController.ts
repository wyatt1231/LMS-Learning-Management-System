import { Express, Request, Response, Router } from "express";
import Authorize from "../Middlewares/Authorize";
import {
  SessionTaskModel,
  SessionTaskQuesModel,
  SessionTaskSubFileModel,
  SessionTaskSubModel,
} from "../Models/ClassSessionTaskModels";
import { UserClaims } from "../Models/UserModel";
import ClassSessionTaskRepository from "../Repositories/ClassSessionTaskRepository";

const ClassSessionTaskController = async (app: Express): Promise<void> => {
  const router = Router();

  router.post(
    "/getAllClassTask",
    Authorize(),
    async (req: Request & UserClaims, res: Response) => {
      const class_pk: number = req.body.class_pk;
      res.json(await ClassSessionTaskRepository.getAllClassTask(class_pk));
    }
  );

  router.post(
    "/getSingleClassTask",
    Authorize(),
    async (req: Request & UserClaims, res: Response) => {
      const class_task_pk: number = req.body.class_task_pk;
      res.json(
        await ClassSessionTaskRepository.getSingleClassTask(class_task_pk)
      );
    }
  );

  router.post(
    "/addClassTask",
    Authorize(),
    // async (req: Request & UserClaims, res: Response) => {
    async (req: Request & { files: any } & UserClaims, res: Response) => {
      const payload: SessionTaskModel = req.body;
      const file = req?.files?.file;

      payload.encoder_pk = parseInt(req.user_id);
      res.json(await ClassSessionTaskRepository.addClassTask(payload, file));
    }
  );

  router.post(
    "/updateClassTask",
    Authorize(),
    async (req: Request & { files: any } & UserClaims, res: Response) => {
      const payload: SessionTaskModel = req.body;
      const file = req?.files?.file;

      payload.encoder_pk = parseInt(req.user_id);
      res.json(await ClassSessionTaskRepository.updateClassTask(payload, file));
    }
  );

  router.post(
    "/toggleSubmitClassTask",
    Authorize(),
    async (req: Request & UserClaims, res: Response) => {
      const payload: SessionTaskModel = req.body;
      payload.encoder_pk = parseInt(req.user_id);
      res.json(await ClassSessionTaskRepository.toggleSubmitClassTask(payload));
    }
  );

  router.post(
    "/changeStatusClassTask",
    Authorize(),
    async (req: Request & UserClaims, res: Response) => {
      const payload: SessionTaskModel = req.body;
      payload.encoder_pk = parseInt(req.user_id);
      res.json(await ClassSessionTaskRepository.changeStatusClassTask(payload));
    }
  );

  //task answers

  router.post(
    "/getAllClassTaskQues",
    Authorize(),
    async (req: Request & UserClaims, res: Response) => {
      const class_task_pk: number = req.body.class_task_pk;
      res.json(
        await ClassSessionTaskRepository.getAllClassTaskQues(class_task_pk)
      );
    }
  );

  router.post(
    "/getSingleClassTaskQues",
    Authorize(),
    async (req: Request & UserClaims, res: Response) => {
      const task_ques_pk: number = req.body.task_ques_pk;
      res.json(
        await ClassSessionTaskRepository.getSingleClassTaskQues(task_ques_pk)
      );
    }
  );

  router.post(
    "/updateClassTaskQues",
    Authorize(),
    async (req: Request & UserClaims, res: Response) => {
      const payload: SessionTaskQuesModel = req.body;
      res.json(await ClassSessionTaskRepository.updateClassTaskQues(payload));
    }
  );

  router.post(
    "/addClassTaskQues",
    Authorize(),
    async (req: Request & UserClaims, res: Response) => {
      const payload: SessionTaskQuesModel = req.body;
      res.json(await ClassSessionTaskRepository.addClassTaskQues(payload));
    }
  );

  //task submissions
  router.post(
    "/getAllStudentsSubmit",
    Authorize(),
    async (req: Request & UserClaims, res: Response) => {
      const class_task_pk: number = req.body.class_task_pk;
      res.json(
        await ClassSessionTaskRepository.getAllStudentsSubmit(class_task_pk)
      );
    }
  );

  router.post(
    "/getAllClassTaskSub",
    Authorize(),
    async (req: Request & UserClaims, res: Response) => {
      const class_task_pk: number = req.body.class_task_pk;
      res.json(
        await ClassSessionTaskRepository.getAllClassTaskSub(
          class_task_pk,
          parseInt(req.user_id)
        )
      );
    }
  );

  router.post(
    "/addClassTaskSub",
    Authorize(),
    async (req: Request & UserClaims, res: Response) => {
      const payload: Array<SessionTaskSubModel> = req.body;
      res.json(
        await ClassSessionTaskRepository.addClassTaskSub(
          payload,
          parseInt(req.user_id)
        )
      );
    }
  );

  router.post(
    "/updateTaskSub",
    Authorize(),
    async (req: Request & UserClaims, res: Response) => {
      const payload: Array<SessionTaskSubModel> = req.body;
      res.json(await ClassSessionTaskRepository.updateTaskSub(payload));
    }
  );

  router.post(
    "/addClassTaskFileSub",
    Authorize(),
    async (req: Request & { files: any } & UserClaims, res: Response) => {
      const payload: SessionTaskSubFileModel = req.body;
      const file = req.files.file;

      res.json(
        await ClassSessionTaskRepository.addClassTaskFileSub(
          payload,
          parseInt(req.user_id),
          file
        )
      );
    }
  );

  app.use("/api/task/", router);
};

export default ClassSessionTaskController;
