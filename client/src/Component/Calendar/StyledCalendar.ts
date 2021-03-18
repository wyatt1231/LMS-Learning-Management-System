import styled from "styled-components";

export const StyledCalendarTools: any = styled.div`
  display: grid;
  grid-gap: 0.5em;

  @media all and (min-width: ${(props: any) =>
      props.theme.breakpoints.values.xs}px) {
    grid-template-areas: "manage-tools" "calendar-tools";
  }

  @media all and (min-width: ${(props: any) =>
      props.theme.breakpoints.values.md}px) {
    grid-template-areas: "calendar-tools manage-tools";
  }

  .calendar-tools {
    grid-area: calendar-tools;
    justify-self: start;
    align-self: center;
    display: grid;
    grid-gap: 0.8em;
    align-items: center;
    justify-items: start;
    justify-content: start;
    grid-template-areas: "nav view title";
    grid-gap: 0.5em;

    .nav {
      grid-area: nav;
      display: grid;
      grid-auto-flow: column;
      grid-gap: 0.5em;
      justify-self: center;
      align-self: center;
    }

    .view {
      grid-area: view;
      display: grid;
      grid-auto-flow: column;
      grid-gap: 0.5em;
      justify-self: center;
      align-self: center;
    }

    .title {
      grid-area: title;
      justify-self: center;
      align-self: center;
      font-size: 1.3em;
      font-weight: 500;
      word-spacing: 0.2rem;
      letter-spacing: 0.1rem;
      text-transform: uppercase;
    }
  }

  .manage-tools {
    grid-area: manage-tools;
    justify-self: end;
    align-self: center;
  }
`;
