import { PostFetch } from "../../Hooks/UseFetch";
import IServerResponse from "../Interface/IServerResponse";
import { ClassStudentModel } from "../Models/ClassStudentModel";

const API_DEFAULT_ROUTE = `api/classstudent/`;

const setTblClassStudentsApi = async (
  class_pk: number
): Promise<IServerResponse> => {
  const response = await PostFetch(API_DEFAULT_ROUTE + "getTblClassStudents", {
    class_pk: class_pk,
  });
  return response;
};

const enrollClassStudent = async (
  payload: ClassStudentModel
): Promise<IServerResponse> => {
  const response = await PostFetch(
    API_DEFAULT_ROUTE + "enrollClassStudent",
    payload
  );
  return response;
};

const joinStudentToClassApi = async (
  payload: ClassStudentModel
): Promise<IServerResponse> => {
  const response = await PostFetch(
    API_DEFAULT_ROUTE + "joinStudentToClass",
    payload
  );
  return response;
};

const blockClassStudentApi = async (
  class_stud_pk: number
): Promise<IServerResponse> => {
  const response = await PostFetch(API_DEFAULT_ROUTE + "blockClassStudent", {
    class_stud_pk: class_stud_pk,
  });
  return response;
};

const acceptClassStudentApi = async (
  class_stud_pk: number
): Promise<IServerResponse> => {
  const response = await PostFetch(API_DEFAULT_ROUTE + "acceptClassStudent", {
    class_stud_pk: class_stud_pk,
  });
  return response;
};

const reEnrollClassStudentApi = async (
  class_stud_pk: number
): Promise<IServerResponse> => {
  const response = await PostFetch(API_DEFAULT_ROUTE + "reEnrollClassStudent", {
    class_stud_pk: class_stud_pk,
  });
  return response;
};

export default {
  setTblClassStudentsApi,
  enrollClassStudent,
  blockClassStudentApi,
  reEnrollClassStudentApi,
  joinStudentToClassApi,
  acceptClassStudentApi,
};
