import { Express, Response, Request, Router } from "express";
import UseCollabFilter from "../Hooks/UseCollabFilter";
import Authorize from "../Middlewares/Authorize";
import { PaginationModel } from "../Models/PaginationModel";
import { TutorFavModel } from "../Models/TutorFavModel";
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
    "/getSingTutorToStudent",
    Authorize("student"),
    async (req: Request & UserClaims, res: Response) => {
      const tutor_pk: number = req.body.tutor_pk;
      res.json(
        await TutorRepository.getSingTutorToStudent(
          tutor_pk,
          parseInt(req.user_id)
        )
      );
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

  router.post(
    "/toggleActiveStatus",
    Authorize("admin,tutor,student"),
    async (req: Request & UserClaims, res: Response) => {
      const tutor_pk: number = req.body.tutor_pk;
      res.json(
        await TutorRepository.toggleActiveStatus(
          tutor_pk,
          parseInt(req.user_id)
        )
      );
    }
  );

  router.post(
    "/updateTutorImage",
    Authorize("admin,tutor"),
    async (req: Request & UserClaims, res: Response) => {
      const payload: TutorModel = req.body;
      payload.user_id = parseInt(req.user_id);
      res.json(await TutorRepository.updateTutorImage(payload));
    }
  );

  router.post(
    "/getTotalTutors",
    Authorize("admin"),
    async (req: Request & UserClaims, res: Response) => {
      res.json(await TutorRepository.getTotalTutors());
    }
  );

  router.post(
    "/getLoggedInTutor",
    Authorize("tutor"),
    async (req: Request & UserClaims, res: Response) => {
      res.json(await TutorRepository.getLoggedInTutor(parseInt(req.user_id)));
    }
  );

  router.post(
    "/updateLoggedInTutorBio",
    Authorize("tutor"),
    async (req: Request & UserClaims, res: Response) => {
      const payload: TutorModel = req.body;
      res.json(await TutorRepository.updateLoggedInTutorBio(payload));
    }
  );

  router.post(
    "/rateTutor",
    Authorize("student"),
    async (req: Request & UserClaims, res: Response) => {
      const payload: TutorRatingsModel = req.body;
      payload.encoded_by = parseInt(req.user_id);
      res.json(await TutorRepository.rateTutor(payload));
    }
  );

  router.post(
    "/favoriteTutor",
    Authorize("student"),
    async (req: Request & UserClaims, res: Response) => {
      const payload: TutorFavModel = req.body;
      payload.encoded_by = parseInt(req.user_id);
      res.json(await TutorRepository.favoriteTutor(payload));
    }
  );

  router.post(
    "/getMostRatedTutors",
    Authorize("admin"),
    async (req: Request & UserClaims, res: Response) => {
      res.json(await TutorRepository.getMostRatedTutors());
    }
  );

  router.get("/pcc", async (req: Request & UserClaims, res: Response) => {
    // const sim_score = UseCollabFilter.PearsonCorrelation(
    //   // [1, 0, 3, 0, 0, 5, 0, 0, 5, 0, 4, 0] //active
    //   // [0, 0, 0, 2, 4, 5, 0], //active
    //   // [4, 0, 0, 5, 1, 0, 0]
    //   [1, 0, 3, 0, 3, 0, 0, 2, 0, 0, 4, 0],
    //   [1, 0, 3, 0, 0, 5, 0, 0, 5, 0, 4, 0]
    //   //
    // );

    res.json(await TutorRepository.getRecommendedTutors(parseInt(req.user_id)));
  });

  app.use("/api/tutor/", router);
};

export default TutorController;
