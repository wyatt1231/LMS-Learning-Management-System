import { Express, Request, Response, Router } from "express";
import Authorize from "../Middlewares/Authorize";
import { ClassMaterialModel } from "../Models/ClassMaterialModel";
import { UserClaims } from "../Models/UserModel";
import ClassMaterialRepository from "../Repositories/ClassMaterialRepository";

const ClassMaterialController = async (app: Express): Promise<void> => {
  const router = Router();

  router.post(
    "/getTblClassMaterial",
    Authorize("admin,tutor,student"),
    async (req: Request & UserClaims, res: Response) => {
      const class_pk: number = req.body.class_pk;
      res.json(await ClassMaterialRepository.getTblClassMaterial(class_pk));
    }
  );

  router.post(
    "/addClassMaterial",
    Authorize("admin,tutor"),
    async (req: Request & { files: any } & UserClaims, res: Response) => {
      const payload: ClassMaterialModel = req.body;
      const file = req.files.file;

      res.json(
        await ClassMaterialRepository.addClassMaterial(
          payload,
          parseInt(req.user_id),
          file
        )
      );
    }
  );

  router.post(
    "/deleteClassMaterial",
    Authorize("admin,tutor"),
    async (req: Request & { files: any } & UserClaims, res: Response) => {
      const mat_pk: number = req.body.mat_pk;

      res.json(await ClassMaterialRepository.deleteClassMaterial(mat_pk));
    }
  );

  app.use("/api/classmaterial/", router);
};

export default ClassMaterialController;
