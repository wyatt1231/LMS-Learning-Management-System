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
const StudentRepository_1 = __importDefault(require("../Repositories/StudentRepository"));
const StudentController = (app) => __awaiter(void 0, void 0, void 0, function* () {
    const router = (0, express_1.Router)();
    router.post("/getStudentDataTable", (0, Authorize_1.default)("admin"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const payload = req.body;
        res.json(yield StudentRepository_1.default.getStudentDataTable(payload));
    }));
    router.post("/addStudent", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const payload = req.body;
        res.json(yield StudentRepository_1.default.addStudent(payload, req.user_id));
    }));
    router.post("/updateStudent", (0, Authorize_1.default)("student"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const payload = req.body;
        payload.encoder_pk = req.user_id;
        res.json(yield StudentRepository_1.default.updateStudent(payload));
    }));
    router.post("/updateStudentImage", (0, Authorize_1.default)("student"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const payload = req.body;
        payload.encoder_pk = req.user_id;
        res.json(yield StudentRepository_1.default.updateStudentImage(payload));
    }));
    router.post("/getSingleStudent", (0, Authorize_1.default)("admin"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const student_pk = req.body.student_pk;
        res.json(yield StudentRepository_1.default.getSingleStudent(student_pk));
    }));
    router.post("/getTotalStudents", (0, Authorize_1.default)("admin"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        res.json(yield StudentRepository_1.default.getTotalStudents());
    }));
    router.post("/searchStudentNotInClass", (0, Authorize_1.default)("admin,tutor"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const search = req.body.value;
        const class_pk = req.body.class_pk;
        res.json(yield StudentRepository_1.default.searchStudentNotInClass(search, class_pk));
    }));
    router.post("/approveStudent", (0, Authorize_1.default)("admin"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const student_pk = req.body.student_pk;
        res.json(yield StudentRepository_1.default.changeStudentStatus(student_pk, req.user_id, "a", "Approved"));
    }));
    router.post("/blockStudent", (0, Authorize_1.default)("admin"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const student_pk = req.body.student_pk;
        res.json(yield StudentRepository_1.default.changeStudentStatus(student_pk, req.user_id, "x", "Blocked"));
    }));
    router.post("/getLoggedStudentInfo", (0, Authorize_1.default)("student"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        res.json(yield StudentRepository_1.default.getLoggedStudentInfo(parseInt(req.user_id)));
    }));
    app.use("/api/student/", router);
});
exports.default = StudentController;
//# sourceMappingURL=StudentController.js.map