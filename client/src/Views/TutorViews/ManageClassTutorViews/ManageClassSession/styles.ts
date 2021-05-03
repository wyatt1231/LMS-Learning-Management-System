import styled from "styled-components";

export const StyledSelectedSession = styled.div`
  /* color: #333; */

  .main-details-container {
    display: grid;
    justify-content: center;
    justify-items: center;
    grid-gap: 1em;

    .actions {
      display: grid;
      grid-gap: 0.3em;
      padding: 0 1.5em;
      justify-content: center;
      justify-items: center;
    }
  }

  .sub-details-container {
    display: grid;
    grid-auto-flow: row;
    justify-content: start;
    justify-items: start;
    align-items: start;
    align-content: start;
    width: 100%;
    .sub-title-cntr {
      display: grid;
      align-items: start;
      align-content: start;
      .sub-title {
        font-size: 0.85em;
        display: grid;
        grid-auto-flow: column;
        grid-gap: 0.5em;
        align-items: center;
        justify-content: start;
        justify-items: start;
      }
    }

    .remarks {
      margin: 0.3em 0;
      padding: 0.5em;
      background-color: #f5f5f5;
      border-radius: 10px;
      font-size: 0.8em;
    }
  }

  .task-ctnr {
    background-color: #fff;
    padding: 0.5em;
    display: grid;
    grid-gap: 0.5em;
    align-content: start;
    height: 100%;
    border-radius: 10px;
    align-items: start;
    .ctnr-title {
      justify-content: start;
      align-content: start;
    }

    .actions {
      display: grid;
      justify-content: end;
      align-items: center;
      padding: 0.5em 0;
    }

    .task-data-ctnr {
      display: grid;
      grid-gap: 1em;
      align-self: start;
      align-items: start;
      align-content: start;

      .task-item {
        display: grid;
        /* grid-gap: 0.3em; */
        padding: 0.5em;
        border: 0.01em solid rgba(0, 0, 0, 0.1);
        border-radius: 7px;
        .title {
          font-weight: 600;
          padding: 0.2em 0;
        }
        .group {
          font-size: 0.8em;
          font-weight: 400;
          display: grid;
          grid-auto-flow: column;
          grid-gap: 0.3em;
        }
        .desc {
          font-size: 0.85em;
          padding: 1em 0;
        }
      }
    }
  }

  .vid-ctnr {
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    border: 1px solid rgba(0, 0, 0, 0.1);
    border-radius: 10px;
    height: 600px;
    background-color: #fff;
    border-radius: 10px;
    overflow: hidden;
  }
  .info-ctnr {
    background-color: #fff;
    padding: 0.5em;
    display: grid;
    grid-gap: 1em;
    border-radius: 10px;
    align-content: start;
    height: 100%;
    min-height: 100%;
    width: 100%;
    grid-auto-rows: auto auto 1fr;

    .tabs {
      width: 100%;
      .tab-item {
        padding: 0.5em;
        font-weight: 500;
        text-transform: capitalize;
        font-size: 0.87em;

        &:hover {
          cursor: pointer;
          background-color: rgba(0, 0, 0, 0.05);
          border-radius: 5px;
        }

        &.active {
          transition: 0.3s all ease-in-out !important;
          color: blue !important;
          border-bottom: 1px solid blue !important;
        }
      }
    }

    .student-tab {
      height: 100%;
      overflow-y: auto;
      .student-item {
        display: grid;
        grid-auto-flow: column;
        align-items: center;
        justify-content: start;
        grid-gap: 0.5em;
        padding: 0.3em 0;
        border-bottom: 2px solid rgba(0, 0, 0, 0.1);
        .img {
          font-size: 0.87em;
          font-weight: 700;
        }
        .name {
          font-weight: 500;
          font-size: 0.9em;
        }
      }
    }

    .chat-tab {
      display: grid;
      align-items: start;
      align-content: start;
      grid-gap: 0.3em;
      height: 100%;
      max-height: 100%;
      min-height: 100%;

      .sent-msg-ctnr {
        overflow-y: auto;
        display: grid;
        align-items: start;
        align-content: start;

        max-height: calc(100%-100px) !important;
        height: calc(100%-100px) !important;
        min-height: calc(100%-100px) !important;
        max-height: 380px;
        min-height: 380px;
        .sent-msg-item {
          display: grid;
          padding: 0.7em;
          grid-template-areas: "img name time" "img msg msg";
          grid-auto-columns: auto 1fr;
          grid-auto-rows: auto 1fr;
          align-items: center;
          align-content: start;
          justify-content: start;
          justify-items: start;
          border-bottom: 0.01em solid rgba(0, 0, 0, 0.1);

          .img {
            margin-right: 0.5em;
            align-self: end;
          }
          .time {
            font-size: 0.67em;
            justify-self: end;
            align-self: center;
            padding: 0 0.3em;
          }
          .name {
            grid-area: name;
            font-size: 0.75em;
            font-weight: 600;
            padding: 0 0.3em;
            align-self: center;
          }
          .message {
            grid-area: msg;
            border-radius: 10px;
            padding: 0.5em;
            align-self: start;
            font-weight: 500;
            font-size: 0.9em;
            background-color: #e4e6eb;
          }
        }
      }

      .write-msg-ctnr {
        height: 100px;
        padding: 0.3em 0;
        display: grid;
        align-self: start;
        align-items: center;
        align-content: center;
        grid-auto-columns: 1fr auto;
        grid-auto-flow: column;
        grid-gap: 4px;
      }
    }
  }
`;
