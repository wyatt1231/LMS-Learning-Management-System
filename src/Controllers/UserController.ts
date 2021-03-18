import { Express, Request, Response, Router } from "express";
import Authorize from "../Middlewares/Authorize";
import { UserClaims } from "../Models/UserModel";
import * as user_repo from "../Repositories/UserRepository";

const UserController = async (app: Express): Promise<void> => {
  const router = Router();

  router.get("/test", async (req: Request & UserClaims, res: Response) => {
    res.json("The app is running");
  });

  router.post("/login", async (req: Request & UserClaims, res: Response) => {
    res.json(await user_repo.loginUser(req.body));
  });

  router.post(
    "/currentUser",
    Authorize(),
    async (req: Request & UserClaims, res: Response) => {
      res.json(await user_repo.currentUser(req.user_id));
    }
  );

  app.use("/api/users/", router);
};

export default UserController;
