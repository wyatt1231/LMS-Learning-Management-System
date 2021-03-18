export const generateGender = (gender: any): string => {
  if (gender?.toLowerCase() === "m") {
    return "Male";
  }
  if (gender?.toLowerCase() === "f") {
    return "Female";
  }
  return "";
};
