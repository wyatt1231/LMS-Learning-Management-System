import { PostFetch } from "../../Hooks/UseFetch";
import IServerResponse from "../Interface/IServerResponse";
import { FilterEventModel } from "../Models/CaledarModels";
import {
  ClassSesMsgModel,
  ClassSessionModel,
} from "../Models/ClassSessionModel";

const API_DEFAULT_ROUTE = `api/classsession/`;

const getClassSessionsApi = async (
  class_pk: number
): Promise<IServerResponse> => {
  const response = await PostFetch(API_DEFAULT_ROUTE + "getClassSessions", {
    class_pk: class_pk,
  });
  return response;
};

const getSingleClassSession = async (
  session_pk: number
): Promise<IServerResponse> => {
  const response = await PostFetch(
    API_DEFAULT_ROUTE + "getSingleClassSession",
    {
      session_pk: session_pk,
    }
  );
  return response;
};

const startClassSession = async (
  payload: ClassSessionModel
): Promise<IServerResponse> => {
  const response = await PostFetch(
    API_DEFAULT_ROUTE + "startClassSession",
    payload
  );
  return response;
};

const endClassSession = async (
  payload: ClassSessionModel
): Promise<IServerResponse> => {
  const response = await PostFetch(
    API_DEFAULT_ROUTE + "endClassSession",
    payload
  );
  return response;
};

const unattendedClassSession = async (
  payload: ClassSessionModel
): Promise<IServerResponse> => {
  const response = await PostFetch(
    API_DEFAULT_ROUTE + "unattendedClassSession",
    payload
  );
  return response;
};

const getTutorFutureSessionsApi = async (
  tutor_pk: string
): Promise<IServerResponse> => {
  const response = await PostFetch(
    API_DEFAULT_ROUTE + "getTutorFutureSessions",
    {
      tutor_pk: tutor_pk,
    }
  );
  return response;
};

const getTutorClassSessionCalendarApi = async (
  payload: FilterEventModel
): Promise<IServerResponse> => {
  const response = await PostFetch(
    API_DEFAULT_ROUTE + "getTutorClassSessionCalendar",
    payload
  );
  return response;
};

const getStatsSessionCalendarApi = async (): Promise<IServerResponse> => {
  const response = await PostFetch(
    API_DEFAULT_ROUTE + "getStatsSessionCalendar",
    null
  );
  return response;
};

const getAllMessage = async (session_pk: number): Promise<IServerResponse> => {
  const response = await PostFetch(API_DEFAULT_ROUTE + "getAllMessage", {
    session_pk: session_pk,
  });
  return response;
};

const saveMessage = async (
  payload: ClassSesMsgModel
): Promise<IServerResponse> => {
  const response = await PostFetch(API_DEFAULT_ROUTE + "saveMessage", payload);
  return response;
};

const hideMessage = async (
  payload: ClassSesMsgModel
): Promise<IServerResponse> => {
  const response = await PostFetch(API_DEFAULT_ROUTE + "hideMessage", payload);
  return response;
};

const getTutorSessionCal = async (tutor_pk): Promise<IServerResponse> => {
  const response = await PostFetch(API_DEFAULT_ROUTE + "getTutorSessionCal", {
    tutor_pk,
  });
  return response;
};

const getStudentSessionCal = async (student_pk): Promise<IServerResponse> => {
  const response = await PostFetch(API_DEFAULT_ROUTE + "getStudentSessionCal", {
    student_pk: student_pk,
  });
  return response;
};

const getLoggedInTutorSessionCalendar = async (): Promise<IServerResponse> => {
  const response = await PostFetch(
    API_DEFAULT_ROUTE + "getLoggedInTutorSessionCalendar",
    null
  );
  return response;
};

const getLoggedStudentCalendar = async (): Promise<IServerResponse> => {
  const response = await PostFetch(
    API_DEFAULT_ROUTE + "getLoggedStudentCalendar",
    null
  );
  return response;
};

export default {
  getClassSessionsApi,
  getTutorFutureSessionsApi,
  getTutorClassSessionCalendarApi,
  getStatsSessionCalendarApi,

  getAllMessage,
  saveMessage,
  hideMessage,
  getSingleClassSession,

  getTutorSessionCal,
  getStudentSessionCal,
  //
  getLoggedInTutorSessionCalendar,
  getLoggedStudentCalendar,
  //
  startClassSession,
  endClassSession,
  unattendedClassSession,
};
