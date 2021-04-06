import { Button, Grid } from "@material-ui/core";
import React, { FC, memo, useCallback, useState } from "react";
import { useDispatch } from "react-redux";
import FormDialog from "../../../Component/FormDialog/FormDialog";
import PhotoField from "../../../Component/PhotoField/PhotoField";
import { fileToBase64 } from "../../../Hooks/UseFileConverter";
import CourseActions from "../../../Services/Actions/CourseActions";
import { setGeneralPrompt } from "../../../Services/Actions/PageActions";
import { CourseModel } from "../../../Services/Models/CourseModel";
interface IEditCourseImageDialog {
  initial_form_values: CourseModel;
  open: boolean;
  handleClose: () => void;
  handleReloadDataTable: () => void;
}

export const EditCourseImageDialog: FC<IEditCourseImageDialog> = memo(
  ({ initial_form_values, open, handleClose, handleReloadDataTable }) => {
    const dispatch = useDispatch();

    const [pic, setPic] = useState<File | null>(null);
    const handleSetPic = useCallback((logo) => {
      setPic(logo);
    }, []);

    const handleFormSubmit = useCallback(async () => {
      const base64_pic = await fileToBase64(pic);

      const payload: CourseModel = {
        course_pk: initial_form_values.course_pk,
        picture: base64_pic,
      };

      console.log(`payoad`, payload);

      dispatch(
        setGeneralPrompt({
          open: true,
          continue_callback: () =>
            dispatch(
              CourseActions.updateCourseImage(payload, (msg: string) => {
                handleReloadDataTable();
                handleClose();
              })
            ),
        })
      );
    }, [
      dispatch,
      handleClose,
      handleReloadDataTable,
      initial_form_values.course_pk,
      pic,
    ]);

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

export default EditCourseImageDialog;
