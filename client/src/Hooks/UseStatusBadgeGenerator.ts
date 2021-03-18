const UseStatusBadgeGenerator = (status: string) => {
  if (!status || typeof status === "undefined") {
    return "";
  }

  if (status.toUpperCase().includes("OCCUPIED")) {
    return "badge-blue";
  } else if (status.toUpperCase().includes("RESERVED")) {
    return "badge-orange";
  } else if (status.toUpperCase().includes("AVAILABLE")) {
    return "badge-green";
  } else if (status.toUpperCase().includes("CLEANING")) {
    return "badge-red";
  } else if (status.toUpperCase().includes("ROOM OUT")) {
    return "";
  }
};

export default UseStatusBadgeGenerator;
