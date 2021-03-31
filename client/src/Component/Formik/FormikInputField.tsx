import { TextField, TextFieldProps } from "@material-ui/core";
import { useField } from "formik";
import React from "react";

const FormikInputField = (props: TextFieldProps) => {
  const [field, meta] = useField(
    typeof props.name !== "undefined" ? props.name : ""
  );
  const errorText = meta.error && meta.touched ? meta.error : "";

  return (
    <TextField
      {...props}
      {...field}
      value={field.value ? field.value : ""}
      error={!!errorText}
      helperText={errorText}
    />
  );
};

export default FormikInputField;
