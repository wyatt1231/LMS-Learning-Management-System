import styled from "styled-components";

export const StyledRegisterStudentView = styled.div`
  min-height: 100vh;
  /* min-width: 100vw; */
  height: 100%;
  width: 100%;
  overflow: hidden;
  display: grid;
  grid-template-areas: "login";
  background: #314755;
  background: linear-gradient(to left, #26a0da, #314755);

  .login-container {
    background-color: #fff;
    align-self: center;
    justify-self: center;
    display: grid;
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.56),
      0 4px 25px 0px rgba(0, 0, 0, 0.12), 0 8px 10px -5px rgba(0, 0, 0, 0.2);
    z-index: 2;
    border-radius: 15px;
    perspective: 1px;
    overflow: hidden;
    margin: 2em 0 !important;
    opacity: 0.9;
    width: 600px;

    .form-ctnr {
      display: grid;
      /* justify-content: center; */
      align-items: start;
      align-content: start;
      grid-gap: 1em;
      padding: 1em;
      /* padding-top: 0; */

      .header {
        display: grid;
        align-items: start;
        align-content: start;
        justify-items: center;
        /* text-align: center; */

        .brand-logo {
          height: 5em;
          width: 5em;
        }
        .brand-name {
          font-weight: 600;
          padding: 0.5em 0;
          font-size: 1em;
        }
      }

      .error {
        display: grid;
        grid-auto-flow: column;
        justify-items: start;
        justify-content: start;
        align-items: center;
        font-size: 0.8em;
        font-weight: 500;
        max-width: 90%;
        color: ${(p) => p.theme.palette.error.main};
      }

      .body {
        margin: 1em 0;
        display: grid;
        grid-gap: 1em;
        align-content: start;

        .body-title {
          /* text-align: center; */
          display: grid;
          grid-auto-flow: column;
          /* justify-content: center; */
          justify-items: start;
          align-items: center;
          font-size: 0.87em;
          font-weight: 500;
          color: rgba(0, 0, 0, 0.7);
        }

        .form {
          display: grid;
          grid-gap: 1em;
          align-content: start;
          align-items: start;

          .forgetpass {
            justify-self: end;
            align-self: center;
            padding: 0;
            font-size: 0.7rem;
            margin-top: -10px;
            &:hover {
              color: blue !important;
            }

            a {
              color: #333 !important;
              text-decoration: none !important;
            }
          }

          .buttons {
            display: grid;
            grid-auto-flow: row;
            grid-gap: 0.5em;
            .submit-btn {
            }
          }
        }
      }

      .footer {
        margin-top: 1em;
        border-top: 1px solid black;
        display: grid;
        justify-items: center;
        align-items: center;
        grid-gap: 0.4em;
        .title {
          justify-self: center;
          background-color: #ecfffb;
          margin-top: -10px;
          font-size: 0.7em;
          text-align: center;
          padding: 0 0.5em;
        }

        .tuo_logo {
          height: 35px;
          width: 35px;
        }

        .tuo-name {
          font-weight: 500;
          font-size: 0.8em;
        }
      }
    }
  }
`;
