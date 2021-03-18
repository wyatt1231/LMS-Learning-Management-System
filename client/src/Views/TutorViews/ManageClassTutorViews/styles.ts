import styled from "styled-components";

export const ManageClassSelectedSessionTutorStyle = styled.div`
  color: #333;

  .main-dtls-ctnr {
    display: grid;
    grid-gap: 0.3em;
    grid-auto-flow: row;
    justify-content: start;
    justify-items: start;
    align-items: center;
    align-content: center;
    background-color: #fff;
    width: 100%;

    .sub-title-cntr {
      display: grid;
      grid-gap: 1em;
      grid-auto-flow: column;
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
  }

  .task-ctnr {
    background-color: #fff;
    padding: 0.5em;
    display: grid;
    grid-gap: 0.5em;
    align-content: start;
    height: 100%;
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
  }
  .info-ctnr {
    background-color: #fff;
    padding: 0.5em;
    display: grid;
    grid-gap: 1em;
    align-content: start;

    .tabs {
      width: 100%;
      /* .tab-item {
        padding: 0.5em;
        font-weight: 500;
        text-transform: uppercase;
        font-size: 0.9em;

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
      } */
    }

    .student-tab {
      height: 490px;
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
      /* grid-auto-rows: 400px 100px; */
      grid-gap: 0.3em;
      .sent-msg-ctnr {
        height: 410px;
        overflow-y: scroll;
        display: grid;
        align-items: start;
        align-content: start;

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
        padding: 0.3em 0;
        display: grid;
        align-self: start;
        align-items: center;
        align-content: center;
        grid-auto-columns: 1fr auto;
        grid-auto-flow: column;
        grid-gap: 4px;

        /* .write-btn {
          margin-top: 200px;
          margin-right: 34px;
          width: 150px;
          height: 45px;
          background: black;
          float: right;
          position: absolute;
          bottom: 10px;
          transition: height 2s ease-in-out;

          &:hover {
            height: 180px;
          }
        } */
      }
    }
  }
`;
