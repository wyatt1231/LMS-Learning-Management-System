import moment from "moment";

export const displayMySqlDate = (
  date: string,
  replaceEmpty?: string
): string | undefined => {
  const parsedDate = new Date(date);
  if (!moment(parsedDate).isValid) {
    return replaceEmpty;
  }
  return moment(parsedDate).format("MMM. DD, YYYY");
};

export const displayMySqlDateTime = (date: string): string | null => {
  const parsedDate = new Date(date);
  if (!moment(parsedDate).isValid) {
    return null;
  }

  const parsedData = moment(parsedDate).format("MMM. DD, YYYY hh:mm A");

  if (!moment(parsedData).isValid()) {
    return "-";
  }

  return parsedData;
};

export const displayMySqlTime = (time: string): string | null => {
  return moment(time, "hh:mm:ss").format("HH:mm a");
};

export const displaySex = (sex: "m" | "f") => {
  if (sex.toLocaleLowerCase() === "m") {
    return "Male";
  }
  if (sex.toLocaleLowerCase() === "f") {
    return "Female";
  }
};

export const dateParseJsToAspDate = (date: Date): any => {
  return moment(new Date(date)).format("LLLL");
};

export const InvalidTimeToDefault = (
  date: Date | null | string,
  defaultString: string
): string => {
  if (!date) {
    return defaultString;
  }

  const time = moment(date, "HH:mm:ss").format("hh:mm a");

  if (time.toLowerCase() === "invalid date") {
    return defaultString;
  }
  return time;
};

export const InvalidDateToDefault = (
  date: Date | null | string,
  defaultString: string
): string => {
  if (!date) {
    return defaultString;
  }

  const d = moment(date).format("MMM DD, YYYY");

  if (d.toLowerCase() === "invalid date") {
    return defaultString;
  }
  return d;
};

export const InvalidDateTimeToDefault = (
  date: Date | null | string,
  defaultString: string
): string => {
  if (!date) {
    return defaultString;
  }

  const d = moment(date).format("MMM DD, YYYY hh:mm a");

  if (d.toLowerCase() === "invalid date") {
    return defaultString;
  }
  return d;
};

export const parseTimeOrDefault = (
  time: string,
  defaultString: string
): string => {
  if (!time) {
    return defaultString;
  }

  const moment_time = moment(time, "HH:mm:ss");

  if (moment_time.isValid()) {
    const t = moment_time.format("HH:mma");

    return t;
  } else {
    return defaultString;
  }
};

export const parseDateOrDefault = (
  date: Date | string | null,
  defaultString: string
): string => {
  if (!date) {
    return defaultString;
  }

  const d = moment(date).format("MMM DD, YYYY");

  if (d.toLowerCase() === "invalid date") {
    return defaultString;
  }
  return d;
};

export const parseDateAndDayOfWeekOrDefault = (
  date: Date | string | null,
  defaultString: string
): string => {
  if (!date) {
    return defaultString;
  }

  const d = moment(date).format("dddd, MMM DD, YYYY");

  if (d.toLowerCase() === "invalid date") {
    return defaultString;
  }
  return d;
};

export const parseDateTimeOrDefault = (
  date: Date | string,
  defaultString: string
): string => {
  if (!date) {
    return defaultString;
  }

  const d = moment(date).format("MMM DD, YYYY HH:mm a");

  if (d.toLowerCase() === "invalid date") {
    return defaultString;
  }
  return d;
};
