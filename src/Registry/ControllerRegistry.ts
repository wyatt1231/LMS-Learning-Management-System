import { Express } from "express";
import AdminController from "../Controllers/AdminController";
import ClassController from "../Controllers/ClassController";
import ClassMaterialController from "../Controllers/ClassMaterialController";
import ClassSessionController from "../Controllers/ClassSessionController";
import ClassSessionTaskController from "../Controllers/ClassSessionTaskController";
import ClassStudentController from "../Controllers/ClassStudentController";
import CourseController from "../Controllers/CourseController";
import RoomController from "../Controllers/RoomController";
import StudentController from "../Controllers/StudentController";
import TutorController from "../Controllers/TutorController";
import UserController from "../Controllers/UserController";

export const ControllerRegistry = async (app: Express) => {
  await UserController(app);
  await AdminController(app);
  await TutorController(app);
  await CourseController(app);
  await RoomController(app);
  await ClassController(app);
  await StudentController(app);
  await ClassSessionController(app);
  await ClassStudentController(app);
  await ClassMaterialController(app);
  await ClassSessionTaskController(app);
};

export default ControllerRegistry;
