import {
  Backdrop,
  CircularProgress,
  Typography,
  useTheme,
} from "@material-ui/core";
import React, { memo } from "react";

interface ILoadingDialog {
  open: boolean;
  loadingMessage: string;
}

const LoadingDialog: React.FC<ILoadingDialog> = memo(
  ({ open, loadingMessage }) => {
    if (!open) {
      return null;
    }

    const theme = useTheme();

    return (
      <Backdrop
        style={{
          zIndex: theme.zIndex.drawer + 1,
          color: "#fff",
          display: "grid",
          gridAutoFlow: "column",
          gridGap: "1em",
        }}
        open={open}
      >
        <CircularProgress color="inherit" />
        <Typography variant="subtitle1">{loadingMessage}</Typography>
      </Backdrop>
    );
  }
);

export default LoadingDialog;
