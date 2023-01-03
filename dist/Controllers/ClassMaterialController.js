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
const ClassMaterialRepository_1 = __importDefault(require("../Repositories/ClassMaterialRepository"));
const ClassMaterialController = (app) => __awaiter(void 0, void 0, void 0, function* () {
    const router = (0, express_1.Router)();
    router.post("/getTblClassMaterial", (0, Authorize_1.default)("admin,tutor,student"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const class_pk = req.body.class_pk;
        res.json(yield ClassMaterialRepository_1.default.getTblClassMaterial(class_pk));
    }));
    router.post("/addClassMaterial", (0, Authorize_1.default)("admin,tutor"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const payload = req.body;
        const file = req.files.file;
        res.json(yield ClassMaterialRepository_1.default.addClassMaterial(payload, parseInt(req.user_id), file));
    }));
    router.post("/deleteClassMaterial", (0, Authorize_1.default)("admin,tutor"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const mat_pk = req.body.mat_pk;
        res.json(yield ClassMaterialRepository_1.default.deleteClassMaterial(mat_pk));
    }));
    app.use("/api/classmaterial/", router);
});
exports.default = ClassMaterialController;
//# sourceMappingURL=ClassMaterialController.js.map