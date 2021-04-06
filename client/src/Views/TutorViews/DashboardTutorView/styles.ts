import { Container } from "@material-ui/core";
import styled from "styled-components";

export const StyledDashboardTutor = styled(Container)`
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

    .prof-pic {
      grid-area: img;
      margin-right: 1em;
      display: grid;
      align-items: center;
      align-content: center;
    }

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

  .schedule-container {
    /* height: 700px; */
    width: 100%;
    background-color: #fff;
    padding: 1em;
    border-radius: 10px;
  }
`;
