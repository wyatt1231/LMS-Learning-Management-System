import styled from "styled-components";

export const StyledLoadingButton = styled.div`
  display: grid;
  grid-template-areas: "combine";
  .btn {
    grid-area: combine;
  }
  .loader {
    font-weight: 900;
    font-size: 2em;
    z-index: 10;
    grid-area: combine;
    justify-self: center;
    align-self: center;
  }
`;
