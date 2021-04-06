import styled from "styled-components";

export const StyledRateTutorDialog = styled.div`
  .tutor-info-container {
    display: grid;
    /* justify-content: center; */
    justify-items: center;
    grid-gap: 0.3em;

    .name {
      font-size: 1.3em;
      font-weight: 500;
    }
    .position {
      font-size: 1em;
      opacity: 0.7;
      font-weight: 500;
    }

    .bio {
      background-color: #f5f5f5;
      border-radius: 10px;
      padding: 1em;
      font-size: 0.78em;
    }

    .info-group-container {
      justify-self: start;
      padding: 1em 2em;
      width: 100%;
    }
  }
`;
