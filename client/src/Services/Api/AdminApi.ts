import { PostFetch } from "../../Hooks/UseFetch";
import IServerResponse from "../Interface/IServerResponse";
import { AdminModel } from "../Models/AdminModel";
import { PaginationModel } from "../Models/PaginationModels";

const API_DEFAULT_ROUTE = `api/admin/`;

export const getAdminDataTableApi = async (
  payload: PaginationModel
): Promise<IServerResponse> => {
  const response = await PostFetch(
    API_DEFAULT_ROUTE + "getAdminDataTable",
    payload
  );
  return response;
};

export const addAdminApi = async (
  payload: AdminModel
): Promise<IServerResponse> => {
  const response = await PostFetch(API_DEFAULT_ROUTE + "addAdmin", payload);
  return response;
};

export const updateAdminApi = async (
  payload: AdminModel
): Promise<IServerResponse> => {
  const response = await PostFetch(API_DEFAULT_ROUTE + "updateAdmin", payload);
  return response;
};

export const getSingleAdminApi = async (
  admin_pk: string
): Promise<IServerResponse> => {
  const response = await PostFetch(API_DEFAULT_ROUTE + "getSingleAdmin", {
    admin_pk,
  });
  return response;
};

const getLoggedAdmin = async (): Promise<IServerResponse> => {
  const response = await PostFetch(API_DEFAULT_ROUTE + "getLoggedAdmin", null);
  return response;
};

const updateAdminInfo = async (
  payload: AdminModel
): Promise<IServerResponse> => {
  const response = await PostFetch(
    API_DEFAULT_ROUTE + "updateAdminInfo",
    payload
  );
  return response;
};

const updateAdminImage = async (
  payload: AdminModel
): Promise<IServerResponse> => {
  const response = await PostFetch(
    API_DEFAULT_ROUTE + "updateAdminImage",
    payload
  );
  return response;
};

const getTotalAdmin = async (): Promise<IServerResponse> => {
  const response = await PostFetch(API_DEFAULT_ROUTE + "getTotalAdmin", {});
  return response;
};

export default {
  getLoggedAdmin,
  updateAdminInfo,
  updateAdminImage,
  getTotalAdmin,
};
