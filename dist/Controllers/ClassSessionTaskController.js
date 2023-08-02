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
const ClassSessionTaskRepository_1 = __importDefault(require("../Repositories/ClassSessionTaskRepository"));
const ClassSessionTaskController = (app) => __awaiter(void 0, void 0, void 0, function* () {
    const router = (0, express_1.Router)();
    router.post("/getAllClassTask", (0, Authorize_1.default)(), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const class_pk = req.body.class_pk;
        res.json(yield ClassSessionTaskRepository_1.default.getAllClassTask(class_pk));
    }));
    router.post("/getSingleClassTask", (0, Authorize_1.default)(), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const class_task_pk = req.body.class_task_pk;
        res.json(yield ClassSessionTaskRepository_1.default.getSingleClassTask(class_task_pk));
    }));
    router.post("/addClassTask", (0, Authorize_1.default)(), 
    // async (req: Request & UserClaims, res: Response) => {
    (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const payload = req.body;
        const file = (_a = req === null || req === void 0 ? void 0 : req.files) === null || _a === void 0 ? void 0 : _a.file;
        payload.encoder_pk = parseInt(req.user_id);
        res.json(yield ClassSessionTaskRepository_1.default.addClassTask(payload, file));
    }));
    router.post("/updateClassTask", (0, Authorize_1.default)(), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        var _b;
        const payload = req.body;
        const file = (_b = req === null || req === void 0 ? void 0 : req.files) === null || _b === void 0 ? void 0 : _b.file;
        payload.encoder_pk = parseInt(req.user_id);
        res.json(yield ClassSessionTaskRepository_1.default.updateClassTask(payload, file));
    }));
    router.post("/toggleSubmitClassTask", (0, Authorize_1.default)(), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const payload = req.body;
        payload.encoder_pk = parseInt(req.user_id);
        res.json(yield ClassSessionTaskRepository_1.default.toggleSubmitClassTask(payload));
    }));
    router.post("/changeStatusClassTask", (0, Authorize_1.default)(), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const payload = req.body;
        payload.encoder_pk = parseInt(req.user_id);
        res.json(yield ClassSessionTaskRepository_1.default.changeStatusClassTask(payload));
    }));
    //task answers
    router.post("/getAllClassTaskQues", (0, Authorize_1.default)(), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const class_task_pk = req.body.class_task_pk;
        res.json(yield ClassSessionTaskRepository_1.default.getAllClassTaskQues(class_task_pk));
    }));
    router.post("/getSingleClassTaskQues", (0, Authorize_1.default)(), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const task_ques_pk = req.body.task_ques_pk;
        res.json(yield ClassSessionTaskRepository_1.default.getSingleClassTaskQues(task_ques_pk));
    }));
    router.post("/updateClassTaskQues", (0, Authorize_1.default)(), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const payload = req.body;
        res.json(yield ClassSessionTaskRepository_1.default.updateClassTaskQues(payload));
    }));
    router.post("/addClassTaskQues", (0, Authorize_1.default)(), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const payload = req.body;
        res.json(yield ClassSessionTaskRepository_1.default.addClassTaskQues(payload));
    }));
    //task submissions
    router.post("/getAllStudentsSubmit", (0, Authorize_1.default)(), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const class_task_pk = req.body.class_task_pk;
        res.json(yield ClassSessionTaskRepository_1.default.getAllStudentsSubmit(class_task_pk));
    }));
    router.post("/getAllClassTaskSub", (0, Authorize_1.default)(), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const class_task_pk = req.body.class_task_pk;
        res.json(yield ClassSessionTaskRepository_1.default.getAllClassTaskSub(class_task_pk, parseInt(req.user_id)));
    }));
    router.post("/addClassTaskSub", (0, Authorize_1.default)(), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const payload = req.body;
        res.json(yield ClassSessionTaskRepository_1.default.addClassTaskSub(payload, parseInt(req.user_id)));
    }));
    router.post("/updateTaskSub", (0, Authorize_1.default)(), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const payload = req.body;
        res.json(yield ClassSessionTaskRepository_1.default.updateTaskSub(payload));
    }));
    router.post("/addClassTaskFileSub", (0, Authorize_1.default)(), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const payload = req.body;
        const file = req.files.file;
        res.json(yield ClassSessionTaskRepository_1.default.addClassTaskFileSub(payload, parseInt(req.user_id), file));
    }));
    app.use("/api/task/", router);
});
exports.default = ClassSessionTaskController;
//# sourceMappingURL=ClassSessionTaskController.js.map