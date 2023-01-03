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
const ClassSessionRepository_1 = __importDefault(require("../Repositories/ClassSessionRepository"));
const ClassSessionController = (app) => __awaiter(void 0, void 0, void 0, function* () {
    const router = (0, express_1.Router)();
    router.post("/getClassSessions", (0, Authorize_1.default)("admin,tutor,student"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const class_pk = req.body.class_pk;
        res.json(yield ClassSessionRepository_1.default.getTblClassSessions(class_pk));
    }));
    router.post("/getTutorFutureSessions", (0, Authorize_1.default)("admin"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const tutor_pk = req.body.tutor_pk;
        res.json(yield ClassSessionRepository_1.default.getTutorFutureSessions(tutor_pk));
    }));
    router.post("/getTutorClassSessionCalendar", (0, Authorize_1.default)("tutor"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const payload = req.body;
        res.json(yield ClassSessionRepository_1.default.getTutorClassSessionCalendar(payload, req.user_id));
    }));
    router.post("/getStatsSessionCalendar", (0, Authorize_1.default)("tutor"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        res.json(yield ClassSessionRepository_1.default.getStatsSessionCalendar(req.user_id));
    }));
    router.post("/getSingleClassSession", (0, Authorize_1.default)(), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const session_pk = req.body.session_pk;
        res.json(yield ClassSessionRepository_1.default.getSingleClassSession(session_pk, parseInt(req.user_id), req.user_type));
    }));
    router.post("/startClassSession", (0, Authorize_1.default)("tutor"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const payload = req.body;
        payload.encoder_pk = req.user_id;
        res.json(yield ClassSessionRepository_1.default.startClassSession(payload));
    }));
    router.post("/endClassSession", (0, Authorize_1.default)("tutor"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const payload = req.body;
        payload.encoder_pk = req.user_id;
        res.json(yield ClassSessionRepository_1.default.endClassSession(payload));
    }));
    router.post("/unattendedClassSession", (0, Authorize_1.default)("tutor"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const payload = req.body;
        res.json(yield ClassSessionRepository_1.default.unattendedClassSession(payload));
    }));
    router.post("/getAllMessage", (0, Authorize_1.default)(), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const payload = req.body.session_pk;
        res.json(yield ClassSessionRepository_1.default.getAllMessage(payload));
    }));
    router.post("/saveMessage", (0, Authorize_1.default)(), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const payload = req.body;
        payload.user_pk = parseInt(req.user_id);
        res.json(yield ClassSessionRepository_1.default.saveMessage(payload));
    }));
    router.post("/hideMessage", (0, Authorize_1.default)(), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const payload = req.body;
        payload.user_pk = parseInt(req.user_id);
        res.json(yield ClassSessionRepository_1.default.hideMessage(payload));
    }));
    router.post("/getTutorSessionCal", (0, Authorize_1.default)(), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const tutor_pk = req.body.tutor_pk;
        res.json(yield ClassSessionRepository_1.default.getTutorSessionCal(tutor_pk));
    }));
    router.post("/getStudentSessionCal", (0, Authorize_1.default)(), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const student_pk = req.body.student_pk;
        res.json(yield ClassSessionRepository_1.default.getStudentSessionCal(student_pk));
    }));
    //new
    router.post("/getLoggedInTutorSessionCalendar", (0, Authorize_1.default)(), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        res.json(yield ClassSessionRepository_1.default.getLoggedInTutorSessionCalendar(parseInt(req.user_id)));
    }));
    router.post("/getLoggedStudentCalendar", (0, Authorize_1.default)("student"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        res.json(yield ClassSessionRepository_1.default.getLoggedStudentCalendar(parseInt(req.user_id)));
    }));
    app.use("/api/classsession/", router);
});
exports.default = ClassSessionController;
//# sourceMappingURL=ClassSessionController.js.map