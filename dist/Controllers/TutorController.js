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
const TutorRepository_1 = __importDefault(require("../Repositories/TutorRepository"));
const TutorController = (app) => __awaiter(void 0, void 0, void 0, function* () {
    const router = (0, express_1.Router)();
    router.post("/getTutorDataTable", (0, Authorize_1.default)("admin"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const payload = req.body;
        res.json(yield TutorRepository_1.default.getTutorDataTable(payload));
    }));
    router.post("/addTutor", (0, Authorize_1.default)("admin"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const payload = req.body;
        res.json(yield TutorRepository_1.default.addTutor(payload, req.user_id));
    }));
    router.post("/updateTutor", (0, Authorize_1.default)("admin"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const payload = req.body;
        res.json(yield TutorRepository_1.default.updateTutor(payload, req.user_id));
    }));
    router.post("/getSingleTutor", (0, Authorize_1.default)("admin"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const tutor_pk = req.body.tutor_pk;
        res.json(yield TutorRepository_1.default.getSingleTutor(tutor_pk));
    }));
    router.post("/getSingTutorToStudent", (0, Authorize_1.default)("student"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const tutor_pk = req.body.tutor_pk;
        res.json(yield TutorRepository_1.default.getSingTutorToStudent(tutor_pk, parseInt(req.user_id)));
    }));
    router.post("/searchTutor", (0, Authorize_1.default)("admin"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const search = req.body.value;
        res.json(yield TutorRepository_1.default.searchTutor(search));
    }));
    router.post("/getDummyTutors", (0, Authorize_1.default)("admin,tutor,student"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        res.json(yield TutorRepository_1.default.getDummyTutors(parseInt(req.user_id)));
    }));
    router.post("/insertDummyTutorRatings", (0, Authorize_1.default)("admin,tutor,student"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const payload = req.body;
        res.json(yield TutorRepository_1.default.insertDummyTutorRatings(payload, parseInt(req.user_id)));
    }));
    router.post("/toggleActiveStatus", (0, Authorize_1.default)("admin,tutor,student"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const tutor_pk = req.body.tutor_pk;
        res.json(yield TutorRepository_1.default.toggleActiveStatus(tutor_pk, parseInt(req.user_id)));
    }));
    router.post("/updateTutorImage", (0, Authorize_1.default)("admin,tutor"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const payload = req.body;
        payload.user_id = parseInt(req.user_id);
        res.json(yield TutorRepository_1.default.updateTutorImage(payload));
    }));
    router.post("/getTotalTutors", (0, Authorize_1.default)("admin"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        res.json(yield TutorRepository_1.default.getTotalTutors());
    }));
    router.post("/getLoggedInTutor", (0, Authorize_1.default)("tutor"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        res.json(yield TutorRepository_1.default.getLoggedInTutor(parseInt(req.user_id)));
    }));
    router.post("/updateLoggedInTutorBio", (0, Authorize_1.default)("tutor"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const payload = req.body;
        res.json(yield TutorRepository_1.default.updateLoggedInTutorBio(payload));
    }));
    router.post("/rateTutor", (0, Authorize_1.default)("student"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const payload = req.body;
        payload.encoded_by = parseInt(req.user_id);
        res.json(yield TutorRepository_1.default.rateTutor(payload));
    }));
    router.post("/favoriteTutor", (0, Authorize_1.default)("student"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const payload = req.body;
        payload.encoded_by = parseInt(req.user_id);
        res.json(yield TutorRepository_1.default.favoriteTutor(payload));
    }));
    router.post("/getMostRatedTutors", (0, Authorize_1.default)("admin"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        res.json(yield TutorRepository_1.default.getMostRatedTutors());
    }));
    router.get("/pcc", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        // const sim_score = UseCollabFilter.PearsonCorrelation(
        //   // [1, 0, 3, 0, 0, 5, 0, 0, 5, 0, 4, 0] //active
        //   // [0, 0, 0, 2, 4, 5, 0], //active
        //   // [4, 0, 0, 5, 1, 0, 0]
        //   [1, 0, 3, 0, 3, 0, 0, 2, 0, 0, 4, 0],
        //   [1, 0, 3, 0, 0, 5, 0, 0, 5, 0, 4, 0]
        //   //
        // );
        res.json(yield TutorRepository_1.default.getRecommendedTutors(parseInt(req.user_id)));
    }));
    app.use("/api/tutor/", router);
});
exports.default = TutorController;
//# sourceMappingURL=TutorController.js.map