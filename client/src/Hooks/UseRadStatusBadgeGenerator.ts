export const generateStudyBadgeColor = (studyStatus: string): string => {
  // "red" | "yellow" | "green" | "default"
  if (studyStatus === "DRAFT") {
    return "badge-blue";
  }

  if (studyStatus === "CHARGE") {
    return "badge-green";
  }

  if (studyStatus === "FINAL") {
    return "badge-default";
  }

  if (studyStatus === "PERFORMED") {
    return "badge-yellow";
  }
  return "";
};
