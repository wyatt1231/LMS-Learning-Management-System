import {
  Checkbox,
  FormControl,
  FormControlLabel,
  FormControlProps,
  FormGroup,
  FormHelperText,
  FormLabel,
  Grid,
  Radio,
  RadioGroup,
} from "@material-ui/core";
import { useField } from "formik";
import React, { memo } from "react";

interface IOptions {
  id: string | number;
  label: string | number;
}

interface IFormikRadio {
  data: Array<IOptions>;
  label: string;
  name: string;
  variant: "vertical" | "horizontal";
  required?: boolean;
}

const FormikRadio: React.FC<IFormikRadio> = memo(
  ({ name, variant, label, data, required, ...props }) => {
    const [field, meta] = useField(name);
    const errorText = meta.error && meta.touched ? meta.error : "";

    return (
      <FormControl
        required={required ? true : false}
        error={!!errorText}
        component="fieldset"
      >
        <FormLabel
          style={{
            transform: "translate(14px, -6px) scale(0.75)",
            transformOrigin: " top left",
          }}
        >
          {label}
        </FormLabel>
        <RadioGroup
          aria-label={name}
          {...field}
          value={field.value ? field.value : ""}
          style={
            variant === "vertical"
              ? {
                  display: "grid",
                  gridAutoFlow: "column",
                  alignItems: "center",
                  alignContent: "center",
                  marginTop: `-5px`,
                }
              : null
          }
        >
          {data.map((option, index) => (
            <FormControlLabel
              key={index}
              value={option.id}
              control={<Radio size="small" color="primary" />}
              label={option.label}
            />
          ))}
        </RadioGroup>
        <FormHelperText>{errorText}</FormHelperText>
      </FormControl>
    );
  }
);

export default FormikRadio;
