import { Express, Request, Response, Router } from "express";
import Authorize from "../Middlewares/Authorize";
import { AdminModel } from "../Models/AdminModel";
import { PaginationModel } from "../Models/PaginationModel";
import { UserClaims, UserModel } from "../Models/UserModel";
import AdminRepository from "../Repositories/AdminRepository";

const AdminController = async (app: Express): Promise<void> => {
  const router = Router();

  router.post(
    "/getAdminDataTable",
    Authorize("admin"),
    async (req: Request, res: Response) => {
      const payload: PaginationModel = req.body;
      res.json(await AdminRepository.getAdminDataTable(payload));
    }
  );

  router.post(
    "/addAdmin",
    Authorize("admin"),
    async (req: Request & UserClaims, res: Response) => {
      const payload: AdminModel = req.body;
      res.json(await AdminRepository.addAdmin(payload, req.user_id));
    }
  );

  router.post(
    "/updateAdmin",
    Authorize("admin"),
    async (req: Request & UserClaims, res: Response) => {
      const payload: AdminModel = req.body;
      res.json(await AdminRepository.updateAdmin(payload, req.user_id));
    }
  );

  router.post(
    "/getSingleAdmin",
    Authorize("admin"),
    async (req: Request & UserClaims, res: Response) => {
      const admin_pk: string = req.body.admin_pk;
      res.json(await AdminRepository.getSingleAdmin(admin_pk));
    }
  );

  router.post(
    "/getLoggedAdmin",
    Authorize("admin"),
    async (req: Request & UserClaims, res: Response) => {
      res.json(await AdminRepository.getLoggedAdmin(req.user_id));
    }
  );

  router.post(
    "/updateAdminInfo",
    Authorize("admin"),
    async (req: Request & UserClaims, res: Response) => {
      const payload: AdminModel = req.body;
      payload.user_id = parseInt(req.user_id);

      res.json(await AdminRepository.updateAdminInfo(payload));
    }
  );

  router.post(
    "/updateAdminImage",
    Authorize("admin"),
    async (req: Request & UserClaims, res: Response) => {
      const payload: AdminModel = req.body;
      payload.user_id = req.user_id;

      res.json(await AdminRepository.updateAdminImage(payload));
    }
  );

  router.post(
    "/getTotalAdmin",
    Authorize("admin"),
    async (req: Request & UserClaims, res: Response) => {
      res.json(await AdminRepository.getTotalAdmin());
    }
  );

  app.use("/api/admin/", router);
};

export default AdminController;
