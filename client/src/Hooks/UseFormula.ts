export const CalculateBmi = (weight: number, height: number) => {
  const bmi = weight / (height * height);

  console.log(`bmi`, bmi);

  if (isNaN(bmi)) {
    return null;
  } else {
    return bmi.toFixed(4);
  }
};
