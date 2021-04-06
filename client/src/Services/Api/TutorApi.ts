import { PostFetch } from "../../Hooks/UseFetch";
import IServerResponse from "../Interface/IServerResponse";
import { PaginationModel } from "../Models/PaginationModels";
import { TutorFavModel } from "../Models/TutorFavModel";
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

export const getSingleTutorApi = async (
  tutor_pk: string
): Promise<IServerResponse> => {
  const response = await PostFetch(API_DEFAULT_ROUTE + "getSingleTutor", {
    tutor_pk: tutor_pk,
  });
  return response;
};

const getSingTutorToStudent = async (
  tutor_pk: number
): Promise<IServerResponse> => {
  const response = await PostFetch(
    API_DEFAULT_ROUTE + "getSingTutorToStudent",
    {
      tutor_pk: tutor_pk,
    }
  );
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

const updateTutorImage = async (
  payload: TutorModel
): Promise<IServerResponse> => {
  const response = await PostFetch(
    API_DEFAULT_ROUTE + "updateTutorImage",
    payload
  );
  return response;
};

const toggleActiveStatus = async (
  tutor_pk: number
): Promise<IServerResponse> => {
  const response = await PostFetch(API_DEFAULT_ROUTE + "toggleActiveStatus", {
    tutor_pk,
  });
  return response;
};

const updateTutor = async (payload: TutorModel): Promise<IServerResponse> => {
  const response = await PostFetch(API_DEFAULT_ROUTE + "updateTutor", payload);
  return response;
};

const getTotalTutors = async (): Promise<IServerResponse> => {
  const response = await PostFetch(API_DEFAULT_ROUTE + "getTotalTutors", {});
  return response;
};

const getLoggedInTutor = async (): Promise<IServerResponse> => {
  const response = await PostFetch(API_DEFAULT_ROUTE + "getLoggedInTutor", {});
  return response;
};

const updateLoggedInTutorBio = async (
  payload: TutorModel
): Promise<IServerResponse> => {
  const response = await PostFetch(
    API_DEFAULT_ROUTE + "updateLoggedInTutorBio",
    payload
  );
  return response;
};

const rateTutor = async (
  payload: TutorRatingsModel
): Promise<IServerResponse> => {
  const response = await PostFetch(API_DEFAULT_ROUTE + "rateTutor", payload);
  return response;
};

const favoriteTutor = async (
  payload: TutorFavModel
): Promise<IServerResponse> => {
  const response = await PostFetch(
    API_DEFAULT_ROUTE + "favoriteTutor",
    payload
  );
  return response;
};

const getMostRatedTutors = async (): Promise<IServerResponse> => {
  const response = await PostFetch(
    API_DEFAULT_ROUTE + "getMostRatedTutors",
    null
  );
  return response;
};

export default {
  updateTutorImage,
  toggleActiveStatus,
  updateTutor,
  getTotalTutors,
  getLoggedInTutor,
  updateLoggedInTutorBio,
  rateTutor,
  favoriteTutor,
  getSingTutorToStudent,
  getMostRatedTutors,
};
