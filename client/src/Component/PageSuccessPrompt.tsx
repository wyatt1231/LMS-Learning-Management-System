import {
  Avatar,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Slide,
  Typography,
} from "@material-ui/core";
import CheckRoundedIcon from "@material-ui/icons/CheckRounded";
import React, { memo } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import { setPageSuccessPromptAction } from "../Services/Actions/PageActions";
import { RootStore } from "../Services/Store";

const Transition: any = React.forwardRef(function Transition(
  props: any,
  ref: any
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export const PageSuccessPrompt = memo(() => {
  const dispatch = useDispatch();
  const page_success_prompt = useSelector(
    (store: RootStore) => store.PageReducer.page_success_prompt
  );

  return (
    <StyledSuccessDialog
      open={page_success_prompt?.show ? page_success_prompt?.show : false}
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
        <div
          style={{
            fontSize: `1rem`,
            fontWeight: 900,
            color: `#2196f3`,
          }}
        >
          {page_success_prompt?.message}
        </div>
      </DialogContent>
      <div className="dialog-actions">
        <small>What do you want to do next?</small>

        {page_success_prompt?.action_buttons?.map((b, i) => (
          <Button
            key={i}
            color={b.color}
            disableElevation={false}
            onClick={() => {
              if (typeof b.handleClick === "function") {
                dispatch(
                  setPageSuccessPromptAction({
                    show: false,
                  })
                );
                b.handleClick();
              }
            }}
          >
            <span
              style={{
                fontWeight: 700,
                fontSize: `.9em`,
              }}
            >
              {b.text}
            </span>
          </Button>
        ))}
      </div>
    </StyledSuccessDialog>
  );
});

export default PageSuccessPrompt;

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
