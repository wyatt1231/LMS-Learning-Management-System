import { PostFetch } from "../../Hooks/UseFetch";
import IServerResponse from "../Interface/IServerResponse";
import { StudentModel } from "../Models/StudentModel";
import { PaginationModel } from "../Models/PaginationModels";

const BASE_URL = `api/student/`;

const getStudentDataTableApi = async (
  payload: PaginationModel
): Promise<IServerResponse> => {
  const response = await PostFetch(BASE_URL + "getStudentDataTable", payload);
  return response;
};

const addStudentApi = async (
  payload: StudentModel
): Promise<IServerResponse> => {
  const response = await PostFetch(BASE_URL + "addStudent", payload);
  return response;
};

const getSingleStudentApi = async (
  admin_pk: string
): Promise<IServerResponse> => {
  const response = await PostFetch(BASE_URL + "getSingleStudent", {
    admin_pk,
  });
  return response;
};

export default {
  getStudentDataTableApi,
  addStudentApi,
  getSingleStudentApi,
};
