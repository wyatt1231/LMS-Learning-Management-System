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

const startClassSessionApi = async (
  payload: ClassSessionModel
): Promise<IServerResponse> => {
  const response = await PostFetch(
    API_DEFAULT_ROUTE + "startClassSession",
    payload
  );
  return response;
};

const endClassSessionApi = async (
  payload: ClassSessionModel
): Promise<IServerResponse> => {
  const response = await PostFetch(
    API_DEFAULT_ROUTE + "endClassSession",
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

export default {
  getClassSessionsApi,
  getTutorFutureSessionsApi,
  getTutorClassSessionCalendarApi,
  getStatsSessionCalendarApi,
  startClassSessionApi,
  endClassSessionApi,
  getAllMessage,
  saveMessage,
  hideMessage,
  getSingleClassSession,
};
