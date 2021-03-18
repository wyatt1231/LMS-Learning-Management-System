import {
  FormControl,
  InputLabel,
  OutlinedInput,
  InputAdornment,
  IconButton,
} from "@material-ui/core";
import { useField } from "formik";
import React, { memo, FC } from "react";
import VisibilityOffRoundedIcon from "@material-ui/icons/VisibilityOffRounded";
import VisibilityRoundedIcon from "@material-ui/icons/VisibilityRounded";
import VpnKeyRoundedIcon from "@material-ui/icons/VpnKeyRounded";

interface IFieldPassword {
  showPassword: boolean;
  handleTogglePassword: () => void;
}

export const FieldPassword: FC<IFieldPassword> = memo(
  ({ showPassword, handleTogglePassword }) => {
    const [field] = useField({ name: "password" });
    return (
      <FormControl fullWidth variant="outlined">
        <InputLabel htmlFor="outlined-adornment-amount">Password</InputLabel>
        <OutlinedInput
          type={showPassword ? "text" : "password"}
          id="outlined-adornment-amount"
          startAdornment={
            <InputAdornment position="start">
              <VpnKeyRoundedIcon fontSize="small" />
            </InputAdornment>
          }
          endAdornment={
            <div>
              {showPassword ? (
                <IconButton
                  size="small"
                  onClick={handleTogglePassword}
                  color="primary"
                >
                  <VisibilityRoundedIcon fontSize="small" />
                </IconButton>
              ) : (
                <IconButton
                  size="small"
                  onClick={handleTogglePassword}
                  color="primary"
                >
                  <VisibilityOffRoundedIcon fontSize="small" />
                </IconButton>
              )}
            </div>
          }
          labelWidth={75}
          {...field}
        />
      </FormControl>
    );
  }
);

export default FieldPassword;
