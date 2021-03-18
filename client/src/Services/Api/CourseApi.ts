import { PostFetch } from "../../Hooks/UseFetch";
import IServerResponse from "../Interface/IServerResponse";
import { CourseModel } from "../Models/CourseModel";
import { PaginationModel } from "../Models/PaginationModels";

const API_DEFAULT_ROUTE = `api/course/`;

const getCourseDataTableApi = async (
  payload: PaginationModel
): Promise<IServerResponse> => {
  const response = await PostFetch(
    API_DEFAULT_ROUTE + "getCourseDataTable",
    payload
  );
  return response;
};

const addCourseApi = async (payload: CourseModel): Promise<IServerResponse> => {
  const response = await PostFetch(API_DEFAULT_ROUTE + "addCourse", payload);
  return response;
};

const updateCourseApi = async (
  payload: CourseModel
): Promise<IServerResponse> => {
  const response = await PostFetch(API_DEFAULT_ROUTE + "updateCourse", payload);
  return response;
};

const getSingleCourseApi = async (
  course_pk: string
): Promise<IServerResponse> => {
  const response = await PostFetch(API_DEFAULT_ROUTE + "getSingleCourse", {
    course_pk: course_pk,
  });
  return response;
};

const getCourseDurationApi = async (
  course_pk: string
): Promise<IServerResponse> => {
  const response = await PostFetch(API_DEFAULT_ROUTE + "getCourseDuration", {
    course_pk: course_pk,
  });
  return response;
};

const searchCourseApi = async (search: string): Promise<IServerResponse> => {
  const response = await PostFetch(API_DEFAULT_ROUTE + "searchCourse", {
    search,
  });
  return response;
};

export default {
  getCourseDataTableApi,
  addCourseApi,
  updateCourseApi,
  getSingleCourseApi,
  searchCourseApi,
  getCourseDurationApi,
};
