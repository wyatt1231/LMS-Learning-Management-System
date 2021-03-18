import { yupResolver } from "@hookform/resolvers/yup";
import { Button, TextField } from "@material-ui/core";
import React, { FC, memo, useCallback, useMemo, useRef } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { useParams } from "react-router";
import * as Yup from "yup";
import FormDialog from "../../../../Component/FormDialog/FormDialog";
import TextFieldHookForm from "../../../../Component/HookForm/TextFieldHookForm";
import {
  endClassSessionAction,
  setSingleClassSession,
} from "../../../../Services/Actions/ClassSessionActions";
interface IDialogSessionEnd {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const validationSchema = Yup.object({
  remarks: Yup.string().required().label("Remarks"),
});

export const DialogSessionEnd: FC<IDialogSessionEnd> = memo(
  ({ open, setOpen }) => {
    const params = useParams<any>();
    const dispatch = useDispatch();
    const formMethods = useForm({
      resolver: yupResolver(validationSchema),
    });

    const onSubmit = useCallback(
      (data) => {
        const payload = {
          session_pk: params.session_pk,
          remarks: data.remarks,
        };

        dispatch(
          endClassSessionAction(payload, () => {
            dispatch(setSingleClassSession(payload.session_pk));
          })
        );
      },
      [dispatch, params.session_pk]
    );

    return (
      <FormDialog
        open={open}
        title="You are ending this class session!"
        handleClose={() => setOpen(false)}
        body={
          <div style={{ padding: `1em 0` }}>
            <FormProvider {...formMethods}>
              <form
                id="remarks-form"
                onSubmit={formMethods.handleSubmit(onSubmit)}
                noValidate
              >
                <TextFieldHookForm
                  // name="remarks"
                  name={"remarks"}
                  defaultValue=""
                  label="Class Session Remarks"
                  multiline={true}
                  rows={4}
                  fullWidth
                  variant="outlined"
                  required
                  InputLabelProps={{ shrink: true }}
                  placeholder="Kindly write your remarks here..."
                />
              </form>
            </FormProvider>
          </div>
        }
        actions={
          <>
            <Button
              variant="contained"
              form="remarks-form"
              type="submit"
              onClick={() => {
                // formRef.current?.submit();
              }}
              color="primary"
            >
              End Now
            </Button>
            <Button variant="contained" color="secondary">
              Cancel
            </Button>
          </>
        }
      />
    );
  }
);

export default DialogSessionEnd;
