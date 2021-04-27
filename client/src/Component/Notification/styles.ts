import styled from "styled-components";

export const StyledNotification = styled.div``;

export const StyledNotificationPopOver = styled.div`
  width: 360px;

  .content-header {
    overflow: hidden;
    color: ${(p) => p.theme.palette.primary.contrastText} !important;
    background-color: ${(p) => p.theme.palette.primary.light}!important;
    box-shadow: 0 2px 3px rgba(0, 0, 0, 0.2);
    display: grid;
    align-content: center;
    justify-content: center;
    align-items: center;
    justify-items: center;
    grid-gap: 0.5em;
    padding: 1em;
    .title {
      font-size: 1em;
      font-weight: 600;
    }

    .subtitle {
      font-size: 1em;
      font-weight: 400;
    }
  }

  .content-body {
    padding: 1.5em;
    padding-top: 1em;
    font-size: 0.87em;

    .content-title {
      font-weight: 600;
      color: rgba(0, 0, 0, 0.6);
    }
    .content-items {
      margin-top: 0.5em;
      display: grid;
      grid-gap: 0.5em;
    }
    .link {
      padding: 0.5em 0;
      border-bottom: 1px solid rgba(0, 0, 0, 0.2);
      color: rgba(0, 0, 0, 0.6);
      &:hover {
        color: blue;
      }
    }

    .notif-item-ctnr {
      display: grid;
      grid-gap: 0.8em;
      margin-top: 0.3em;

      .notif-item {
        display: grid;
        grid-gap: 0.3em;
        border-bottom: 2px solid rgba(0, 0, 0, 0.1);
        padding: 0.5em;

        &:hover {
          background-color: #f5f5f5;
          border-radius: 7px;
          cursor: pointer;
        }

        .body {
          color: black !important;
        }

        .dt {
          color: rgba(0, 0, 0, 0.6);
          font-weight: 500;
          &.checked {
            color: blue !important;
          }
        }
      }
    }
  }
`;
