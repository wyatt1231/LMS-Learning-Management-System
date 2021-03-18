import { Express, Response, Request, Router } from "express";
import Authorize from "../Middlewares/Authorize";
import { PaginationModel } from "../Models/PaginationModel";
import { TutorModel } from "../Models/TutorModel";
import { TutorRatingsModel } from "../Models/TutorRatingModel";
import { UserClaims } from "../Models/UserModel";
import TutorRepository from "../Repositories/TutorRepository";

const TutorController = async (app: Express): Promise<void> => {
  const router = Router();

  router.post(
    "/getTutorDataTable",
    Authorize("admin"),
    async (req: Request, res: Response) => {
      const payload: PaginationModel = req.body;
      res.json(await TutorRepository.getTutorDataTable(payload));
    }
  );

  router.post(
    "/addTutor",
    Authorize("admin"),
    async (req: Request & UserClaims, res: Response) => {
      const payload: TutorModel = req.body;
      res.json(await TutorRepository.addTutor(payload, req.user_id));
    }
  );

  router.post(
    "/updateTutor",
    Authorize("admin"),
    async (req: Request & UserClaims, res: Response) => {
      const payload: TutorModel = req.body;
      res.json(await TutorRepository.updateTutor(payload, req.user_id));
    }
  );

  router.post(
    "/getSingleTutor",
    Authorize("admin"),
    async (req: Request & UserClaims, res: Response) => {
      const tutor_pk: string = req.body.tutor_pk;
      res.json(await TutorRepository.getSingleTutor(tutor_pk));
    }
  );

  router.post(
    "/searchTutor",
    Authorize("admin"),
    async (req: Request & UserClaims, res: Response) => {
      const search: string = req.body.value;
      res.json(await TutorRepository.searchTutor(search));
    }
  );

  router.post(
    "/getDummyTutors",
    Authorize("admin,tutor,student"),
    async (req: Request & UserClaims, res: Response) => {
      res.json(await TutorRepository.getDummyTutors(parseInt(req.user_id)));
    }
  );

  router.post(
    "/insertDummyTutorRatings",
    Authorize("admin,tutor,student"),
    async (req: Request & UserClaims, res: Response) => {
      const payload: Array<TutorRatingsModel> = req.body;
      res.json(
        await TutorRepository.insertDummyTutorRatings(
          payload,
          parseInt(req.user_id)
        )
      );
    }
  );

  app.use("/api/tutor/", router);
};

export default TutorController;
