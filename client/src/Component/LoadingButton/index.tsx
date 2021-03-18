import { Button, CircularProgress } from "@material-ui/core";
import React from "react";
import { StyledLoadingButton } from "./styles";

interface IProps {
  // className :
  type: "button" | "submit" | "reset" | undefined;
  color?: "inherit" | "primary" | "secondary" | "default" | undefined;
  size?: "small" | "medium" | "large" | undefined;
  variant: "text" | "outlined" | "contained" | undefined;
  loading?: boolean;
  disabled?: boolean;
  handleClick?: () => void;
  fullWidth: boolean;
  className?: string | undefined;
  style?: any;
}

const LoadingButton: React.FC<IProps> = ({
  type,
  color,
  disabled,
  loading,
  variant,
  handleClick,
  size,
  fullWidth,
  className,
  children,
  style,
}) => {
  return (
    <StyledLoadingButton>
      <Button
        className={`btn ${className}`}
        type={type}
        color={color}
        variant={variant}
        size={size}
        disabled={disabled || loading}
        onClick={handleClick}
        fullWidth={fullWidth}
        style={style}
        disableElevation
      >
        {children}
      </Button>
      {loading && <CircularProgress size={22} className="loader" />}
    </StyledLoadingButton>
  );
};

export default LoadingButton;
