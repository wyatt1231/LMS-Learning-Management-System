import { Express, Response, Request, Router } from "express";
import Authorize from "../Middlewares/Authorize";
import { PaginationModel } from "../Models/PaginationModel";
import { CourseModel } from "../Models/CourseModel";
import { UserClaims } from "../Models/UserModel";
import CourseRepository from "../Repositories/CourseRepository";

const CourseController = async (app: Express): Promise<void> => {
  const router = Router();

  router.post(
    "/getCourseDataTable",
    Authorize("admin"),
    async (req: Request, res: Response) => {
      const payload: PaginationModel = req.body;
      res.json(await CourseRepository.getCourseDataTable(payload));
    }
  );

  router.post(
    "/addCourse",
    Authorize("admin"),
    async (req: Request & UserClaims, res: Response) => {
      const payload: CourseModel = req.body;
      res.json(await CourseRepository.addCourse(payload, req.user_id));
    }
  );

  router.post(
    "/getSingleCourse",
    Authorize("admin"),
    async (req: Request & UserClaims, res: Response) => {
      const course_pk: string = req.body.course_pk;
      res.json(await CourseRepository.getSingleCourse(course_pk));
    }
  );

  router.post(
    "/getCourseDuration",
    Authorize("admin"),
    async (req: Request & UserClaims, res: Response) => {
      const course_pk: string = req.body.course_pk;
      res.json(await CourseRepository.getCourseDuration(course_pk));
    }
  );

  router.post(
    "/searchCourse",
    Authorize("admin"),
    async (req: Request & UserClaims, res: Response) => {
      const search: string = req.body.value;
      res.json(await CourseRepository.searchCourse(search));
    }
  );

  router.post(
    "/updateCourse",
    Authorize("admin"),
    async (req: Request & UserClaims, res: Response) => {
      const payload: CourseModel = req.body;
      payload.encoder_pk = req.user_id;
      res.json(await CourseRepository.updateCourse(payload));
    }
  );

  router.post(
    "/toggleCourseStatus",
    Authorize("admin"),
    async (req: Request & UserClaims, res: Response) => {
      const pk: number = req.body.course_pk;
      res.json(
        await CourseRepository.toggleCourseStatus(pk, parseInt(req.user_id))
      );
    }
  );

  router.post(
    "/updateCourseImage",
    Authorize("admin"),
    async (req: Request & UserClaims, res: Response) => {
      const payload: CourseModel = req.body;
      payload.encoder_pk = req.user_id;
      res.json(await CourseRepository.updateCourseImage(payload));
    }
  );

  router.post(
    "/getTotalCourses",
    Authorize("admin"),
    async (req: Request & UserClaims, res: Response) => {
      res.json(await CourseRepository.getTotalCourses());
    }
  );

  app.use("/api/course/", router);
};

export default CourseController;
