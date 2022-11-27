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
const RoomRepository_1 = __importDefault(require("../Repositories/RoomRepository"));
const RoomController = (app) => __awaiter(void 0, void 0, void 0, function* () {
    const router = (0, express_1.Router)();
    router.post("/getRoomDataTable", (0, Authorize_1.default)("admin"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const payload = req.body;
        res.json(yield RoomRepository_1.default.getRoomDataTable(payload));
    }));
    router.post("/addRoom", (0, Authorize_1.default)("admin"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const payload = req.body;
        res.json(yield RoomRepository_1.default.addRoom(payload, req.user_id));
    }));
    router.post("/getSingleRoom", (0, Authorize_1.default)("admin"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const room_pk = req.body.room_pk;
        res.json(yield RoomRepository_1.default.getSingleRoom(room_pk));
    }));
    router.post("/searchRoom", (0, Authorize_1.default)("admin"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const search = req.body.value;
        res.json(yield RoomRepository_1.default.searchRoom(search));
    }));
    router.post("/updateRoom", (0, Authorize_1.default)("admin"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const payload = req.body;
        payload.encoder_pk = req.user_id;
        res.json(yield RoomRepository_1.default.updateRoom(payload));
    }));
    router.post("/toggleRoomStatus", (0, Authorize_1.default)("admin"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const pk = req.body.room_pk;
        res.json(yield RoomRepository_1.default.toggleRoomStatus(pk, parseInt(req.user_id)));
    }));
    router.post("/getTotalRoom", (0, Authorize_1.default)("admin"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        res.json(yield RoomRepository_1.default.getTotalRoom());
    }));
    app.use("/api/room/", router);
});
exports.default = RoomController;
//# sourceMappingURL=RoomController.js.map