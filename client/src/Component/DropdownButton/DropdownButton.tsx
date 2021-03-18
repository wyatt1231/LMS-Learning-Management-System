import Button from "@material-ui/core/Button";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import Grid from "@material-ui/core/Grid";
import Grow from "@material-ui/core/Grow";
import MenuItem from "@material-ui/core/MenuItem";
import MenuList from "@material-ui/core/MenuList";
import Paper from "@material-ui/core/Paper";
import Popper from "@material-ui/core/Popper";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import React from "react";

interface IDropdownButton {
  buttonText: string;
  options: Array<IDropdownOptions>;
  StartIcon?: any;
  color?: "primary" | "secondary";
  size?: "small" | "medium";
}

interface IDropdownOptions {
  label: string;
  disabled?: boolean;
  handleClick?: () => void;
}

const DropdownButton: React.FC<IDropdownButton> = React.memo(
  ({ buttonText, options, color, size, StartIcon }) => {
    const [open, setOpen] = React.useState(false);
    const anchorRef = React.useRef<HTMLDivElement>(null);

    const handleClick = React.useCallback(() => {
      console.log(`clicked`);
    }, []);

    const handleMenuItemClick = (
      event: React.MouseEvent<HTMLLIElement, MouseEvent>,
      callback?: () => void
    ) => {
      if (typeof callback !== "undefined") {
        callback();
      }
      setOpen(false);
    };

    const handleToggle = React.useCallback(() => {
      setOpen((prevOpen) => !prevOpen);
    }, []);

    const handleClose = React.useCallback(
      (event: React.MouseEvent<Document, MouseEvent>) => {
        if (
          anchorRef.current &&
          anchorRef.current.contains(event.target as HTMLElement)
        ) {
          return;
        }
        setOpen(false);
      },
      []
    );

    return (
      <Grid container direction="column" alignItems="center">
        <Grid item xs={12}>
          <ButtonGroup
            variant="contained"
            color={color}
            ref={anchorRef}
            size={size}
            aria-label="split button"
          >
            <Button
              startIcon={StartIcon ? <StartIcon /> : null}
              onClick={handleClick}
            >
              {buttonText}
            </Button>
            <Button
              color={color}
              size={size}
              aria-controls={open ? "split-button-menu" : undefined}
              aria-expanded={open ? "true" : undefined}
              aria-label="select merge strategy"
              aria-haspopup="menu"
              onClick={handleToggle}
            >
              <ArrowDropDownIcon />
            </Button>
          </ButtonGroup>
          <Popper
            open={open}
            anchorEl={anchorRef.current}
            role={undefined}
            transition
            style={{ zIndex: 3 }}
            disablePortal
          >
            {({ TransitionProps, placement }) => (
              <Grow
                {...TransitionProps}
                style={{
                  transformOrigin:
                    placement === "bottom" ? "center top" : "center bottom",
                }}
              >
                <Paper>
                  <ClickAwayListener onClickAway={handleClose}>
                    <MenuList id="split-button-menu">
                      {options.map((option, index) => (
                        <MenuItem
                          key={option.label}
                          disabled={option.disabled}
                          // selected={index === selectedIndex}
                          onClick={(event) =>
                            handleMenuItemClick(event, option.handleClick)
                          }
                          style={{ backgroundColor: `#fff` }}
                        >
                          <span
                            style={{
                              fontSize: `.89em`,
                              fontWeight: 400,
                              color: "#333",
                            }}
                          >
                            {option.label}
                          </span>
                        </MenuItem>
                      ))}
                    </MenuList>
                  </ClickAwayListener>
                </Paper>
              </Grow>
            )}
          </Popper>
        </Grid>
      </Grid>
    );
  }
);

export default DropdownButton;
