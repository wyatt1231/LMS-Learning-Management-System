export const strReplaceNullOrEmpty = (
  str: string | null,
  strReplacement: string
) => {
  if (!str) {
    return strReplacement;
  }

  if (str.trim() === "") {
    return strReplacement;
  }

  return str;
};
