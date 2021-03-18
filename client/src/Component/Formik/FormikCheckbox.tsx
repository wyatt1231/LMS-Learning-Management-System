import {
  Checkbox,
  FormControl,
  FormControlLabel,
  FormControlProps,
  FormGroup,
  FormHelperText,
  FormLabel,
  Grid,
} from "@material-ui/core";
import { useField } from "formik";
import React, { memo } from "react";

interface IOptions {
  id: string | number;
  label: string | number;
}

interface IFormikCheckbox {
  data: Array<IOptions>;
  label: string;
  name: string;
}

const FormikCheckbox: React.FC<IFormikCheckbox & FormControlProps> = memo(
  ({ name, label, data, ...props }) => {
    const [field, meta, setters] = useField(name);
    const errorText = meta.error && meta.touched ? meta.error : "";
    return (
      <FormControl error={!!errorText}>
        {label ? (
          <FormLabel className="checkbox-label">{label}</FormLabel>
        ) : null}

        <FormGroup>
          <Grid container spacing={0}>
            {data &&
              data.map((val, ind) => (
                <Grid key={ind} xs={12} item>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={field.value.includes(val.id)}
                        name={name}
                        value={val.id}
                        color={props.color}
                        size={props.size}
                        onChange={() => {
                          let nextValue = null;

                          if (field.value.includes(val.id)) {
                            nextValue = field.value.filter(
                              (value) => value !== val.id
                            );
                          } else {
                            nextValue = field.value.concat(val.id);
                          }

                          nextValue && setters.setValue(nextValue);
                        }}
                      />
                    }
                    label={val.label}
                  />
                </Grid>
              ))}
          </Grid>
        </FormGroup>
        <FormHelperText>{errorText}</FormHelperText>
      </FormControl>
    );
  }
);

export default FormikCheckbox;
