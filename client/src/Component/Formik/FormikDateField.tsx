import DateFnsUtils from "@date-io/date-fns";
import { Grid } from "@material-ui/core";
import {
  KeyboardDatePicker,
  MuiPickersUtilsProvider,
} from "@material-ui/pickers";
import "date-fns";
import { useField } from "formik";
import moment from "moment";
import React from "react";

interface IFormikDateField {
  name: string;
  label?: string;
  disableFuture?: boolean;
  disablePast?: boolean;
  variant?: "outlined" | "standard" | "filled";
  clearable?: boolean;
}

const FormikDateField: React.FC<IFormikDateField> = React.memo(
  ({ name, label, disableFuture, disablePast, variant, clearable }) => {
    const [field, meta, handlers] = useField(name);
    const errorText = meta.error && meta.touched ? meta.error : "";

    const handleChange = (date) => {
      handlers.setValue(moment(date).format());
    };

    return (
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <Grid container justify="space-around">
          <KeyboardDatePicker
            {...field}
            onChange={handleChange}
            // disableToolbar
            label={label}
            variant="inline"
            animateYearScrolling={true}
            disableFuture={disableFuture}
            disablePast={disablePast}
            format="MM/dd/yyyy"
            clearable={clearable}
            fullWidth={true}
            inputVariant={variant ? variant : "outlined"}
            InputLabelProps={{
              shrink: true,
            }}
            autoOk={true}
            error={!!errorText}
            helperText={errorText}
          />
        </Grid>
      </MuiPickersUtilsProvider>
    );
  }
);

export default FormikDateField;
