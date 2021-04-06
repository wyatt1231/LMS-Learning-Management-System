import { PostFetch } from "../../Hooks/UseFetch";
import IServerResponse from "../Interface/IServerResponse";
import { PaginationModel } from "../Models/PaginationModels";
import { RoomModel } from "../Models/RoomModel";

const API_DEFAULT_ROUTE = `api/room/`;

const getRoomDataTableApi = async (
  payload: PaginationModel
): Promise<IServerResponse> => {
  const response = await PostFetch(
    API_DEFAULT_ROUTE + "getRoomDataTable",
    payload
  );
  return response;
};

const addRoomApi = async (payload: RoomModel): Promise<IServerResponse> => {
  const response = await PostFetch(API_DEFAULT_ROUTE + "addRoom", payload);
  return response;
};

const getSingleRoomApi = async (room_pk: string): Promise<IServerResponse> => {
  const response = await PostFetch(API_DEFAULT_ROUTE + "getSingleRoom", {
    course_pk: room_pk,
  });
  return response;
};

const searchRoomApi = async (search: string): Promise<IServerResponse> => {
  const response = await PostFetch(API_DEFAULT_ROUTE + "searchRoom", {
    search,
  });
  return response;
};

const updateRoom = async (payload: RoomModel): Promise<IServerResponse> => {
  const response = await PostFetch(API_DEFAULT_ROUTE + "updateRoom", payload);
  return response;
};

const toggleRoomStatus = async (room_pk: number): Promise<IServerResponse> => {
  const response = await PostFetch(API_DEFAULT_ROUTE + "toggleRoomStatus", {
    room_pk,
  });
  return response;
};

const getTotalRoom = async (): Promise<IServerResponse> => {
  const response = await PostFetch(API_DEFAULT_ROUTE + "getTotalRoom", {});
  return response;
};

export default {
  getRoomDataTableApi,
  addRoomApi,
  getSingleRoomApi,
  searchRoomApi,
  updateRoom,
  toggleRoomStatus,
  getTotalRoom,
};
