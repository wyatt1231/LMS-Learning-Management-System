import styled from "styled-components";

export const StyledPageInfo = styled.div`
  grid-area: patient;
  display: grid;
  grid-template-areas: "icon breadcrumb" "icon title";
  justify-items: start;
  justify-content: start;
  align-items: start;
  align-content: start;
  margin-bottom: 1em;
  .icon {
    grid-area: icon;
    padding: 1em;
    display: grid;
    align-items: center;
    justify-items: center;
    border-radius: 3px;
    margin-right: 0.5em;
    color: ${(p) => p.theme.palette.primary.main};
    background-color: ${(p) => p.theme.palette.common.white};
    box-shadow: 0px 0px 30px 0px rgba(82, 63, 105, 0.05) !important;
  }
  .breadcrumb {
    grid-area: breadcrumb;
    font-weight: 900;
    font-size: 1em;
    letter-spacing: 0.1rem;
    text-transform: uppercase;
    align-self: end;
    a {
      color: ${(p) => p.theme.palette.common.black} !important;
    }
  }
  .title {
    grid-area: title;
    align-self: start;
    font-size: 0.85em;
    font-weight: 500;
    color: rgba(0, 0, 0, 0.65);
  }
`;
