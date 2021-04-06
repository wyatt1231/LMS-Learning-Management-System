import { Button, Grid } from "@material-ui/core";
import React, { FC, memo, useCallback, useState } from "react";
import { useDispatch } from "react-redux";
import FormDialog from "../../../Component/FormDialog/FormDialog";
import PhotoField from "../../../Component/PhotoField/PhotoField";
import { fileToBase64 } from "../../../Hooks/UseFileConverter";
import AdminActions from "../../../Services/Actions/AdminActions";
import { setGeneralPrompt } from "../../../Services/Actions/PageActions";
import TutorActions, {
  setSingleTutor,
} from "../../../Services/Actions/TutorActions";
import UserActions from "../../../Services/Actions/UserActions";
import { TutorModel } from "../../../Services/Models/TutorModels";
interface IEditTutorImageDialog {
  initial_form_values: TutorModel;
  open: boolean;
  handleClose: () => void;
}

export const EditTutorImageDialog: FC<IEditTutorImageDialog> = memo(
  ({ initial_form_values, open, handleClose }) => {
    const dispatch = useDispatch();

    const [pic, setPic] = useState<File | null>(null);
    const handleSetPic = useCallback((logo) => {
      setPic(logo);
    }, []);

    const handleFormSubmit = useCallback(async () => {
      const base64_pic = await fileToBase64(pic);

      const payload: TutorModel = {
        tutor_pk: initial_form_values.tutor_pk,
        picture: base64_pic,
      };

      dispatch(
        setGeneralPrompt({
          open: true,
          continue_callback: () =>
            dispatch(
              TutorActions.updateTutorImage(payload, (msg: string) => {
                dispatch(setSingleTutor(payload.tutor_pk));
                setPic(null);
                handleClose();
              })
            ),
        })
      );
    }, [dispatch, handleClose, initial_form_values.tutor_pk, pic]);

    return (
      <>
        <FormDialog
          open={open}
          title="Edit Class Details"
          handleClose={() => handleClose()}
          minWidth={500}
          maxWidth="xs"
          body={
            <div>
              <Grid container justify="center" spacing={3}>
                <Grid xs={12} container justify="center" item>
                  <div style={{ padding: "1.5em 0" }}>
                    <PhotoField
                      label=""
                      height={180}
                      width={300}
                      selectedFile={pic}
                      name="pic"
                      variant="rounded"
                      handleChange={handleSetPic}
                    />
                  </div>
                </Grid>
              </Grid>
            </div>
          }
          actions={
            <>
              <Button
                type="submit"
                color="primary"
                variant="contained"
                onClick={handleFormSubmit}
              >
                Save Changes
              </Button>
            </>
          }
        />
      </>
    );
  }
);

export default EditTutorImageDialog;
