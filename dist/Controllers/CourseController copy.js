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
const CourseRepository_1 = __importDefault(require("../Repositories/CourseRepository"));
const CourseController = (app) => __awaiter(void 0, void 0, void 0, function* () {
    const router = express_1.Router();
    router.post("/getCourseDataTable", Authorize_1.default("admin"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const payload = req.body;
        res.json(yield CourseRepository_1.default.getCourseDataTable(payload));
    }));
    router.post("/addCourse", Authorize_1.default("admin"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const payload = req.body;
        res.json(yield CourseRepository_1.default.addCourse(payload, req.user_id));
    }));
    router.post("/updateCourse", Authorize_1.default("admin"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const payload = req.body;
        res.json(yield CourseRepository_1.default.updateCourse(payload, req.user_id));
    }));
    router.post("/getSingleCourse", Authorize_1.default("admin"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const course_pk = req.body.course_pk;
        res.json(yield CourseRepository_1.default.getSingleCourse(course_pk));
    }));
    router.post("/getCourseDuration", Authorize_1.default("admin"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const course_pk = req.body.course_pk;
        res.json(yield CourseRepository_1.default.getCourseDuration(course_pk));
    }));
    router.post("/searchCourse", Authorize_1.default("admin"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const search = req.body.value;
        res.json(yield CourseRepository_1.default.searchCourse(search));
    }));
    app.use("/api/course/", router);
});
exports.default = CourseController;
//# sourceMappingURL=CourseController%20copy.js.map