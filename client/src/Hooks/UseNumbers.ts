const toDecimal = (
  num: any,
  decimal_places: number,
  replacement?: number | string
) => {
  try {
    const val = num.toFixed(decimal_places);

    return val;
  } catch (error) {
    return replacement;
  }
};

export default {
  toDecimal,
};
