import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@material-ui/core";
import CloseRoundedIcon from "@material-ui/icons/CloseRounded";
import React, { FC, memo } from "react";
import styled from "styled-components";
interface InfoDialogInterface {
  open: boolean;
  handleSetOpen: (open: boolean) => void;
  title: any;
  width?: number;
}

export const InfoDialog: FC<InfoDialogInterface> = memo(
  ({ open, handleSetOpen, children, title, width }) => {
    return (
      <StyledPagePrompt
        open={open}
        scroll="body"
        disableBackdropClick={true}
        onEscapeKeyDown={() => {
          handleSetOpen(false);
        }}
        PaperProps={{
          style: {
            margin: 0,
            padding: 0,
            borderRadius: 10,
            width: width ? width : 400,
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
            }}
          >
            {title}
          </div>
        </DialogTitle>

        <DialogContent className="dialog-content">{children}</DialogContent>

        <DialogActions className="dialog-actions">
          <Button
            color="secondary"
            variant="contained"
            startIcon={<CloseRoundedIcon fontSize="small" />}
            onClick={() => handleSetOpen(false)}
            disableElevation
          >
            Close
          </Button>
        </DialogActions>
      </StyledPagePrompt>
    );
  }
);

export default InfoDialog;

const StyledPagePrompt = styled(Dialog)`
  .dialog-content {
    margin-bottom: 1em;
    text-align: center;
    .big-text {
      color: red;
      font-weight: 600;
      font-size: 1.1em;
    }
    .small-text {
      font-size: 0.87em;
    }
  }
`;
