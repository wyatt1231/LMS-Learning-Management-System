import { PostFetch } from "../../Hooks/UseFetch";
import IServerResponse from "../Interface/IServerResponse";
import { UserLogin } from "../Models/UserModel";

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
