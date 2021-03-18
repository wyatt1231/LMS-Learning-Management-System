import styled from "styled-components";

export const ManageClassSelectedSessionTutorStyle = styled.div`
  display: grid;
  grid-template-areas: "vid info" "footer footer";
  grid-gap: 1em;
  grid-auto-columns: 1fr 350px;
  grid-auto-rows: 70vh 10vh;

  .vid-ctnr {
    grid-area: vid;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    border-radius: 10px;
  }
  .info-ctnr {
    grid-area: info;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    border-radius: 10px;
    padding: 1em;
    display: grid;
    grid-gap: 1em;
    align-content: start;

    .student-tab {
      height: 100%;
      overflow-y: auto;
      .student-item {
        display: grid;
        grid-auto-flow: column;
        align-items: center;
        justify-content: start;
        grid-gap: 0.5em;
        padding: 0.3em 0;
        border-bottom: 2px solid rgba(0, 0, 0, 0.1);
        .img {
          font-size: 0.87em;
          font-weight: 700;
        }
        .name {
          font-weight: 500;
          font-size: 0.9em;
        }
      }
    }
  }
  .footer-ctnr {
    grid-area: footer;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    border-radius: 10px;
    padding: 1em;
    display: grid;
    grid-auto-flow: column;
    align-items: center;
    align-content: center;

    .vid-btns {
      display: grid;
      grid-auto-flow: column;
      grid-gap: 1em;
      justify-items: center;
      justify-self: center;
    }

    .session-btns {
      justify-self: end;
    }
  }
`;
