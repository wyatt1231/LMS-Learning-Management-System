import { Button, IconButton, Paper, Popover } from "@material-ui/core";
import MoreHorizRoundedIcon from "@material-ui/icons/MoreHorizRounded";
import React, { memo } from "react";
import styled from "styled-components";
interface IIconButtonPopper {
  buttonColor?: "inherit" | "primary" | "secondary" | "default" | undefined;
  iconColor?:
    | "inherit"
    | "disabled"
    | "action"
    | "primary"
    | "secondary"
    | "error"
    | undefined;
  buttons: Array<IButtonItem>;
  style?: React.CSSProperties;
  className?: string;
}

interface IButtonItem {
  text: string;
  Icon?: any;
  disabled?: boolean;
  handleClick?: () => void;
  color?: "inherit" | "primary" | "secondary" | "default" | undefined;
}

const IconButtonPopper: React.FC<IIconButtonPopper> = memo(
  ({ buttonColor, className, iconColor, buttons, style }) => {
    const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
      null
    );

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
      setAnchorEl(null);
    };

    const open = Boolean(anchorEl);
    const id = open ? "simple-popover" : undefined;

    return (
      <div style={style} className={className}>
        <IconButton
          color={buttonColor}
          // color={buttonColor}
          aria-describedby={id}
          onClick={handleClick}
          // size="small"
          style={{
            backgroundColor: `rgba(255, 255, 255, 0.9)`,
            color: `#333`,
          }}
        >
          <MoreHorizRoundedIcon color={iconColor} />
        </IconButton>
        <Popover
          id={id}
          open={open}
          anchorEl={anchorEl}
          onClose={handleClose}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "center",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "center",
          }}
        >
          <PopperContent>
            {buttons.map((btn: IButtonItem, index: number) => (
              <Button
                key={index}
                color={btn.color}
                className="btn"
                onClick={() => {
                  handleClose();
                  if (typeof btn.handleClick !== "undefined") {
                    btn.handleClick();
                  }
                }}
                startIcon={btn.Icon ? <btn.Icon fontSize="small" /> : null}
                disableElevation
                disabled={btn.disabled}
              >
                <span style={{ fontWeight: 700, fontSize: `.87em` }}>
                  {btn.text}
                </span>
              </Button>
            ))}
          </PopperContent>
        </Popover>
      </div>
    );
  }
);

export default IconButtonPopper;

const PopperContent = styled(Paper)`
  padding: 1em 0.5em;
  display: grid;
  grid-gap: 0.5em;
  min-width: 150px;

  .btn {
  }
  .MuiButton-label {
    display: grid;
    grid-auto-flow: column;
    grid-gap: 0.5em;
    justify-content: start;
    justify-items: start;
    align-items: center;
    align-content: center;
  }
`;
