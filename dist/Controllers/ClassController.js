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
const ClassRepository_1 = __importDefault(require("../Repositories/ClassRepository"));
const ClassController = (app) => __awaiter(void 0, void 0, void 0, function* () {
    const router = express_1.Router();
    router.post("/getClassDataTable", Authorize_1.default("admin"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const payload = req.body;
        res.json(yield ClassRepository_1.default.getClassDataTable(payload));
    }));
    router.post("/getTutorClassTable", Authorize_1.default("admin,tutor"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const payload = req.body;
        res.json(yield ClassRepository_1.default.getTutorClassTable(payload, req.user_id));
    }));
    router.post("/getStudentUnenrolledClassTable", Authorize_1.default("student"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const payload = req.body;
        res.json(yield ClassRepository_1.default.getStudentUnenrolledClassTable(payload, req.user_id));
    }));
    router.post("/getStudentEnrolledClasses", Authorize_1.default("student"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        res.json(yield ClassRepository_1.default.getStudentEnrolledClasses(parseInt(req.user_id)));
    }));
    router.post("/addClass", Authorize_1.default("admin"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const payload = req.body;
        res.json(yield ClassRepository_1.default.addClass(payload, req.user_id));
    }));
    router.post("/updateClass", Authorize_1.default("admin"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const payload = req.body;
        res.json(yield ClassRepository_1.default.updateClass(payload, req.user_id));
    }));
    router.post("/approveClass", Authorize_1.default("admin,tutor"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const class_pk = req.body.class_pk;
        res.json(yield ClassRepository_1.default.approveClass(class_pk, req.user_id));
    }));
    router.post("/getSingleClass", Authorize_1.default("admin,tutor,student"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const class_pk = req.body.class_pk;
        res.json(yield ClassRepository_1.default.getSingleClass(class_pk));
    }));
    app.use("/api/class/", router);
});
exports.default = ClassController;
//# sourceMappingURL=ClassController.js.map