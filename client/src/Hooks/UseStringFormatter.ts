const StringEmptyToDefault = (
  originalString: string,
  defaultString: string
): string | undefined => {
  if (typeof originalString === "undefined") {
    return defaultString;
  } else {
    if (!originalString) {
      return defaultString;
    } else {
      return originalString.toString().trim() === ""
        ? defaultString
        : originalString;
    }
  }
};

const formatStringToNumber = (num: string | number): number | null => {
  if (typeof num === "number") {
    return num;
  }

  if (typeof num === "string") {
    const parse_num = parseInt(num);

    if (isNaN(parse_num)) {
      return null;
    } else {
      return parse_num;
    }
  } else {
    return null;
  }
};

export const formatStringToDecimal = (num: string | number): number | null => {
  if (typeof num === "number") {
    return num;
  }

  if (typeof num === "string") {
    const parse_num = parseFloat(num);

    if (isNaN(parse_num)) {
      return null;
    } else {
      return parse_num;
    }
  } else {
    return null;
  }
};

const nullToEmptyString = (str: null | string | number) => {
  if (!str) {
    return "";
  }

  if (str === null) {
    return "";
  }

  return str;
};

export { StringEmptyToDefault, formatStringToNumber, nullToEmptyString };
