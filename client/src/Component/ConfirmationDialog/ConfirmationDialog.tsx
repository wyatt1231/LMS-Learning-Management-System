import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  useTheme,
} from "@material-ui/core";
import WarningIcon from "@material-ui/icons/Warning";
import React, { memo, useEffect, useRef } from "react";
import styled from "styled-components";

interface IConfirmationDialog {
  isOpen: boolean;
  handleContinue: () => void;
  handleCancel: () => void;
  askMessage: string;
}

const ConfirmationDialog: React.FC<IConfirmationDialog> = memo(
  ({ isOpen, handleContinue, handleCancel, askMessage }) => {
    const descriptionElementRef = useRef<any>(null);
    const theme = useTheme();

    useEffect(() => {
      let mounted = true;

      if (isOpen && mounted) {
        const { current: descriptionElement } = descriptionElementRef;
        if (descriptionElement !== null) {
          descriptionElement.focus();
        }
      }

      return () => {
        mounted = false;
      };
    }, [isOpen]);

    return (
      <Dialog
        open={isOpen}
        scroll="paper"
        disableBackdropClick={true}
        disableEscapeKeyDown={true}
      >
        <DialogTitleStyle theme={theme} disableTypography={true}>
          <WarningIcon className="warning-icon" />
          <div>Confirmation Dialog</div>
        </DialogTitleStyle>
        <DialogContentStyle theme={theme}> {askMessage}</DialogContentStyle>
        <DialogFooterStyle theme={theme}>
          <Button color="secondary" variant="contained" onClick={handleCancel}>
            Cancel
          </Button>
          <Button color="primary" variant="contained" onClick={handleContinue}>
            Continue
          </Button>
        </DialogFooterStyle>
      </Dialog>
    );
  }
);

export default ConfirmationDialog;

const DialogTitleStyle = styled(DialogTitle)`
  background-color: ${(p) => p.theme.header.backgroundColor};
  color: ${(p) => p.theme.palette.common.white};
  display: grid;
  grid-auto-flow: column;
  justify-items: start;
  justify-content: start;
  font-size: 0.87em;
  align-items: center;
  align-content: center;
  font-weight: 900;
  grid-gap: 0.5em;

  .warning-icon {
    color: orangered;
  }
`;

const DialogContentStyle = styled(DialogContent)`
  background-color: ${(p) => p.theme.palette.common.white};
  font-size: 1.3em;
  font-weight: 500;
  display: grid;
  justify-content: center;
  justify-items: center;
  align-content: center;
  align-items: center;
  text-align: center;
`;

const DialogFooterStyle = styled(DialogActions)`
  display: grid;
  grid-auto-flow: column;
  grid-gap: 1em;
  justify-content: end;
  justify-items: end;
  align-items: center;
  align-content: center;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
`;
