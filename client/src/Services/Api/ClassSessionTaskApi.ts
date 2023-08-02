import { PostFetch } from "../../Hooks/UseFetch";
import IServerResponse from "../Interface/IServerResponse";
import {
  SessionTaskModel,
  SessionTaskQuesModel,
  SessionTaskSubFileModel,
  SessionTaskSubModel,
} from "../Models/ClassSessionTaskModels";

const API_DEFAULT_ROUTE = `api/task/`;

const getAllClassTask = async (class_pk: number): Promise<IServerResponse> => {
  const response = await PostFetch(API_DEFAULT_ROUTE + "getAllClassTask", {
    class_pk: class_pk,
  });
  return response;
};

const getSingleClassTask = async (
  class_task_pk: number
): Promise<IServerResponse> => {
  const response = await PostFetch(API_DEFAULT_ROUTE + "getSingleClassTask", {
    class_task_pk: class_task_pk,
  });
  return response;
};

const addClassTask = async (
  payload: SessionTaskModel
): Promise<IServerResponse> => {
  const response = await PostFetch(API_DEFAULT_ROUTE + "addClassTask", payload);
  return response;
};
const updateClassTask = async (
  payload: SessionTaskModel
): Promise<IServerResponse> => {
  const response = await PostFetch(
    API_DEFAULT_ROUTE + "updateClassTask",
    payload
  );
  return response;
};

const toggleSubmitClassTask = async (
  payload: SessionTaskModel
): Promise<IServerResponse> => {
  const response = await PostFetch(
    API_DEFAULT_ROUTE + "toggleSubmitClassTask",
    payload
  );
  return response;
};

const changeStatusClassTask = async (
  payload: SessionTaskModel
): Promise<IServerResponse> => {
  const response = await PostFetch(
    API_DEFAULT_ROUTE + "changeStatusClassTask",
    payload
  );
  return response;
};

const getAllClassTaskQues = async (
  class_task_pk: number
): Promise<IServerResponse> => {
  const response = await PostFetch(API_DEFAULT_ROUTE + "getAllClassTaskQues", {
    class_task_pk: class_task_pk,
  });
  return response;
};

const getSingleClassTaskQues = async (
  task_ques_pk: number
): Promise<IServerResponse> => {
  const response = await PostFetch(
    API_DEFAULT_ROUTE + "getSingleClassTaskQues",
    { task_ques_pk: task_ques_pk }
  );
  return response;
};

const updateClassTaskQues = async (
  payload: SessionTaskQuesModel
): Promise<IServerResponse> => {
  const response = await PostFetch(
    API_DEFAULT_ROUTE + "updateClassTaskQues",
    payload
  );
  return response;
};

const addClassTaskQues = async (
  payload: SessionTaskQuesModel
): Promise<IServerResponse> => {
  const response = await PostFetch(
    API_DEFAULT_ROUTE + "addClassTaskQues",
    payload
  );
  return response;
};

const getAllClassTaskSub = async (
  class_task_pk: number
): Promise<IServerResponse> => {
  const response = await PostFetch(API_DEFAULT_ROUTE + "getAllClassTaskSub", {
    class_task_pk: class_task_pk,
  });
  return response;
};

const getAllStudentsSubmit = async (
  class_task_pk: number
): Promise<IServerResponse> => {
  const response = await PostFetch(API_DEFAULT_ROUTE + "getAllStudentsSubmit", {
    class_task_pk: class_task_pk,
  });
  return response;
};

const addClassTaskSub = async (
  payload: Array<SessionTaskSubModel>
): Promise<IServerResponse> => {
  const response = await PostFetch(
    API_DEFAULT_ROUTE + "addClassTaskSub",
    payload
  );
  return response;
};

const updateTaskSub = async (
  payload: Array<SessionTaskSubModel>
): Promise<IServerResponse> => {
  const response = await PostFetch(
    API_DEFAULT_ROUTE + "updateTaskSub",
    payload
  );
  return response;
};

const addClassTaskFileSub = async (
  payload: SessionTaskSubFileModel
): Promise<IServerResponse> => {
  const response = await PostFetch(
    API_DEFAULT_ROUTE + "addClassTaskFileSub",
    payload
  );
  return response;
};

export default {
  getAllClassTask,
  getSingleClassTask,
  addClassTask,
  updateClassTask,
  toggleSubmitClassTask,
  changeStatusClassTask,
  getAllClassTaskQues,
  getSingleClassTaskQues,
  updateClassTaskQues,
  getAllClassTaskSub,
  addClassTaskSub,
  getAllStudentsSubmit,
  updateTaskSub,
  addClassTaskQues,
  addClassTaskFileSub,
};
