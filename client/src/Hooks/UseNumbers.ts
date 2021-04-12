const toDecimal = (
  num: any,
  decimal_places: number,
  replacement?: number | string
) => {
  try {
    const val = parseInt(num).toFixed(decimal_places);

    return val;
  } catch (error) {
    return replacement;
  }
};

const toNumber = (num: any, replacement?: number): number => {
  try {
    const val = parseInt(num);

    return val;
  } catch (error) {
    return replacement;
  }
};

export default {
  toDecimal,
  toNumber,
};
