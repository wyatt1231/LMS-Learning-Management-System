import { CircularProgress } from "@material-ui/core";
import React, { memo, FC } from "react";

interface ICircularLoadingProgress {
  size?: number;
}

export const CircularLoadingProgress: FC<ICircularLoadingProgress> = memo(
  ({ size }) => {
    return (
      <>
        <div
          style={{
            display: `grid`,
            alignItems: `center`,
            alignContent: `center`,
            justifyContent: `center`,
            justifyItems: `center`,
            width: `100%`,
            padding: `1em`,
            margin: `1em`,
          }}
        >
          <CircularProgress size={size} />
        </div>
      </>
    );
  }
);

export default CircularLoadingProgress;
