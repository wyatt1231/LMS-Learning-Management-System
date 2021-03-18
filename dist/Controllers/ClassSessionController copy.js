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
    const router = express_1.Router();
    router.post("/getClassSessions", Authorize_1.default("admin,tutor,student"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const class_pk = req.body.class_pk;
        res.json(yield ClassSessionRepository_1.default.getTblClassSessions(class_pk));
    }));
    router.post("/getTutorFutureSessions", Authorize_1.default("admin"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const tutor_pk = req.body.tutor_pk;
        res.json(yield ClassSessionRepository_1.default.getTutorFutureSessions(tutor_pk));
    }));
    router.post("/getTutorClassSessionCalendar", Authorize_1.default("tutor"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const payload = req.body;
        res.json(yield ClassSessionRepository_1.default.getTutorClassSessionCalendar(payload, req.user_id));
    }));
    router.post("/getStatsSessionCalendar", Authorize_1.default("tutor"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        res.json(yield ClassSessionRepository_1.default.getStatsSessionCalendar(req.user_id));
    }));
    router.post("/getSingleClassSession", Authorize_1.default(), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const session_pk = req.body.session_pk;
        res.json(yield ClassSessionRepository_1.default.getSingleClassSession(session_pk));
    }));
    router.post("/startClassSession", Authorize_1.default("tutor"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const payload = req.body;
        res.json(yield ClassSessionRepository_1.default.startClassSession(payload));
    }));
    router.post("/endClassSession", Authorize_1.default("tutor"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const payload = req.body;
        res.json(yield ClassSessionRepository_1.default.endClassSession(payload));
    }));
    router.post("/getAllMessage", Authorize_1.default(), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const payload = req.body.session_pk;
        res.json(yield ClassSessionRepository_1.default.getAllMessage(payload));
    }));
    router.post("/saveMessage", Authorize_1.default(), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const payload = req.body;
        payload.user_pk = parseInt(req.user_id);
        res.json(yield ClassSessionRepository_1.default.saveMessage(payload));
    }));
    router.post("/hideMessage", Authorize_1.default(), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const payload = req.body;
        payload.user_pk = parseInt(req.user_id);
        res.json(yield ClassSessionRepository_1.default.hideMessage(payload));
    }));
    app.use("/api/classsession/", router);
});
exports.default = ClassSessionController;
//# sourceMappingURL=ClassSessionController%20copy.js.map