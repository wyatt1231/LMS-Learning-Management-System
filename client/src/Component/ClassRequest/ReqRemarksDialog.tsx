import React, { FC, memo } from "react";
import FormDialog from "../FormDialog/FormDialog";

interface IReqRemarksDialog {
  remarks: string | null;
  handleClose: () => void;
}

export const ReqRemarksDialog: FC<IReqRemarksDialog> = memo(
  ({ remarks, handleClose }) => {
    return (
      <>
        <FormDialog
          open={!!remarks}
          handleClose={handleClose}
          title="Remarks of the Request"
          body={<div>{remarks}</div>}
        />
      </>
    );
  }
);

export default ReqRemarksDialog;
