import { CircularProgress } from "@material-ui/core";
import WebViewer from "@pdftron/webviewer";
import React, { FC, memo, useEffect, useRef } from "react";
interface IFileViwer {
  file: any;
}

export const FileViwer: FC<IFileViwer> = memo(({ file }) => {
  const viewer = useRef(null);
  useEffect(() => {
    if (file) {
      WebViewer(
        {
          // path: process.env.PUBLIC_URL + "/lib",
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

  if (!file) {
    return null;
  }

  return (
    <div className="MyComponent">
      {file ? (
        <div
          className="webviewer"
          ref={viewer}
          style={{ height: "85vh" }}
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
