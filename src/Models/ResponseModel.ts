export interface ResponseModel {
  success: boolean;
  message?: string;
  data?: any;
  errors?: Array<string>;
}
