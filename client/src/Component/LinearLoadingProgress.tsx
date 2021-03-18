import { LinearProgress } from "@material-ui/core";
import React, { memo } from "react";

interface ILinearLoadingProgress {
  show: boolean;
}

const LinearLoadingProgress: React.FC<ILinearLoadingProgress> = memo(
  ({ show }) => {
    return (
      <div
        style={{
          opacity: show ? 1 : 0,
        }}
      >
        <LinearProgress />
      </div>
    );
  }
);

export default LinearLoadingProgress;
