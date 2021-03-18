import { CircularProgress } from "@material-ui/core";
import WebViewer from "@pdftron/webviewer";
import React, { memo, FC, useEffect, useRef } from "react";
// import docx from "../Assets/Files/docx.docx";
import docx from "../Assets/Images/Wallpapers/header.jpg";
interface IFileViwer {
  file: any;
}

export const FileViwer: FC<IFileViwer> = memo(({ file }) => {
  if (!file) {
    return null;
  }
  const viewer = useRef(null);

  useEffect(() => {
    if (file) {
      WebViewer(
        {
          path: "/lib",
          initialDoc: file,
          isReadOnly: true,
        },
        viewer.current
      ).then((instance) => {
        const { docViewer } = instance;
      });
    }
  }, [file]);
  return (
    <div className="MyComponent">
      {file ? (
        <div
          className="webviewer"
          ref={viewer}
          style={{ height: "100vh" }}
        ></div>
      ) : (
        <div>
          Waiting for a file <CircularProgress />
        </div>
      )}
    </div>
  );
});

export default FileViwer;
