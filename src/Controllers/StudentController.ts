import { Express, Request, Response, Router } from "express";
import Authorize from "../Middlewares/Authorize";
import { StudentModel } from "../Models/StudentModel";
import { PaginationModel } from "../Models/PaginationModel";
import { UserClaims } from "../Models/UserModel";
import StudentRepository from "../Repositories/StudentRepository";

const StudentController = async (app: Express): Promise<void> => {
  const router = Router();

  router.post(
    "/getStudentDataTable",
    Authorize("admin"),
    async (req: Request, res: Response) => {
      const payload: PaginationModel = req.body;
      res.json(await StudentRepository.getStudentDataTable(payload));
    }
  );

  router.post(
    "/addStudent",
    async (req: Request & UserClaims, res: Response) => {
      const payload: StudentModel = req.body;
      res.json(await StudentRepository.addStudent(payload, req.user_id));
    }
  );

  router.post(
    "/updateStudent",
    Authorize("student"),
    async (req: Request & UserClaims, res: Response) => {
      const payload: StudentModel = req.body;
      payload.encoder_pk = req.user_id;
      res.json(await StudentRepository.updateStudent(payload));
    }
  );

  router.post(
    "/updateStudentImage",
    Authorize("student"),
    async (req: Request & UserClaims, res: Response) => {
      const payload: StudentModel = req.body;
      payload.encoder_pk = req.user_id;
      res.json(await StudentRepository.updateStudentImage(payload));
    }
  );

  router.post(
    "/getSingleStudent",
    Authorize("admin"),
    async (req: Request & UserClaims, res: Response) => {
      const student_pk: string = req.body.student_pk;
      res.json(await StudentRepository.getSingleStudent(student_pk));
    }
  );

  router.post(
    "/getTotalStudents",
    Authorize("admin"),
    async (req: Request & UserClaims, res: Response) => {
      res.json(await StudentRepository.getTotalStudents());
    }
  );

  router.post(
    "/searchStudentNotInClass",
    Authorize("admin,tutor"),
    async (req: Request & UserClaims, res: Response) => {
      const search: string = req.body.value;
      const class_pk: number = req.body.class_pk;
      res.json(
        await StudentRepository.searchStudentNotInClass(search, class_pk)
      );
    }
  );

  router.post(
    "/approveStudent",
    Authorize("admin"),
    async (req: Request & UserClaims, res: Response) => {
      const student_pk: string = req.body.student_pk;
      res.json(
        await StudentRepository.changeStudentStatus(
          student_pk,
          req.user_id,
          "a",
          "Approved"
        )
      );
    }
  );

  router.post(
    "/blockStudent",
    Authorize("admin"),
    async (req: Request & UserClaims, res: Response) => {
      const student_pk: string = req.body.student_pk;
      res.json(
        await StudentRepository.changeStudentStatus(
          student_pk,
          req.user_id,
          "x",
          "Blocked"
        )
      );
    }
  );

  router.post(
    "/getLoggedStudentInfo",
    Authorize("student"),
    async (req: Request & UserClaims, res: Response) => {
      res.json(
        await StudentRepository.getLoggedStudentInfo(parseInt(req.user_id))
      );
    }
  );

  app.use("/api/student/", router);
};

export default StudentController;
