import { MenuItem, TextField, TextFieldProps } from "@material-ui/core";
import { useField } from "formik";
import React from "react";

interface IOptions {
  id: string | number;
  label: string | number;
}

interface IFormikSelect {
  data: Array<IOptions>;
  label: string;
  name: string;
  hasEmptyValue?: boolean;
}

export const FormikSelect: React.FC<IFormikSelect & TextFieldProps> = ({
  data,
  name,
  hasEmptyValue,
  ...props
}) => {
  const [field, meta] = useField({ name });
  const errorText = meta.error && meta.touched ? meta.error : "";

  return (
    <TextField
      id="outlined-select-currency"
      error={!!errorText}
      helperText={errorText}
      {...props}
      {...field}
      label={props.label}
      variant="outlined"
      select
    >
      {hasEmptyValue === true && (
        <MenuItem value={""}>
          <small>
            <em>None</em>
          </small>
        </MenuItem>
      )}

      {data.map((val, ind) => (
        <MenuItem key={ind} value={val.id}>
          {val.label}
        </MenuItem>
      ))}
    </TextField>
  );
};

export default FormikSelect;
