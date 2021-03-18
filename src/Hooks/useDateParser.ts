import moment from "moment";

export const parseInvalidDateToDefault = (
  date: Date | string,
  defaultString?: string
): string | null => {
  const d = moment(date);

  if (d.isValid()) {
    return d.format("YYYY-MM-DD");
  } else {
    if (typeof defaultString === "string") {
      return defaultString;
    } else {
      null;
    }
  }
  return null;
};

export const parseInvalidTimeToDefault = (
  date: string,
  defaultString?: string
): string | null => {
  const d = moment(date, "hh:mm A");

  if (d.isValid()) {
    return d.format("HH:mm:ss");
  } else {
    if (typeof defaultString === "string") {
      return defaultString;
    } else {
      null;
    }
  }
  return null;
};

export const parseInvalidDateTimeToDefault = (
  date: Date | string,
  defaultString?: string
): string | null => {
  const d = moment(date);

  if (d.isValid()) {
    return d.format("YYYY-MM-DD HH:mm:ss");
  } else {
    if (typeof defaultString === "string") {
      return defaultString;
    } else {
      null;
    }
  }
  return null;
};
