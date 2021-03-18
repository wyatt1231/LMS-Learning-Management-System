import { PostFetch } from "../../Hooks/UseFetch";
import IServerResponse from "../Interface/IServerResponse";
import { PaginationModel } from "../Models/PaginationModels";
import { ClassModel } from "../Models/ClassModel";

const API_DEFAULT_ROUTE = `api/class/`;

const getClassDataTableApi = async (
  payload: PaginationModel
): Promise<IServerResponse> => {
  const response = await PostFetch(
    API_DEFAULT_ROUTE + "getClassDataTable",
    payload
  );
  return response;
};

const getStudentEnrolledClassesApi = async (): Promise<IServerResponse> => {
  const response = await PostFetch(
    API_DEFAULT_ROUTE + "getStudentEnrolledClasses",
    null
  );
  return response;
};

const getStudentUnenrolledClassTableApi = async (
  payload: PaginationModel
): Promise<IServerResponse> => {
  const response = await PostFetch(
    API_DEFAULT_ROUTE + "getStudentUnenrolledClassTable",
    payload
  );
  return response;
};

const getTutorClassTableApi = async (
  payload: PaginationModel
): Promise<IServerResponse> => {
  const response = await PostFetch(
    API_DEFAULT_ROUTE + "getTutorClassTable",
    payload
  );
  return response;
};

const addClassApi = async (payload: ClassModel): Promise<IServerResponse> => {
  const response = await PostFetch(API_DEFAULT_ROUTE + "addClass", payload);
  return response;
};

const updateClassApi = async (
  payload: ClassModel
): Promise<IServerResponse> => {
  const response = await PostFetch(API_DEFAULT_ROUTE + "updateClass", payload);
  return response;
};

const approveClassApi = async (class_pk: number): Promise<IServerResponse> => {
  const response = await PostFetch(API_DEFAULT_ROUTE + "approveClass", {
    class_pk,
  });
  return response;
};

const getSingleClassApi = async (
  class_pk: number
): Promise<IServerResponse> => {
  const response = await PostFetch(API_DEFAULT_ROUTE + "getSingleClass", {
    class_pk: class_pk,
  });
  return response;
};

export default {
  getClassDataTableApi,
  addClassApi,
  updateClassApi,
  getSingleClassApi,
  getTutorClassTableApi,
  approveClassApi,
  getStudentEnrolledClassesApi,
  getStudentUnenrolledClassTableApi,
};
