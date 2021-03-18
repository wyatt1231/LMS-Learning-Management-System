import { PostFetch } from "../../Hooks/UseFetch";
import IServerResponse from "../Interface/IServerResponse";
import { PaginationModel } from "../Models/PaginationModels";
import { TutorModel } from "../Models/TutorModels";
import { TutorRatingsModel } from "../Models/TutorRatingsModel";

const API_DEFAULT_ROUTE = `api/tutor/`;

export const getTutorDataTableApi = async (
  payload: PaginationModel
): Promise<IServerResponse> => {
  const response = await PostFetch(
    API_DEFAULT_ROUTE + "getTutorDataTable",
    payload
  );
  return response;
};

export const addTutorApi = async (
  payload: TutorModel
): Promise<IServerResponse> => {
  const response = await PostFetch(API_DEFAULT_ROUTE + "addTutor", payload);
  return response;
};

export const updateTutorApi = async (
  payload: TutorModel
): Promise<IServerResponse> => {
  const response = await PostFetch(API_DEFAULT_ROUTE + "updateTutor", payload);
  return response;
};

export const getSingleTutorApi = async (
  tutor_pk: string
): Promise<IServerResponse> => {
  const response = await PostFetch(API_DEFAULT_ROUTE + "getSingleTutor", {
    tutor_pk: tutor_pk,
  });
  return response;
};

export const searchTutorApi = async (
  search: string
): Promise<IServerResponse> => {
  const response = await PostFetch(API_DEFAULT_ROUTE + "searchTutor", {
    search,
  });
  return response;
};

export const getDummyTutorsApi = async (): Promise<IServerResponse> => {
  const response = await PostFetch(API_DEFAULT_ROUTE + "getDummyTutors", null);
  return response;
};

export const insertDummyTutorRatingsApi = async (
  payload: Array<TutorRatingsModel>
): Promise<IServerResponse> => {
  const response = await PostFetch(
    API_DEFAULT_ROUTE + "insertDummyTutorRatings",
    payload
  );
  return response;
};
