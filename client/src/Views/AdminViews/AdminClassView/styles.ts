import { Container } from "@material-ui/core";
import styled from "styled-components";

export const StyledManageClassAdmin = styled(Container)`
  .container-body {
    background-color: #fff;
    border-radius: 10px;
    padding: 0.5em 1em !important;
    height: 100%;
    width: 100%;
  }

  .class-profile {
    display: grid;
    align-content: start;
    align-items: start;
    justify-items: center;
    justify-content: center;

    .title {
      margin-top: 0.3em;
      font-weight: 500;
      padding: 0.2em 0;
      font-size: 1.3em;
    }
    .sub-title {
      font-size: 0.9em;
      font-weight: 500;
      opacity: 0.8;
      padding: 0.3em 0;
    }

    .rating {
      font-weight: 500;
      padding: 0.3em 0;
      display: grid;
      align-content: center;
      align-items: center;
      grid-auto-flow: column;
      grid-gap: 0.3em;
      margin-bottom: 1em;
    }

    .remarks {
      margin-top: 0.5em;
      font-size: 0.8em;
      padding: 0.5em 1em;
      border-radius: 10px;
      background-color: #f5f5f5;
    }
  }

  .other-info-container {
    justify-self: start;
    display: grid;
    /* grid-gap: 1em; */
    align-items: start;
    align-content: start;

    .form-group {
      padding: 0.7em 0;
      border-bottom: 0.01em solid rgba(0, 0, 0, 0.1);
      display: grid;
      grid-auto-flow: column;
      grid-auto-columns: auto 1fr;
      justify-content: start;
      justify-items: start;
      grid-gap: 1.3em;
      font-size: 0.9em;
      align-items: center;
      align-content: center;

      .label {
        font-weight: 400;
        opacity: 0.8;
      }
      .value {
        font-weight: 500;

        &.profile {
          display: grid;
          align-items: center;
          align-content: center;
          grid-auto-flow: column;
          grid-gap: 0.5em;
          justify-content: start;
        }
      }
    }
  }
`;
