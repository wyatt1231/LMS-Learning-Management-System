import React, { memo, FC } from "react";
import StarRateRoundedIcon from "@material-ui/icons/StarRateRounded";

interface IAverageRating {
  value?: number;
}

export const AverageRating: FC<IAverageRating> = memo(({ value }) => {
  return (
    <div
      style={{
        display: `grid`,
        fontWeight: 600,
        alignItems: `center`,
        alignContent: `center`,
        justifyContent: `start`,
        // gridGap: `.5em`,
        gridAutoFlow: `column`,
      }}
    >
      {value}
      <StarRateRoundedIcon
        style={{
          color: `yellow`,
        }}
      />
    </div>
  );
});

export default AverageRating;
