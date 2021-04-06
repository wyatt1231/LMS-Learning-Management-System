import { Express, Request, Response, Router } from "express";
import Authorize from "../Middlewares/Authorize";
import { ClassModel } from "../Models/ClassModel";
import { ClassRatingModel } from "../Models/ClassRatingModel";
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
    "/getStudentAvailableClassTable",
    Authorize("student"),
    async (req: Request & UserClaims, res: Response) => {
      const payload: PaginationModel = req.body;
      res.json(
        await ClassRepository.getStudentAvailableClassTable(
          payload,
          req.user_id
        )
      );
    }
  );

  router.post(
    "/getStudentOngoingClassTable",
    Authorize("student"),
    async (req: Request & UserClaims, res: Response) => {
      const payload: PaginationModel = req.body;
      res.json(
        await ClassRepository.getStudentOngoingClassTable(payload, req.user_id)
      );
    }
  );

  router.post(
    "/getStudentEndedClassTable",
    Authorize("student"),
    async (req: Request & UserClaims, res: Response) => {
      const payload: PaginationModel = req.body;
      res.json(
        await ClassRepository.getStudentEndedClassTable(payload, req.user_id)
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
      const payload: ClassModel = req.body;
      payload.encoder_pk = req.user_id;
      res.json(await ClassRepository.approveClass(payload));
    }
  );

  router.post(
    "/endClass",
    Authorize("admin,tutor"),
    async (req: Request & UserClaims, res: Response) => {
      const payload: ClassModel = req.body;
      payload.encoder_pk = req.user_id;
      res.json(await ClassRepository.endClass(payload));
    }
  );

  router.post(
    "/rateClass",
    Authorize("student"),
    async (req: Request & UserClaims, res: Response) => {
      const payload: ClassRatingModel = req.body;
      payload.encoded_by = parseInt(req.user_id);
      res.json(await ClassRepository.rateClass(payload));
    }
  );

  router.post(
    "/declineClass",
    Authorize("admin,tutor"),
    async (req: Request & UserClaims, res: Response) => {
      const payload: ClassModel = req.body;
      payload.encoder_pk = req.user_id;
      res.json(await ClassRepository.declineClass(payload));
    }
  );

  router.post(
    "/getSingleClass",
    Authorize("admin,tutor,student"),
    async (req: Request & UserClaims, res: Response) => {
      const class_pk: string = req.body.class_pk;

      res.json(
        await ClassRepository.getSingleClass(
          class_pk,
          parseInt(req.user_id),
          req.user_type
        )
      );
    }
  );

  router.post(
    "/getAllTutorClasses",
    Authorize("admin,tutor"),
    async (req: Request & UserClaims, res: Response) => {
      const tutor_pk: number = req.body.tutor_pk;
      res.json(await ClassRepository.getAllTutorClasses(tutor_pk));
    }
  );

  //new

  router.post(
    "/getStudentClassByStudentPk",
    Authorize("admin,tutor,student"),
    async (req: Request & UserClaims, res: Response) => {
      const student_pk: number = req.body.student_pk;
      res.json(await ClassRepository.getStudentClassByStudentPk(student_pk));
    }
  );

  router.post(
    "/getTotalClasses",
    Authorize("admin"),
    async (req: Request & UserClaims, res: Response) => {
      res.json(await ClassRepository.getTotalClasses());
    }
  );

  router.post(
    "/getClassSummaryStats",
    Authorize("admin"),
    async (req: Request & UserClaims, res: Response) => {
      res.json(await ClassRepository.getClassSummaryStats());
    }
  );

  router.post(
    "/getOpenClassProgressStats",
    Authorize("admin"),
    async (req: Request & UserClaims, res: Response) => {
      res.json(await ClassRepository.getOpenClassProgressStats());
    }
  );

  //new
  router.post(
    "/getTotalTutorClassStats",
    Authorize("tutor"),
    async (req: Request & UserClaims, res: Response) => {
      res.json(
        await ClassRepository.getTotalTutorClassStats(parseInt(req.user_id))
      );
    }
  );

  //new
  router.post(
    "/getTotalStudentClassStats",
    Authorize("student"),
    async (req: Request & UserClaims, res: Response) => {
      res.json(
        await ClassRepository.getTotalStudentClassStats(parseInt(req.user_id))
      );
    }
  );

  router.post(
    "/getEndedClassRatingStats",
    Authorize("admin"),
    async (req: Request & UserClaims, res: Response) => {
      res.json(await ClassRepository.getEndedClassRatingStats());
    }
  );

  router.post(
    "/getClassRatings",
    Authorize("admin"),
    async (req: Request & UserClaims, res: Response) => {
      const class_pk: number = req.body.class_pk;
      res.json(await ClassRepository.getClassRatings(class_pk));
    }
  );

  app.use("/api/class/", router);
};

export default ClassController;
