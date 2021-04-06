import { Container } from "@material-ui/core";
import styled from "styled-components";

export const StyledDashboardStudent = styled(Container)`
  .prof-pic {
    grid-area: img;
    margin-right: 1em;
    display: grid;
    align-items: center;
    align-content: center;
    justify-items: center;
    justify-content: center;
  }
  .profile-container {
    display: grid;
    grid-template-areas: "img greeting" "img bio" "img info";
    grid-gap: 0.3em;
    grid-auto-columns: auto 1fr;
    align-content: start;
    align-items: start;
    height: 100%;
    width: 100%;
    background-color: #fff;
    padding: 1em;
    border-radius: 10px;

    .greeting {
      grid-area: greeting;
      font-size: 1.8em;
      font-weight: 500;
    }

    .bio {
      grid-area: bio;
      padding: 0.7em;
      background-color: #f5f5f5;
      font-size: 0.83em;
      border-radius: 10px;
      justify-self: start;
      display: grid;
      justify-content: start;
    }

    .info-group-container {
      grid-area: info;
      display: grid;
      align-items: start;
      align-content: start;
      font-size: 1em;

      .value {
        font-weight: 500;
        display: grid;
        align-items: center;
        grid-auto-flow: column;
        align-content: center;
        justify-content: start;
        grid-gap: 0.5em;
      }
    }
  }

  .recommendation-cntr {
    height: 100%;
    width: 100%;
    background-color: #fff;
    padding: 1em;
    border-radius: 10px;

    .body {
      min-height: 600px;
      max-height: 600px;
      font-size: 0.8em;
      display: grid;
      grid-gap: 1em;
      align-content: start;
      align-items: start;
      overflow-y: auto;

      .rec-class-item {
        display: grid;
        grid-gap: 0.3em;
        justify-items: start;
        margin: 0 1em;
        /* justify-content: start; */
        padding: 0.5em 1em;
        background-color: #fafafa;
        border-radius: 7px;

        .class,
        .tutor {
          display: grid;
          grid-auto-flow: column;
          justify-content: start;
          justify-items: start;
          grid-gap: 0.5em;
          align-items: center;
          align-content: center;
          .title {
            font-weight: 600;
          }
          .name {
            font-weight: 500;
          }
        }

        .class-sub {
          display: grid;
          grid-auto-flow: column;
          width: 100%;
          grid-gap: 1em;
          align-items: center;
          align-content: center;
          grid-auto-columns: 1fr 1fr;
          .status {
            justify-self: end;
          }
          .rating {
            justify-self: start;
          }
        }
      }
    }
  }

  .schedule-container {
    /* height: 700px; */
    width: 100%;
    background-color: #fff;
    padding: 1em;
    border-radius: 10px;
  }
`;
