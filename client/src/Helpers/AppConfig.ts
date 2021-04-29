export const APP_NAME: any = process.env.REACT_APP_NAME;
export const API_BASE_URL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:4040/"
    : "https://sleepy-reaches-37009.herokuapp.com/";

export const getAccessToken = (): string | null => {
  let token: string | null = null;
  try {
    const temp_storage: string | null = localStorage.getItem(APP_NAME);
    if (temp_storage) {
      token = JSON.parse(temp_storage).access_token;
    }
  } catch (error) {}

  return token;
};

export const getRefreshToken = (): string | null => {
  let token: string | null = null;
  try {
    const temp_storage: string | null = localStorage.getItem(APP_NAME);
    if (temp_storage) {
      token = JSON.parse(temp_storage).refresh_token;
    }
  } catch (error) {}

  return token;
};

export const setTokens = (acess_token: string, refresh_token: string) => {
  localStorage.setItem(
    APP_NAME,
    JSON.stringify({
      access_token: acess_token,
      refresh_token: refresh_token,
    })
  );
};

export const removeToken = () => {
  localStorage.removeItem(APP_NAME);
};
