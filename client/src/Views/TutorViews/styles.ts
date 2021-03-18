import { Container } from "@material-ui/core";
import styled from "styled-components";

export const StyledCalendarTutorView = styled(Container)`
  /* display: grid; */
  /* width: 100%; */
  /* grid-auto-flow: column; */
  /* grid-auto-columns: 230px 1fr; */
  /* grid-gap: 2em; */

  .statistics {
    .title {
      font-weight: 900;
      opacity: 0.6;
      font-size: 0.87em;
      padding: 0.3em 0;
      margin: 1em 0;
    }
  }

  .stats-content {
    display: grid;
    grid-gap: 0.5em;

    .stats-item {
      padding: 0.5em;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      border-radius: 5px;
      display: grid;
      grid-auto-flow: column;
      justify-content: start;
      justify-items: start;
      align-items: center;
      align-content: center;
      grid-auto-columns: 1fr 1fr;
      grid-gap: 1em;
      .label {
        font-weight: 900;
        font-size: 0.7em;
        opacity: 0.8;
      }
      .value {
        font-size: 1.2em;
        font-weight: 700;
      }
      small {
        font-weight: 900;
        font-size: 0.5em !important;
        opacity: 0.8;
      }
    }
  }
`;
