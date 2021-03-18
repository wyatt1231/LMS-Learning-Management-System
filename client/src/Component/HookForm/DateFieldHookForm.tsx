import DateFnsUtils from "@date-io/date-fns";
import { Grid } from "@material-ui/core";
import {
  KeyboardDatePicker,
  KeyboardDatePickerProps,
  KeyboardDateTimePicker,
  MuiPickersUtilsProvider,
} from "@material-ui/pickers";
import "date-fns";
import React from "react";
import { Controller, useFormContext } from "react-hook-form";

interface DateFieldHookFormProps extends Partial<KeyboardDatePickerProps> {
  name: string;
  onChange?: any;
  type: "date" | "datetime" | "time";
}

const DateFieldHookForm: React.FC<DateFieldHookFormProps> = React.memo(
  (props) => {
    const { control, errors } = useFormContext();

    console.log(`errors`, errors);

    let error = false;
    let error_message = "";

    if (errors && errors?.hasOwnProperty(props?.name)) {
      error = true;
      error_message = errors[props?.name]?.message;
    }

    return (
      <Controller
        control={control}
        name={props.name}
        defaultValue={props.defaultValue}
        render={({ onChange, onBlur, value }) => (
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <Grid container justify="space-around">
              {props.type === "datetime" && (
                <KeyboardDateTimePicker
                  {...props}
                  value={value}
                  onChange={onChange}
                  onBlur={onBlur}
                  format="yyyy/MM/dd hh:mm a"
                  fullWidth={true}
                  autoOk={true}
                  error={error}
                  helperText={error_message}
                />
              )}

              {props.type === "date" && (
                <KeyboardDatePicker
                  {...props}
                  onChange={onChange}
                  onBlur={onBlur}
                  value={value}
                  disableToolbar
                  format="MM/dd/yyyy"
                  fullWidth={true}
                  autoOk={true}
                  error={error}
                  helperText={error_message}
                />
              )}
            </Grid>
          </MuiPickersUtilsProvider>
        )}
        // name={props.name}
        // defaultValue={props.defaultValue}
        // onChange={props.onChange}
        // onBlur={props.onBlur}
        // variant={props.variant}
        // label={props.label}
        // style={props.style}
        // className={props.className}
        // color={props.color}
        // size={props.size}
        // InputLabelProps={props.InputLabelProps}
        // placeholder={props.placeholder}
        // fullWidth={props.fullWidth}
        // multiline={props.multiline}
        // rows={props.rows}
        // rowsMax={props.rowsMax}
        // error={error}
        // helperText={error_message}
      />
    );

    // return (
    //   <MuiPickersUtilsProvider utils={DateFnsUtils}>
    //     <Grid container justify="space-around">
    //       <KeyboardDatePicker
    //         {...field}
    //         onChange={handleChange}
    //         disableToolbar
    //         label={props.label}
    //         variant="inline"
    //         animateYearScrolling={true}
    //         disableFuture={disableFuture}
    //         disablePast={disablePast}
    //         format="MM/dd/yyyy"
    //         fullWidth={true}
    //         inputVariant={variant ? variant : "outlined"}
    //         InputLabelProps={{
    //           shrink: true,
    //         }}
    //         autoOk={true}
    //         error={!!errorText}
    //         helperText={errorText}
    //       />
    //     </Grid>
    //   </MuiPickersUtilsProvider>
    // );
  }
);

export default DateFieldHookForm;
