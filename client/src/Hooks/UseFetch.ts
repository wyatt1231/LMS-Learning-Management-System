import axios, { AxiosInstance } from "axios";
import qs from "qs";
import {
  API_BASE_URL,
  getAccessToken,
  getRefreshToken,
  removeToken,
  setTokens,
} from "../Helpers/AppConfig";
import IServerResponse from "../Services/Interface/IServerResponse";

export const Axios: AxiosInstance = axios.create();

export const GetFetch = async (endpoint: string): Promise<IServerResponse> => {
  try {
    const serverResponse: IServerResponse = await Axios.get(
      API_BASE_URL + endpoint,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getAccessToken()}`,
        },
      }
    );

    return serverResponse.data;
  } catch (error) {
    return {
      success: false,
      message: `Fetch request error: ${error}`,
    };
  }
};

export const PostFetch = async (
  endpoint: string,
  data: any
): Promise<IServerResponse> => {
  try {
    const serverResponse: IServerResponse = await Axios.post(
      API_BASE_URL + endpoint,
      data,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getAccessToken()}`,
        },
      }
    );
    return serverResponse.data;
  } catch (error) {
    return {
      success: false,
      message: `Fetch request error: ${error}`,
    };
  }
};

export const PostFileFetch = async (
  endpoint: string,
  form_data: FormData
): Promise<IServerResponse> => {
  try {
    const serverResponse: IServerResponse = await Axios.post(
      API_BASE_URL + endpoint,
      form_data,
      {
        headers: {
          Authorization: `Bearer ${getAccessToken()}`,
        },
      }
    );
    return serverResponse.data;
  } catch (error) {
    return {
      success: false,
      message: `Fetch request error: ${error}`,
    };
  }
};

let isRefreshing = false;
let refreshSubscribers: Array<any> = [];

Axios.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const {
      config,
      response: { status },
    } = error;
    const originalRequest = config;

    if (status === 409) {
      removeToken();
      window.location.href = "/login";
    }

    if (status === 401) {
      if (!isRefreshing) {
        isRefreshing = true;

        const refresh_token = getRefreshToken();

        if (refresh_token) {
          axios({
            method: "post",
            url: API_BASE_URL + `api/token`,
            data: qs.stringify({
              grant_type: "refresh_token",
              refresh_token: refresh_token,
            }),
            headers: {
              "content-type": "application/x-www-form-urlencoded;charset=utf-8",
            },
          })
            .then((response) => {
              setTokens(
                response.data.access_token,
                response.data.refresh_token
              );

              isRefreshing = false;
              onRrefreshed(response.data.access_token);
              refreshSubscribers = [];
            })
            .catch((err) => {
              removeToken();
              alert(
                `Ops, it seems that your session is no longer valid. Please login again.`
              );
              window.location.href = "/login";
            });
        } else {
          window.location.href = "/login";
        }
      }

      const retryOrigReq = new Promise((resolve, reject) => {
        subscribeTokenRefresh((token: any) => {
          originalRequest.headers["Authorization"] = "Bearer " + token;
          resolve(axios(originalRequest));
        });
      });
      return retryOrigReq;
    } else {
      return Promise.reject(error);
    }
  }
);

const subscribeTokenRefresh = (cb: any) => {
  refreshSubscribers.push(cb);
};

const onRrefreshed = (token: string) => {
  refreshSubscribers.map((cb) => cb(token));
};
