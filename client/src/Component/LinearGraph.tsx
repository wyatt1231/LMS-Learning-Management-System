import React, { FC, memo } from "react";

interface ILinearGraph {
  progress_count: number;
  total: number;
}

export const LinearGraph: FC<ILinearGraph> = memo(
  ({ progress_count, total }) => {
    const perc = (progress_count / total) * 100;

    return (
      <div
        style={{
          display: `grid`,
        }}
      >
        <div
          style={{
            justifySelf: `end`,
            fontWeight: 600,
            opacity: 0.8,
            fontSize: `.87em`,
          }}
        >
          {progress_count} of {total}
        </div>
        <div
          style={{
            minWidth: 200,
            backgroundColor: `black`,
            display: `grid`,
            gridAutoFlow: `column`,
            gridAutoColumns: `${perc}% ${100 - perc}%`,
            borderRadius: `10px`,
            overflow: `hidden`,
          }}
        >
          <div
            style={{
              backgroundColor: `#0686f0`,
              minHeight: 10,
            }}
          ></div>
          <div
            style={{
              backgroundColor: `#f5dcdc`,
              minHeight: 10,
            }}
          ></div>
        </div>
      </div>
    );
  }
);

export default LinearGraph;
