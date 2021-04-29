import { Paper } from "@material-ui/core";
import styled from "styled-components";

export const LoginStyles = styled(Paper)`
  min-height: 100vh;
  min-width: 100vw;
  height: 100%;
  width: 100%;
  display: grid;
  grid-template-areas: "login";
  background: #314755;
  background: linear-gradient(to left, #26a0da, #314755);

  .login-container {
    background-color: #fff;
    align-self: center;
    justify-self: center;
    display: grid;
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.56);
    z-index: 2;
    /* grid-gap: 1em; */
    border-radius: 7px !important;
    overflow: hidden !important;
    perspective: 1px;
    overflow: hidden;
    opacity: 0.9;

    @media all and (min-width: ${(props) =>
        props.theme.breakpoints.values.xs}px) {
      grid-auto-columns: 1fr;
      /* grid-auto-columns: 30em 25em; */
      min-height: auto;
      align-self: start;
      /* justify-self: center; */

      border-radius: unset;
      grid-auto-flow: row;
      grid-auto-rows: 13em 1fr;
      margin-top: 2em;
      margin-bottom: 2em;

      .slider-ctnr {
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
      }
    }

    @media all and (min-width: ${(props) =>
        props.theme.breakpoints.values.md}px) {
      grid-auto-columns: 33em 25em;
      grid-auto-flow: column !important;
      grid-auto-rows: unset !important;
      align-self: center !important;
      min-height: unset !important;
    }

    .slider-ctnr {
      display: grid;
      grid-template-areas: "slides";

      .slides {
        height: 100%;
        width: 100%;
        grid-area: slides;
      }
    }

    .form-ctnr {
      display: grid;
      /* justify-content: center; */
      align-items: start;
      align-content: start;
      padding: 1em 2em;
      padding-bottom: 0.3em;
      /* padding-top: 0; */

      .header {
        display: grid;
        align-items: start;
        align-content: start;
        justify-items: center;
        /* text-align: center; */

        .brand-logo {
          height: 8em;
          width: 8em;
        }
        .brand-name {
          padding: 0.5em 0;
          text-align: center;
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
        display: grid;
        grid-gap: 1em;
        align-content: start;

        .body-title {
          display: grid;
          grid-auto-flow: column;
          justify-items: start;
          align-items: center;
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
            margin-top: 1em;
            display: grid;
            grid-auto-flow: row;
            grid-gap: 0.5em;
            .submit-btn {
            }
            .MuiButtonBase-root {
              border-radius: 35px !important;
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

export const StyledImageBackground = styled.div<{ src: any }>`
  background: linear-gradient(to top, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.4)),
    url("${(p: any) => p.src}") no-repeat center center;
  opacity: 0;
  background-size: cover;
  margin-left: 0;

  transition: 2s opacity cubic-bezier(0.95, 0.05, 0.795, 0.035);
  -webkit-transition: 2s opacity cubic-bezier(0.95, 0.05, 0.795, 0.035);
  -moz-transition: 2s opacity cubic-bezier(0.95, 0.05, 0.795, 0.035);
  -o-transition: 2s opacity cubic-bezier(0.95, 0.05, 0.795, 0.035);
  .app-name {
    display: grid;
    align-content: end;
    align-items: end;
    text-shadow: 0 3px 0 black;
    color: #fff;
    padding: 0.5em;
    /* font-size: 2.1em; */
    /* font-weight: 900; */
    text-align: center;
  }
  &.active {
    opacity: 1;
  }
`;
