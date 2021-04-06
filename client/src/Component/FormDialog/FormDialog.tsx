import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Tooltip,
  useMediaQuery,
} from "@material-ui/core";
import CancelPresentationIcon from "@material-ui/icons/CancelPresentation";
import { useTheme } from "@material-ui/styles";
import React, { memo, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import styled from "styled-components";

interface IFormDialog {
  open: boolean;
  title: string;
  handleClose?: () => void;
  body?: any;
  actions?: any;
  minWidth?: number;
  fullScreen?: boolean;
  scroll?: "body" | "paper";
  maxWidth?: false | "xs" | "sm" | "md" | "lg" | "xl";
  hideCloseButton?: boolean;
}

export const FormDialog: React.FC<IFormDialog> = memo(
  ({
    children,
    open,
    title,
    handleClose,
    body,
    actions,
    minWidth,
    fullScreen,
    scroll,
    maxWidth,
    hideCloseButton,
  }) => {
    const theme = useTheme();
    const descriptionElementRef = useRef<any>(null);
    const mobile = useMediaQuery((theme: any) => theme.breakpoints.down("sm"));
    const dispatch = useDispatch();
    const { radResultNo } = useParams<any>();

    useEffect(() => {
      let mounted = true;

      const initializeData = () => {};

      mounted && open && initializeData();

      return () => {
        mounted = false;
      };
    }, [dispatch, radResultNo, open]);

    useEffect(() => {
      let mounted = true;

      if (open && mounted) {
        const { current: descriptionElement } = descriptionElementRef;
        if (descriptionElement !== null) {
          descriptionElement.focus();
        }
      }

      return () => {
        mounted = false;
      };
    }, [open]);

    return (
      <Dialog
        open={open}
        scroll={scroll ? scroll : "body"}
        disableBackdropClick={true}
        disableEscapeKeyDown={true}
        fullScreen={fullScreen}
        maxWidth={maxWidth}
        PaperProps={{
          style: {
            margin: 0,
            padding: 0,
            minWidth: mobile
              ? "95%"
              : typeof minWidth === "undefined"
              ? 750
              : minWidth,
          },
        }}
      >
        <DialogTitleStyle theme={theme} disableTypography={true}>
          <div className="title">{title}</div>
        </DialogTitleStyle>

        <DialogContentStyle theme={theme}>{body}</DialogContentStyle>
        <DialogActionsStyle className="form-footer">
          {actions}

          {!hideCloseButton && (
            <Button color="secondary" variant="contained" onClick={handleClose}>
              Close
            </Button>
          )}
        </DialogActionsStyle>
      </Dialog>
    );
  }
);

export default FormDialog;

const DialogTitleStyle = styled(DialogTitle)`
  /* background-color: ${(p) => p.theme.palette.primary.light}; */
  /* color: ${(p) => p.theme.palette.primary.contrastText}; */
  /* font-size: 0.87em; */
  display: grid;
  grid-auto-flow: column;
  align-items: center;
  align-content: center;
  grid-gap: 1em;
  border-bottom: 0.02em solid rgba(0, 0, 0, 0.2);

  .title {
    font-weight: 600;
  }

  .toolbar {
    justify-self: end;
    display: grid;
    grid-auto-flow: column;
    grid-gap: 0.5em;
    color: ${(p) => p.theme.palette.primary.contrastText};
    align-items: center;
    align-content: center;

    .MuiSvgIcon-root {
      color: ${(p) => p.theme.palette.primary.contrastText};
    }
  }
`;

const DialogContentStyle = styled(DialogContent)`
  /* margin: 0;
  padding: 0; */
  background-color: ${(p) => p.theme.palette.common.white};
`;
const DialogActionsStyle = styled(DialogActions)`
  /* background-color: #f0f0f0; */
`;
