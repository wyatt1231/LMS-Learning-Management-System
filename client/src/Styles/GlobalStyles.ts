import { Grid, Paper } from "@material-ui/core";
import styled from "styled-components";

export const StyledTableData = styled.div`
  /* display: grid; */
  grid-gap: 1em;
  align-content: start;
  align-items: start;
  justify-items: start;

  @media all and (min-width: ${(props) =>
      props.theme.breakpoints.values.xs}px) {
    grid-auto-flow: row;
    grid-auto-columns: auto;
  }

  @media all and (min-width: ${(props) =>
      props.theme.breakpoints.values.md}px) {
    /* grid-auto-columns: 250px 100%; */
    grid-auto-flow: column;
  }

  .table-grid {
    .table-ctnr {
      box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
    }
  }
`;

export const StyledBox = styled.div`
  /* box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); */
  border-radius: 10px;
  padding: 1em;
  background-color: #fdfdfd;

  .box-title {
    padding: 0.5em 0;
    /* border-bottom: 1px solid rgba(0, 0, 0, 0.2); */
    font-size: 1.2em;
    font-weight: 600;
    letter-spacing: 0.3pt;
    word-spacing: 0.3pt;
  }

  .box-body {
    margin: 1em 0;
  }
`;

export const StyledClassContainer = styled.div`
  background-color: #fff;
  border-radius: 0.5em;
  border: 0.05em solid rgba(0, 0, 0, 0.1);
  /* box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1); */
  height: 100%;
  overflow: hidden;
  font-size: 0.87em;
  &:hover {
    box-shadow: 0 5px 10px rgba(0, 0, 0, 0.1);
    transition: 0.3s all ease-in-out;
  }

  .image {
    display: inline-block;
    position: relative;
    height: 120px;
    width: 100%;
    img {
      height: 100%;
      width: 100%;
      image-rendering: -webkit-optimize-contrast;
    }

    .btn {
      position: absolute;
      top: 0;
      right: 0;
      margin: 0.5em;
    }
  }

  .info-container {
    display: grid;
    padding: 1em;
    padding-top: 0.35em;
    grid-gap: 0.4em;
    align-items: start;
    align-content: start;

    .title {
      border-radius: 3px;
      padding: 0.5em 0;
      grid-gap: 0.1em;
      display: grid;
      color: blue;
      .main {
        font-size: 1.1em;
        font-weight: 600;
      }
      .sub {
        font-size: 0.75em;
        opacity: 0.7;
        font-weight: 600;
      }
    }

    .item {
      padding: 0.3em 0;
      border-bottom: 0.01em solid rgba(0, 0, 0, 0.1);
    }

    .tutor {
      display: grid;
      align-items: center;
      justify-content: start;
      grid-auto-flow: column;
      grid-gap: 0.5em;
      font-weight: 600;
      font-size: 0.9em;
      padding: 0.3em 0;
      border-bottom: 0.01em solid rgba(0, 0, 0, 0.1);
    }

    .details {
      margin-top: 1em;
      font-size: 0.9em;

      > * {
        padding: 4px 0;
      }

      .time,
      .item {
        font-size: 0.87em;
      }
    }
  }

  .footer-ctnr {
    display: grid;
    grid-auto-flow: column;
    justify-content: center;
    align-items: center;
    align-content: center;
    grid-gap: 0.5em;
    margin-top: 1em;
  }
`;

export const StyledDashboardItem = styled.div`
  display: grid;
  height: 100%;
  width: 100%;
  background-color: #fff;
  padding: 1.5em 1em;
  border-radius: 10px;
  align-items: start;
  align-content: start;
  /* padding-bottom: 2em; */
  grid-template-areas: "label avatar" "val avatar";
  .label {
    grid-area: label;
    font-weight: 600;
    font-size: 0.83em !important;
    opacity: 0.7;
    color: blue;
    justify-self: start;
  }

  .stat-value {
    grid-area: val;
    font-weight: 700;
    font-size: 2em;
    justify-self: start;
  }

  .avatar {
    grid-area: avatar;
    height: 60px;
    align-items: center;
    align-content: center;
    justify-self: end;
    width: 60px;
    /* margin-right: 1em; */
  }
`;

export const StyledOpenClasses = styled.div`
  padding: 0.5em;
  margin: 0.5em;
  border: 0.02em solid rgba(0, 0, 0, 0.1);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  border-radius: 5px;
  background-color: #fff;

  .class-item {
    display: grid;
    border-bottom: 0.01em solid rgba(0, 0, 0, 0.1);
    padding: 0.2em 0;
    .label {
      font-weight: 900;
      font-size: 0.67em;
      opacity: 0.4;
    }
    .value {
      font-weight: 600 !important;
      font-size: 0.9em !important;
    }
  }
`;

export const StyledClassMaterial = styled.div`
  .zc {
  }
`;

export const StyledEnrolledClass = styled.div`
  .enrolled-classes {
    display: grid;
    grid-auto-flow: row;
    grid-gap: 1em;

    .class-item {
      display: grid;
      grid-gap: 0.3em;
      padding: 1em;
      border-radius: 7px;
      background-color: #fcfcfc;
      border: 0.05em solid rgba(0, 0, 0, 0.1);

      .class-title {
        font-weight: 500;
        display: grid;
        align-items: center;
        justify-content: start;
        align-content: start;
        grid-gap: 0.5em;
        grid-auto-flow: column;

        .circle {
          height: 7px;
          width: 7px;
          background-color: yellowgreen;
          border-radius: 50%;
          animation: beat 0.5s infinite alternate;
        }

        @keyframes beat {
          to {
            transform: scale(1.4);
          }
        }
      }

      .sub-title {
        font-size: 0.77em;
        font-weight: 600;
        opacity: 0.8;
        margin-left: 1.3em;
      }
      .tutor {
        display: grid;
        grid-gap: 0.5em;
        grid-auto-flow: column;
        justify-content: start;
        align-items: center;
        align-content: center;
        font-size: 0.9em;
        .img {
          height: 30px;
          width: 30px;
        }
      }
      .time {
        font-size: 0.83em;
        font-weight: 500;
        justify-self: end;
      }
    }
  }
`;

export const StyledSessionTutorView = styled(Paper)`
  grid-template-areas: "course_img course_desc" "tabs tabs";
  display: grid;
  grid-gap: 1em;
  grid-auto-columns: 220px 1fr;
  padding: 1em;
  /* border-color: #fff; */
  /* box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); */
  width: 100%;

  .course_img {
    grid-area: course_img;
    justify-self: center;
  }
  .course-desc {
    grid-area: course_desc;
    display: grid;
    grid-gap: 0.5em;
    justify-items: start;
    justify-content: start;
    align-items: start;
    align-content: start;

    .course-title {
      display: grid;
      grid-auto-flow: column;
      justify-items: start;
      align-items: center;
      grid-gap: 0.8em;
      font-size: 2em;
      font-weight: 500;
    }
    .course-subtitle {
      display: grid;
      grid-auto-flow: column;
      justify-items: start;
      grid-gap: 0.8em;
      font-size: 0.87em;
      font-weight: 600;
      /* opacity: 0.9; */
    }
  }

  .tabs {
    grid-area: tabs;
    display: grid;
    grid-auto-flow: column;
    grid-auto-columns: 1fr;
    grid-gap: 1em;

    /* border-top: 2px solid rgba(0, 0, 0, 0.1); */
    /* padding-top: 1em; */

    .links {
      display: grid;
      grid-gap: 0.5em;
      font-size: 0.93em;
      padding-right: 0;
      min-height: 500px;
      height: 100%;
      /* border-right: 2px solid rgba(0, 0, 0, 0.1); */
      align-content: start;
      align-items: start;
      /* justify-items: center; */

      /* box-shadow: 0 3px 6px rgba(0, 0, 0, 0.1); */

      .link-item {
        color: black !important;
        height: 2em;
        display: grid;
        align-items: center;
        /* transition: 0.1s border-right ease-in-out; */
        /* padding: 0 3.5em; */
        /* text-align: center; */

        &.link-item-active {
          color: #3d5af1 !important;
          /* border-right: 2px solid #3d5af1; */
          /* transition: 0.1s border-right ease-in-out; */
        }
      }
    }

    .tab-container {
      width: 100%;

      .class-tab {
        width: 100%;
      }
    }
  }
`;
