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
exports.ControllerRegistry = void 0;
const AdminController_1 = __importDefault(require("../Controllers/AdminController"));
const ClassController_1 = __importDefault(require("../Controllers/ClassController"));
const ClassMaterialController_1 = __importDefault(require("../Controllers/ClassMaterialController"));
const ClassSessionController_1 = __importDefault(require("../Controllers/ClassSessionController"));
const ClassSessionTaskRepository_1 = __importDefault(require("../Controllers/ClassSessionTaskRepository"));
const ClassStudentController_1 = __importDefault(require("../Controllers/ClassStudentController"));
const CourseController_1 = __importDefault(require("../Controllers/CourseController"));
const RoomController_1 = __importDefault(require("../Controllers/RoomController"));
const StudentController_1 = __importDefault(require("../Controllers/StudentController"));
const TutorController_1 = __importDefault(require("../Controllers/TutorController"));
const UserController_1 = __importDefault(require("../Controllers/UserController"));
const ControllerRegistry = (app) => __awaiter(void 0, void 0, void 0, function* () {
    yield UserController_1.default(app);
    yield AdminController_1.default(app);
    yield TutorController_1.default(app);
    yield CourseController_1.default(app);
    yield RoomController_1.default(app);
    yield ClassController_1.default(app);
    yield StudentController_1.default(app);
    yield ClassSessionController_1.default(app);
    yield ClassStudentController_1.default(app);
    yield ClassMaterialController_1.default(app);
    yield ClassSessionTaskRepository_1.default(app);
});
exports.ControllerRegistry = ControllerRegistry;
exports.default = exports.ControllerRegistry;
//# sourceMappingURL=ControllerRegistry.js.map