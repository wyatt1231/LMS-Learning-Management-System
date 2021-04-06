import { Container } from "@material-ui/core";
import styled from "styled-components";

export const StyledAdminProfile = styled(Container)`
  .portion-container {
    background-color: #fff;
    border-radius: 10px;
    padding: 1em;
    height: 100%;
  }

  .profile-container {
    display: grid;
    align-content: start;
    align-items: start;
    padding-left: 2em;
    padding-right: 2em;
    justify-content: center;
    justify-items: center;
    grid-gap: 1em;

    .actions {
      display: grid;
      grid-gap: 0.5em;
      padding: 1em;
    }
  }

  .activity-container {
    .activities {
      height: 500px;
      overflow-y: auto;
      .activity-item {
        display: grid;
        border-bottom: 0.01em solid rgba(0, 0, 0, 0.1);
        padding: 0.5em;
        font-size: 0.9em;
        .body {
          font-size: 0.87em;
          padding: 0.2em 0;
        }
        .time {
          font-size: 0.7em;
          opacity: 0.6;
          font-weight: 500;
          padding: 0.2em 0;
        }
      }
    }
  }

  .form-group {
    display: grid;
    grid-auto-flow: column;
    grid-gap: 1em;
    justify-content: start;
    grid-auto-columns: auto 1fr;
    padding: 0.5em 0;
    border-bottom: 0.01em solid rgba(0, 0, 0, 0.1);
    font-size: 0.9em;

    &.small {
      font-size: 0.78em;
    }
    &.row {
      grid-auto-flow: row !important;
      grid-auto-columns: unset !important;
      grid-gap: 0.3em;
      width: 100%;
    }

    .label {
      opacity: 0.7;
      font-weight: 400;
    }
    .value {
      font-weight: 500;
    }
  }
`;
