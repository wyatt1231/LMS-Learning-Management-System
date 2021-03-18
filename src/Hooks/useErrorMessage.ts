const default_error_message = `External server error has occured. Please contact the administrator for assistance`;

export const ErrorMessage = (error: any): string => {
  if (error) {
    if (error?.sqlMessage && typeof error?.sqlMessage === "string") {
      return error?.sqlMessage;
    }

    if (typeof error === "string") {
      return error;
    }
  }

  return default_error_message;
};
