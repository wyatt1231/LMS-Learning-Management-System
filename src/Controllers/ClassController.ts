import { Express, Request, Response, Router } from "express";
import Authorize from "../Middlewares/Authorize";
import { ClassModel } from "../Models/ClassModel";
import { ClassStudentModel } from "../Models/ClassStudentModel";
import { PaginationModel } from "../Models/PaginationModel";
import { UserClaims } from "../Models/UserModel";
import ClassRepository from "../Repositories/ClassRepository";

const ClassController = async (app: Express): Promise<void> => {
  const router = Router();

  router.post(
    "/getClassDataTable",
    Authorize("admin"),
    async (req: Request, res: Response) => {
      const payload: PaginationModel = req.body;
      res.json(await ClassRepository.getClassDataTable(payload));
    }
  );

  router.post(
    "/getTutorClassTable",
    Authorize("admin,tutor"),
    async (req: Request & UserClaims, res: Response) => {
      const payload: PaginationModel = req.body;
      res.json(await ClassRepository.getTutorClassTable(payload, req.user_id));
    }
  );

  router.post(
    "/getStudentUnenrolledClassTable",
    Authorize("student"),
    async (req: Request & UserClaims, res: Response) => {
      const payload: PaginationModel = req.body;
      res.json(
        await ClassRepository.getStudentUnenrolledClassTable(
          payload,
          req.user_id
        )
      );
    }
  );

  router.post(
    "/getStudentEnrolledClasses",
    Authorize("student"),
    async (req: Request & UserClaims, res: Response) => {
      res.json(
        await ClassRepository.getStudentEnrolledClasses(parseInt(req.user_id))
      );
    }
  );

  router.post(
    "/addClass",
    Authorize("admin"),
    async (req: Request & UserClaims, res: Response) => {
      const payload: ClassModel = req.body;
      res.json(await ClassRepository.addClass(payload, req.user_id));
    }
  );

  router.post(
    "/updateClass",
    Authorize("admin"),
    async (req: Request & UserClaims, res: Response) => {
      const payload: ClassModel = req.body;
      res.json(await ClassRepository.updateClass(payload, req.user_id));
    }
  );

  router.post(
    "/approveClass",
    Authorize("admin,tutor"),
    async (req: Request & UserClaims, res: Response) => {
      const class_pk: number = req.body.class_pk;
      res.json(await ClassRepository.approveClass(class_pk, req.user_id));
    }
  );

  router.post(
    "/getSingleClass",
    Authorize("admin,tutor,student"),
    async (req: Request & UserClaims, res: Response) => {
      const class_pk: string = req.body.class_pk;
      res.json(await ClassRepository.getSingleClass(class_pk));
    }
  );

  app.use("/api/class/", router);
};

export default ClassController;
