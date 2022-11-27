"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Authorize_1 = __importDefault(require("../Middlewares/Authorize"));
const AdminRepository_1 = __importDefault(require("../Repositories/AdminRepository"));
const AdminController = (app) => __awaiter(void 0, void 0, void 0, function* () {
    const router = (0, express_1.Router)();
    router.post("/getAdminDataTable", (0, Authorize_1.default)("admin"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const payload = req.body;
        res.json(yield AdminRepository_1.default.getAdminDataTable(payload));
    }));
    router.post("/addAdmin", (0, Authorize_1.default)("admin"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const payload = req.body;
        res.json(yield AdminRepository_1.default.addAdmin(payload, req.user_id));
    }));
    router.post("/updateAdmin", (0, Authorize_1.default)("admin"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const payload = req.body;
        res.json(yield AdminRepository_1.default.updateAdmin(payload, req.user_id));
    }));
    router.post("/getSingleAdmin", (0, Authorize_1.default)("admin"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const admin_pk = req.body.admin_pk;
        res.json(yield AdminRepository_1.default.getSingleAdmin(admin_pk));
    }));
    router.post("/getLoggedAdmin", (0, Authorize_1.default)("admin"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        res.json(yield AdminRepository_1.default.getLoggedAdmin(req.user_id));
    }));
    router.post("/updateAdminInfo", (0, Authorize_1.default)("admin"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const payload = req.body;
        payload.user_id = parseInt(req.user_id);
        res.json(yield AdminRepository_1.default.updateAdminInfo(payload));
    }));
    router.post("/updateAdminImage", (0, Authorize_1.default)("admin"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const payload = req.body;
        payload.user_id = req.user_id;
        res.json(yield AdminRepository_1.default.updateAdminImage(payload));
    }));
    router.post("/getTotalAdmin", (0, Authorize_1.default)("admin"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        res.json(yield AdminRepository_1.default.getTotalAdmin());
    }));
    app.use("/api/admin/", router);
});
exports.default = AdminController;
//# sourceMappingURL=AdminController.js.map