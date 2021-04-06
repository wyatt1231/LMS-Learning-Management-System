import { Avatar, useTheme } from "@material-ui/core";
import React, { memo } from "react";
interface ICustomAvatar {
  src: string | null;
  errorMessage: string;
  className?: string;
  variant?: "circle" | "rounded" | "square";
  widthSpacing?: number;
  heightSpacing?: number;
  style?: any;
}

const CustomAvatar: React.FC<ICustomAvatar> = memo(
  ({
    src,
    errorMessage,
    className,
    widthSpacing,
    heightSpacing,
    variant,
    style,
  }) => {
    const theme = useTheme();
    return src === "" || src === "null" || src === null || !src ? (
      <Avatar
        className={className}
        style={{
          height: theme.spacing(heightSpacing ? heightSpacing : 5),
          width: theme.spacing(widthSpacing ? widthSpacing : 5),
          backgroundColor: `#1565c0`,
          color: `#fff3e0`,
          ...style,
        }}
        variant={variant}
      >
        <div
          style={{
            textAlign: "center",
            textTransform: "uppercase",
            fontSize: `.7em`,
            fontWeight: 900,
            letterSpacing: ".3pt",
          }}
        >
          {errorMessage}
        </div>
      </Avatar>
    ) : (
      <Avatar
        className={className}
        style={{
          height: theme.spacing(heightSpacing ? heightSpacing : 5),
          width: theme.spacing(widthSpacing ? widthSpacing : 5),
          ...style,
        }}
        src={`data:image/jpg;base64,${src}`}
        variant={variant}
      />
    );
  }
);

export default CustomAvatar;
