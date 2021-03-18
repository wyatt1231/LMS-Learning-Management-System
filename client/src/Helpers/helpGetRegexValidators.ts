import * as yup from "yup";

export const validateEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
// export const validateMobile = /^[0][1-9]\d{9}$|^[1-9]\d{9}$/;
export const validateMobile = /^(\+639)\d{9}$/;

export const validateUsernameLength = /^(?=.{8,20}$)/;
export const validateUsernameAllowedChar = /[a-zA-Z0-9._]/;
export const validateUsernameBeginChar = /(?![_.])/;
export const validateUsernameEndChar = /(?<![_.])/;

export const validateUsername = (label) => {
  const validatedUsername = yup
    .string()
    .label(label)
    .required()
    .matches(
      validateUsernameBeginChar,
      `${label} must not begin special characters period(.) or underscore(_)`
    )
    .matches(
      validateUsernameAllowedChar,
      `${label} must not contain special characters except (._)`
    )
    .matches(
      validateUsernameLength,
      `${label} must be 8 characters short and 20 characters long`
    )
    .matches(
      validateUsernameEndChar,
      `${label} must not end special characters period(.) or underscore(_)`
    );

  return validatedUsername;
};

export const validatePassword = (label) => {
  const validatedUsername = yup
    .string()
    .label(label)
    .required()
    .matches(
      /^(?=.*[0-9])[a-zA-Z0-9!@#$%^&_*]{6,25}$/,
      `${label} must be 6 to 25 characters long with numbers and special characters`
    );
  return validatedUsername;
};
