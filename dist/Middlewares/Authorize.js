"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const Constants_1 = require("../Configurations/Constants");
const Authorize = (roles) => {
    const listRoles = typeof roles === "string" ? roles.split(",") : null;
    return [
        (req, res, next) => {
            const bearerHeader = req.headers["authorization"];
            if (typeof bearerHeader !== "undefined") {
                const bearer = bearerHeader.split(" ");
                const bearerToken = bearer[1];
                if (bearerToken) {
                    jsonwebtoken_1.default.verify(bearerToken, Constants_1.JWT_SECRET_KEY, (error, claims) => {
                        if (error) {
                            res.status(403).send({
                                success: false,
                                message: "Unauthorized",
                            });
                        }
                        else {
                            if (typeof (claims === null || claims === void 0 ? void 0 : claims.user) !== "undefined") {
                                const user = claims.user;
                                if (listRoles) {
                                    if (listRoles.includes(user.user_type)) {
                                        req.user_id = user.user_id;
                                        req.user_type = user.user_type;
                                        next();
                                    }
                                    else {
                                        res.status(403).send({
                                            success: false,
                                            message: "Unauthorized",
                                        });
                                    }
                                }
                                else {
                                    req.user_id = user.user_id;
                                    req.user_type = user.user_type;
                                    next();
                                }
                            }
                        }
                    });
                }
                else {
                    res.status(403).send({
                        success: false,
                        message: "Unauthorized",
                    });
                }
            }
            else {
                res.status(403).send({
                    success: false,
                    message: "Unauthorized",
                });
            }
        },
    ];
};
exports.default = Authorize;
//# sourceMappingURL=Authorize.js.map