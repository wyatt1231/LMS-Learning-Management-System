export default (status: string | null): string => {
  if (status) {
    if (status.toLowerCase() === "pending") {
      return "badge-orange";
    } else if (status.toLowerCase() === "working") {
      return "badge-red";
    } else if (status.toLowerCase() === "finished") {
      return "badge-green";
    } else if (status.toLowerCase() === "acknowledged") {
      return "badge-blue";
    } else if (status.toLowerCase() === "removed") {
      return "badge-black";
    } else if (status.toLowerCase() === "cancelled") {
      return "badge-purple";
    } else {
      return "badge-default";
    }
  } else {
    return "badge-default";
  }
};
