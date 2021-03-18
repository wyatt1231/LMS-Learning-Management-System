import { Container } from "@material-ui/core";
import styled from "styled-components";

export const StyledHomeStudent = styled(Container)`
  display: grid;
  grid-template-areas: "recommend recommend" "timeline class";
  grid-auto-columns: 1fr 300px;
  grid-gap: 2em;
  .content-title {
    font-size: 0.9em;
    font-weight: 700;
    opacity: 0.8;
    padding: 0.5em;
    border-bottom: 0.1em solid rgba(0, 0, 0, 0.1);
  }
  .recommended-tutor-ctnr {
    grid-area: recommend;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    border-radius: 0.7em;

    .recommendations {
      display: grid;
      grid-auto-flow: column;
      justify-content: start;
      justify-items: start;
      align-items: center;
      align-content: center;
      grid-gap: 2em;
      overflow-x: auto;
      margin: 0.5em;
      padding: 0.3em;

      .recommend-item {
        display: grid;
        grid-gap: 0.3em;
        .img {
          height: 9em;
          width: 8em;
        }
        .name {
          font-weight: 600;
          font-size: 0.9em;
        }
        .rating {
          font-weight: 500;
        }
      }
    }
  }

  .timeline-ctnr {
    grid-area: timeline;
    padding: 0.5em;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    border-radius: 0.7em;

    .timeline {
      display: grid;
      grid-gap: 1em;

      .timeline-item {
        display: grid;
        grid-gap: 0.5em;
        justify-content: start;
        justify-items: start;
        align-content: start;
        align-items: start;
        grid-auto-flow: column;
        border-bottom: 0.1em solid rgba(0, 0, 0, 0.15);
        padding: 0.7em 0;
        .img {
          grid-area: img;
        }
        .description {
          display: grid;
          grid-gap: 0.3em;
          .name {
            font-size: 0.95em;
            font-weight: 900;
          }
          .body {
            font-size: 0.87em;
          }

          .datetime {
            font-size: 0.7em;
          }
        }
      }
    }
  }

  .class-ctnr {
    grid-area: class;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    border-radius: 0.7em;
    padding: 0.5em;

    .classes {
      display: grid;
      grid-gap: 1.5em;

      .class-item {
        display: grid;
        grid-gap: 0.5em;
        align-content: start;
        align-items: start;
        .date {
          font-size: 0.95em;
          text-transform: uppercase;
          padding: 0.2em 0;
          border-bottom: 0.15em solid rgba(0, 0, 0, 0.1);
        }

        .title {
          font-weight: 900;
        }

        .time {
          font-size: 0.87em;
        }
      }
    }
  }
`;
