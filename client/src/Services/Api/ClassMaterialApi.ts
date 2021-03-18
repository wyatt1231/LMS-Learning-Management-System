import { PostFetch, PostFileFetch } from "../../Hooks/UseFetch";
import IServerResponse from "../Interface/IServerResponse";

const API_DEFAULT_ROUTE = `api/classmaterial/`;

const getTblClassMaterialApi = async (
  class_pk: number
): Promise<IServerResponse> => {
  const response = await PostFetch(API_DEFAULT_ROUTE + "getTblClassMaterial", {
    class_pk: class_pk,
  });
  return response;
};

const addClassMaterialApi = async (
  payload: FormData
): Promise<IServerResponse> => {
  const response = await PostFileFetch(
    API_DEFAULT_ROUTE + "addClassMaterial",
    payload
  );
  return response;
};

const deleteClassMaterialApi = async (
  mat_pk: number
): Promise<IServerResponse> => {
  const response = await PostFetch(API_DEFAULT_ROUTE + "deleteClassMaterial", {
    mat_pk,
  });
  return response;
};

export default {
  getTblClassMaterialApi,
  addClassMaterialApi,
  deleteClassMaterialApi,
};
