import { Slide } from "@material-ui/core";
import {
  Avatar,
  Dialog,
  DialogContent,
  DialogTitle,
  Typography,
} from "@material-ui/core";
import CheckRoundedIcon from "@material-ui/icons/CheckRounded";
import React, { FC, memo } from "react";
import styled from "styled-components";
interface ISuccessDialog {
  open: boolean;
  message: string;
}

const Transition: any = React.forwardRef(function Transition(
  props: any,
  ref: any
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export const SuccessDialog: FC<ISuccessDialog> = memo(
  ({ children, open, message }) => {
    return (
      <StyledSuccessDialog
        open={open}
        scroll="body"
        disableBackdropClick={true}
        disableEscapeKeyDown={true}
        TransitionComponent={Transition}
        PaperProps={{
          style: {
            margin: 0,
            padding: 0,
            borderRadius: 10,
            width: 400,
            overflowY: "visible",
          },
        }}
      >
        <DialogTitle>
          <div
            style={{
              display: "grid",
              justifyItems: "center",
              justifyContent: "center",
              marginTop: "-50px",
            }}
          >
            <Avatar
              style={{
                height: "3.5em",
                width: "3.5em",
                backgroundColor: "#8bc34a",
              }}
            >
              <CheckRoundedIcon fontSize="large" />
            </Avatar>
          </div>
        </DialogTitle>

        <DialogContent className="dialog-content">
          <Typography variant="h5" gutterBottom>
            Successful!
          </Typography>
          <Typography gutterBottom>{message}</Typography>
        </DialogContent>
        <div className="dialog-actions">
          <small>What do you want to do next?</small>
          <>{children}</>
        </div>
      </StyledSuccessDialog>
    );
  }
);

export default SuccessDialog;

const StyledSuccessDialog = styled(Dialog)`
  .dialog-content {
    margin-top: -15px;
    margin-bottom: 1em;
    text-align: center;
  }
  .dialog-actions {
    margin: 1em;
    display: grid;
    grid-gap: 0.3em;
    grid-auto-flow: row;
    width: 100%;
    justify-items: start;
    justify-content: start;
  }
`;
