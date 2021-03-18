import { useTheme } from "@material-ui/core";
import clsx from "clsx";
import React, { memo } from "react";
import styled from "styled-components";
interface IBody {
  isOpenMobileHeader: boolean;
}
const Body: React.FC<IBody> = memo(({ children, isOpenMobileHeader }) => {
  const theme = useTheme();

  return (
    <StyledBody
      theme={theme}
      className={clsx("", {
        "expand-body": isOpenMobileHeader,
      })}
    >
      {children}
    </StyledBody>
  );
});
export default Body;
const StyledBody = styled.main`
  margin-top: ${(p) => p.theme.header.height + 50}px !important;
  transition: 0.2s margin-top ease-in-out;
  /* background-color: #fcfcfc;q */

  &.expand-body {
    margin-top: ${(p) => p.theme.header.height * 2 + 50}px !important;
    transition: 0.2s margin-top ease-in-out;
  }

  .page-container {
    background-color: #fff !important;
    min-height: calc(100vh - ${(p) => p.theme.header.height + 40}px) !important;
    /* border-radius: 5px; */
    padding: 0.5em;
    /* border: 0.01em solid rgba(0, 0, 0, 0.1); */
    /* box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); */
  }
`;
