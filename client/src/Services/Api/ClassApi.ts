import { PostFetch } from "../../Hooks/UseFetch";
import IServerResponse from "../Interface/IServerResponse";
import { PaginationModel } from "../Models/PaginationModels";
import { ClassModel } from "../Models/ClassModel";
import { ClassRatingModel } from "../Models/ClassRatingModel";

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

const getStudentAvailableClassTable = async (
  payload: PaginationModel
): Promise<IServerResponse> => {
  const response = await PostFetch(
    API_DEFAULT_ROUTE + "getStudentAvailableClassTable",
    payload
  );
  return response;
};

const getStudentOngoingClassTable = async (
  payload: PaginationModel
): Promise<IServerResponse> => {
  const response = await PostFetch(
    API_DEFAULT_ROUTE + "getStudentOngoingClassTable",
    payload
  );
  return response;
};

const getStudentEndedClassTable = async (
  payload: PaginationModel
): Promise<IServerResponse> => {
  const response = await PostFetch(
    API_DEFAULT_ROUTE + "getStudentEndedClassTable",
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

const approveClass = async (payload: ClassModel): Promise<IServerResponse> => {
  const response = await PostFetch(API_DEFAULT_ROUTE + "approveClass", payload);
  return response;
};

const endClass = async (payload: ClassModel): Promise<IServerResponse> => {
  const response = await PostFetch(API_DEFAULT_ROUTE + "endClass", payload);
  return response;
};

const declineClass = async (payload: ClassModel): Promise<IServerResponse> => {
  const response = await PostFetch(API_DEFAULT_ROUTE + "declineClass", payload);
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

const getAllTutorClasses = async (tutor_pk): Promise<IServerResponse> => {
  const response = await PostFetch(API_DEFAULT_ROUTE + "getAllTutorClasses", {
    tutor_pk,
  });
  return response;
};

const getStudentClassByStudentPk = async (
  student_pk
): Promise<IServerResponse> => {
  const response = await PostFetch(
    API_DEFAULT_ROUTE + "getStudentClassByStudentPk",
    {
      student_pk,
    }
  );
  return response;
};

const getClassSummaryStats = async (): Promise<IServerResponse> => {
  const response = await PostFetch(
    API_DEFAULT_ROUTE + "getClassSummaryStats",
    null
  );
  return response;
};

const getOpenClassProgressStats = async (): Promise<IServerResponse> => {
  const response = await PostFetch(
    API_DEFAULT_ROUTE + "getOpenClassProgressStats",
    null
  );
  return response;
};

const getTotalClasses = async (): Promise<IServerResponse> => {
  const response = await PostFetch(API_DEFAULT_ROUTE + "getTotalClasses", null);
  return response;
};

const getTotalTutorClassStats = async (): Promise<IServerResponse> => {
  const response = await PostFetch(
    API_DEFAULT_ROUTE + "getTotalTutorClassStats",
    null
  );
  return response;
};

const getTotalStudentClassStats = async (): Promise<IServerResponse> => {
  const response = await PostFetch(
    API_DEFAULT_ROUTE + "getTotalStudentClassStats",
    null
  );
  return response;
};

const rateClass = async (
  payload: ClassRatingModel
): Promise<IServerResponse> => {
  const response = await PostFetch(API_DEFAULT_ROUTE + "rateClass", payload);
  return response;
};

const getEndedClassRatingStats = async (): Promise<IServerResponse> => {
  const response = await PostFetch(
    API_DEFAULT_ROUTE + "getEndedClassRatingStats",
    null
  );
  return response;
};

const getClassRatings = async (class_pk: number): Promise<IServerResponse> => {
  const response = await PostFetch(API_DEFAULT_ROUTE + "getClassRatings", {
    class_pk,
  });
  return response;
};

export default {
  getClassDataTableApi,
  addClassApi,
  updateClassApi,
  getSingleClassApi,
  getTutorClassTableApi,
  //
  approveClass,
  endClass,
  declineClass,
  //
  getStudentEnrolledClassesApi,
  getStudentUnenrolledClassTableApi,
  getAllTutorClasses,
  //
  getStudentClassByStudentPk,
  getClassSummaryStats,
  getOpenClassProgressStats,
  //
  getTotalClasses,
  //
  getTotalTutorClassStats,
  getTotalStudentClassStats,
  //
  getStudentAvailableClassTable,
  getStudentOngoingClassTable,
  getStudentEndedClassTable,
  //
  rateClass,
  getEndedClassRatingStats,
  getClassRatings,
};
