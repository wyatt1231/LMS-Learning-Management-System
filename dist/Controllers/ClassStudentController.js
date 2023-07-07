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
const ClassStudentRepository_1 = __importDefault(require("../Repositories/ClassStudentRepository"));
const ClassStudentController = (app) => __awaiter(void 0, void 0, void 0, function* () {
    const router = (0, express_1.Router)();
    router.post("/getTblClassStudents", (0, Authorize_1.default)("admin,tutor,student"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const class_pk = req.body.class_pk;
        res.json(yield ClassStudentRepository_1.default.getTblClassStudents(class_pk));
    }));
    router.post("/enrollClassStudent", (0, Authorize_1.default)("admin,tutor"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const payload = req.body;
        res.json(yield ClassStudentRepository_1.default.enrollClassStudent(payload, req.user_id));
    }));
    router.post("/joinStudentToClass", (0, Authorize_1.default)("student"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const payload = req.body;
        res.json(yield ClassStudentRepository_1.default.joinStudentToClass(payload, req.user_id));
    }));
    router.post("/acceptClassStudent", (0, Authorize_1.default)("admin,tutor"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const class_stud_pk = req.body.class_stud_pk;
        res.json(yield ClassStudentRepository_1.default.acceptClassStudent(class_stud_pk));
    }));
    router.post("/blockClassStudent", (0, Authorize_1.default)("admin,tutor"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const class_stud_pk = req.body.class_stud_pk;
        res.json(yield ClassStudentRepository_1.default.blockClassStudent(class_stud_pk));
    }));
    router.post("/reEnrollClassStudent", (0, Authorize_1.default)("admin,tutor"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const class_stud_pk = req.body.class_stud_pk;
        res.json(yield ClassStudentRepository_1.default.reEnrollClassStudent(class_stud_pk));
    }));
    app.use("/api/classstudent/", router);
});
exports.default = ClassStudentController;
//# sourceMappingURL=ClassStudentController.js.map