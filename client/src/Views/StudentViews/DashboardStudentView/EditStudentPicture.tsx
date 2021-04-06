import { Button, Grid } from "@material-ui/core";
import React, { FC, memo, useCallback, useState } from "react";
import { useDispatch } from "react-redux";
import FormDialog from "../../../Component/FormDialog/FormDialog";
import PhotoField from "../../../Component/PhotoField/PhotoField";
import { fileToBase64 } from "../../../Hooks/UseFileConverter";
import { setGeneralPrompt } from "../../../Services/Actions/PageActions";
import StudentActions from "../../../Services/Actions/StudentActions";
import { StudentModel } from "../../../Services/Models/StudentModel";
interface IEditStudentPicture {
  initial_form_values: StudentModel;
  open: boolean;
  handleClose: () => void;
}

export const EditStudentPicture: FC<IEditStudentPicture> = memo(
  ({ initial_form_values, open, handleClose }) => {
    const dispatch = useDispatch();

    const [pic, setPic] = useState<File | null>(null);
    const handleSetPic = useCallback((logo) => {
      setPic(logo);
    }, []);

    const handleFormSubmit = useCallback(async () => {
      const base64_pic = await fileToBase64(pic);

      if (base64_pic && initial_form_values?.student_pk) {
        const payload: StudentModel = {
          student_pk: initial_form_values.student_pk,
          picture: base64_pic,
        };

        dispatch(
          setGeneralPrompt({
            open: true,
            continue_callback: () =>
              dispatch(
                StudentActions.updateStudentImage(payload, (msg: string) => {
                  dispatch(StudentActions.getLoggedStudentInfo());
                  handleClose();
                })
              ),
          })
        );
      }
    }, [dispatch, handleClose, initial_form_values, pic]);

    return (
      <>
        <FormDialog
          open={open}
          title="Update Your Profile Picture"
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

export default EditStudentPicture;
