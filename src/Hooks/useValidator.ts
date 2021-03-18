export const isValidPicture = (picture: any): boolean => {
  if (typeof picture !== "undefined" && picture !== "" && picture !== null) {
    return true;
  } else {
    return false;
  }
};
