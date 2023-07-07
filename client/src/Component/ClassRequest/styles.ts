import styled from "styled-components";

export const StyledActivity = styled.div`
  display: grid;
  justify-content: start;
  grid-template-areas: "img act actions" "img dt actions" "body body body";
  align-items: start;
  align-content: start;
  justify-items: start;
  grid-auto-columns: auto 1fr auto;
  font-size: 0.7em;
  padding: 1em;
  grid-gap: 0.8em;
  .img {
    grid-area: img;
    align-self: center;
    justify-self: center;
  }

  .activity {
    grid-area: act;
  }

  .actions {
    grid-area: actions;
  }

  .datetime {
    grid-area: dt;
    opacity: 0.9;
    font-size: 0.9em;
  }
  .body {
    grid-area: body;
    display: grid;
    grid-gap: 0.3em;
  }
`;
