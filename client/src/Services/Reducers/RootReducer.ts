import { combineReducers } from "redux";

import UserReducer from "./UserReducer";
import PageReducer from "./PageReducer";
import TutorReducer from "./TutorReducer";
import CourseReducer from "./CourseReducer";
import RoomReducer from "./RoomReducer";
import AdminReducer from "./AdminReducer";
import ClassReducer from "./ClassReducer";
import StudentReducer from "./StudentReducer";
import ClassSessionReducer from "./ClassSessionReducer";
import ClassStudentReducer from "./ClassStudentReducer";
import ClassMaterialReducer from "./ClassMaterialReducer";
import ClassSessionTaskReducer from "./ClassSessionTaskReducer";
import SharedReducer from "./SharedReducer";
import SocketReducer from "./SocketReducer";

const RootReducer = combineReducers({
  UserReducer,
  PageReducer,
  TutorReducer,
  CourseReducer,
  RoomReducer,
  AdminReducer,
  ClassReducer,
  StudentReducer,
  ClassSessionReducer,
  ClassStudentReducer,
  ClassMaterialReducer,
  ClassSessionTaskReducer,
  SharedReducer,
  SocketReducer,
});

export default RootReducer;
