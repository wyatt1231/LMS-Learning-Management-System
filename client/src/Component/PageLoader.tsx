import {
  Backdrop,
  CircularProgress,
  Typography,
  useTheme,
} from "@material-ui/core";
import React, { memo, FC } from "react";
import { useSelector } from "react-redux";
import { RootStore } from "../Services/Store";
interface IPageLoader {}

export const PageLoader: FC<IPageLoader> = memo(() => {
  const theme = useTheme();

  const { show, loading_message } = useSelector(
    (state: RootStore) => state.PageReducer.page_loading
  );

  return (
    <Backdrop
      style={{
        zIndex: theme.zIndex.modal + 100,
        color: "#fff",
        display: "grid",
        gridAutoFlow: "column",
        gridGap: "1em",
      }}
      open={show}
    >
      <CircularProgress color="inherit" />
      <Typography variant="subtitle1">{loading_message}</Typography>
    </Backdrop>
  );
});

export default PageLoader;
