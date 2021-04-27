import { PostFetch } from "../../Hooks/UseFetch";
import IServerResponse from "../Interface/IServerResponse";
import { UserLogin, UserModel } from "../Models/UserModel";

const API_DEFAULT_ROUTE = `api/users/`;

export const CurrentUserApi = async (): Promise<IServerResponse> => {
  const response = await PostFetch(API_DEFAULT_ROUTE + "currentUser", null);
  return response;
};

export const LoginApi = async (
  payload: UserLogin
): Promise<IServerResponse> => {
  const response = await PostFetch(API_DEFAULT_ROUTE + "login", payload);
  return response;
};

const changeAdminPassword = async (
  payload: UserModel
): Promise<IServerResponse> => {
  const response = await PostFetch(
    API_DEFAULT_ROUTE + "changeAdminPassword",
    payload
  );
  return response;
};

const checkUserNotif = async (
  notif_user_pk: number
): Promise<IServerResponse> => {
  const response = await PostFetch(API_DEFAULT_ROUTE + "checkUserNotif", {
    notif_user_pk,
  });
  return response;
};

const getUserLogs = async (): Promise<IServerResponse> => {
  const response = await PostFetch(API_DEFAULT_ROUTE + "getUserLogs", null);
  return response;
};

const getAllLogs = async (): Promise<IServerResponse> => {
  const response = await PostFetch(API_DEFAULT_ROUTE + "getAllLogs", null);
  return response;
};

const getUserNotif = async (): Promise<IServerResponse> => {
  const response = await PostFetch(API_DEFAULT_ROUTE + "getUserNotif", null);
  return response;
};

export default {
  changeAdminPassword,
  getUserLogs,
  getAllLogs,
  getUserNotif,
  checkUserNotif,
};
