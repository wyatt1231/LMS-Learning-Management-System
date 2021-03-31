import styled from "styled-components";

export const StyledUserProfile = styled.div`
  margin-left: 1em;
  .header {
    display: grid;
    grid-auto-flow: column;
    grid-template-areas: "image icon user";
    align-items: center;
    align-content: center;

    &:hover {
      cursor: pointer;

      .profile-image,
      .icon {
        transition: 0.3s all ease-in-out;
      }
    }
    .profile-image {
      grid-area: image;
      height: 45px;
      width: 43px;
      background-color: ${(p) => p.theme.palette.secondary.main} !important;
      img {
        /* margin: 0.5em; */
      }
    }

    .icon {
      justify-self: start;
      grid-area: icon;
      color: ${(p) => p.theme.palette.primary.contrastText};
    }
    .user {
      grid-area: user;
      max-width: 100px;

      .fullname {
        font-size: 0.8em;
        font-weight: 600;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        color: ${(p) => p.theme.palette.primary.contrastText};
        text-transform: capitalize;
      }
      .designation {
        font-size: 0.8em;
        color: ${(p) => p.theme.palette.primary.contrastText};
        text-transform: capitalize;
      }
    }
  }

  .MuiPopover-root {
    background-color: red !important;
    & > .content-header {
      background-color: red !important;
      color: red;
    }
    &.content-header {
      background-color: red !important;
      color: red;
    }

    .content-header {
      background-color: red !important;
      color: red;
    }
  }
`;

export const StyledPopOverContent = styled.div`
  max-width: 360px;
  min-width: 250px;
  .content-header {
    overflow: hidden;
    display: grid;
    grid-auto-flow: column;
    align-content: center;
    justify-content: start;
    align-items: center;
    justify-items: start;
    grid-gap: 1em;
    padding: 1em;
    grid-auto-columns: 50px 1fr 100px;
    background-color: ${(p) => p.theme.palette.primary.light};
    color: ${(p) => p.theme.palette.primary.contrastText};

    .content-header-image {
      height: 50px;
      width: 50px;
      background-color: ${(p) => p.theme.palette.secondary.main} !important;
    }
    .content-header-user {
      font-size: 0.8em;
      text-transform: capitalize;

      .name {
        font-weight: 600;
      }
    }

    .btn-logout {
      color: black;
    }
  }

  .content-body {
    padding: 1.5em;
    padding-top: 1em;
    font-size: 0.87em;

    .content-title {
      font-weight: 900;
      color: rgba(0, 0, 0, 0.6);
    }
    .content-items {
      margin-top: 0.5em;
      display: grid;
      grid-gap: 0.5em;
    }
    .link {
      padding: 0.5em 0;
      border-bottom: 0.01em solid rgba(0, 0, 0, 0.2);
      color: rgba(0, 0, 0, 1) !important;
      &:hover {
        color: blue !important;
      }
    }
  }
`;
