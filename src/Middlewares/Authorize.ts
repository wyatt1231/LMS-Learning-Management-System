import { Response } from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET_KEY } from "../Configurations/Constants";
import { UserClaims } from "../Models/UserModel";

const Authorize = (roles?: string): any => {
  const listRoles: Array<string> | null =
    typeof roles === "string" ? roles.split(",") : null;

  return [
    (req: Request & UserClaims, res: Response, next: Function) => {
      const bearerHeader = req.headers["authorization"];

      if (typeof bearerHeader !== "undefined") {
        const bearer: Array<string> = bearerHeader.split(" ");
        const bearerToken: string = bearer[1];
        if (bearerToken) {
          jwt.verify(bearerToken, JWT_SECRET_KEY, (error, claims: any) => {
            if (error) {
              res.status(403).send({
                success: false,
                message: "Unauthorized",
              });
            } else {
              if (typeof claims?.user !== "undefined") {
                const user: UserClaims = claims.user;

                if (listRoles) {
                  if (listRoles.includes(user.user_type)) {
                    req.user_id = user.user_id;
                    req.user_type = user.user_type;

                    next();
                  } else {
                    res.status(403).send({
                      success: false,
                      message: "Unauthorized",
                    });
                  }
                } else {
                  req.user_id = user.user_id;
                  req.user_type = user.user_type;
                  next();
                }
              }
            }
          });
        } else {
          res.status(403).send({
            success: false,
            message: "Unauthorized",
          });
        }
      } else {
        res.status(403).send({
          success: false,
          message: "Unauthorized",
        });
      }
    },
  ];
};

export default Authorize;
