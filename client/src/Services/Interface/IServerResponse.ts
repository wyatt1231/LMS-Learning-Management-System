interface IServerResponse {
  success: boolean;
  data?: any;
  message?: string | number | null;
  fileContent?: any;
  errors?: [IServerResponse];
}

interface IServerError {
  key: string;
  message: string;
}

export default IServerResponse;
