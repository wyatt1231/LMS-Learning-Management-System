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

        .tutor {
          display: grid;
          grid-template-areas: "img name" "img rate";
          grid-auto-columns: auto 1fr;
          align-items: center;
          align-content: center;
          .tutor_img {
            grid-area: img;
            margin-right: 0.5em;
          }
          .tutor_name {
            grid-area: name;
            font-weight: 500;

            &:hover {
              cursor: pointer;
              color: blue;
              transition: 0.3s all ease-in-out;
            }
          }
          .tutor_rating {
            grid-area: rate;
          }
        }

        .classes {
          display: grid;
          grid-gap: 0.3em;
          width: 100%;
          .class-item {
            padding: 0.3em;
            display: grid;
            grid-auto-flow: column;
            grid-auto-columns: auto 1fr;
            grid-gap: 0.3em;
            align-items: center;
            align-content: center;
            /* justify-items: start; */
            border-radius: 7px;
            background-color: #fff;
            width: 100%;

            &:hover {
              cursor: pointer;
              box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
              color: blue;
              transition: 0.3s all ease-in-out;
            }
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
