import { Express, Request, Response, Router } from "express";
import Authorize from "../Middlewares/Authorize";
import { ClassStudentModel } from "../Models/ClassStudentModel";
import { UserClaims } from "../Models/UserModel";
import ClassStudentRepository from "../Repositories/ClassStudentRepository";

const ClassStudentController = async (app: Express): Promise<void> => {
  const router = Router();

  router.post(
    "/getTblClassStudents",
    Authorize("admin,tutor,student"),
    async (req: Request & UserClaims, res: Response) => {
      const class_pk: string = req.body.class_pk;
      res.json(await ClassStudentRepository.getTblClassStudents(class_pk));
    }
  );

  router.post(
    "/enrollClassStudent",
    Authorize("admin,tutor"),
    async (req: Request & UserClaims, res: Response) => {
      const payload: ClassStudentModel = req.body;

      res.json(
        await ClassStudentRepository.enrollClassStudent(payload, req.user_id)
      );
    }
  );

  router.post(
    "/joinStudentToClass",
    Authorize("student"),
    async (req: Request & UserClaims, res: Response) => {
      const payload: ClassStudentModel = req.body;

      res.json(
        await ClassStudentRepository.joinStudentToClass(payload, req.user_id)
      );
    }
  );

  router.post(
    "/acceptClassStudent",
    Authorize("admin,tutor"),
    async (req: Request & UserClaims, res: Response) => {
      const class_stud_pk: number = req.body.class_stud_pk;
      res.json(await ClassStudentRepository.acceptClassStudent(class_stud_pk));
    }
  );

  router.post(
    "/blockClassStudent",
    Authorize("admin,tutor"),
    async (req: Request & UserClaims, res: Response) => {
      const class_stud_pk: number = req.body.class_stud_pk;
      res.json(await ClassStudentRepository.blockClassStudent(class_stud_pk));
    }
  );

  router.post(
    "/reEnrollClassStudent",
    Authorize("admin,tutor"),
    async (req: Request & UserClaims, res: Response) => {
      const class_stud_pk: number = req.body.class_stud_pk;
      res.json(
        await ClassStudentRepository.reEnrollClassStudent(class_stud_pk)
      );
    }
  );

  app.use("/api/classstudent/", router);
};

export default ClassStudentController;
