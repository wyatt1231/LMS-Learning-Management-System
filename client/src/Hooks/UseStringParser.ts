export const UseStringNullOrEmptyToDashed = (str: string) => {
  if (str?.trim().length > 0) {
    return str;
  }

  return "-";
};
