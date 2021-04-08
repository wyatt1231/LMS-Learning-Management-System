import { Button, Grid } from "@material-ui/core";
import { Form, Formik } from "formik";
import React, { FC, memo, useCallback } from "react";
import { useDispatch } from "react-redux";
import * as yup from "yup";
import FormDialog from "../../../Component/FormDialog/FormDialog";
import FormikInputField from "../../../Component/Formik/FormikInputField";
import { setGeneralPrompt } from "../../../Services/Actions/PageActions";
import RoomActions from "../../../Services/Actions/RoomActions";
import { RoomModel } from "../../../Services/Models/RoomModel";
interface IEditRoomDialog {
  initial_form_values: RoomModel;
  open: boolean;
  handleClose: () => void;
  handleReloadDataTable: () => void;
}

const formSchema = yup.object({
  room_desc: yup.string().required().max(255).label("Course Description"),
});

export const EditRoomDialog: FC<IEditRoomDialog> = memo(
  ({ initial_form_values, open, handleClose, handleReloadDataTable }) => {
    const dispatch = useDispatch();

    const handleFormSubmit = useCallback(
      async (payload: RoomModel) => {
        payload.room_pk = initial_form_values.room_pk;
        dispatch(
          setGeneralPrompt({
            open: true,
            continue_callback: () =>
              dispatch(
                RoomActions.updateRoom(payload, (msg: string) => {
                  handleReloadDataTable();
                  handleClose();
                })
              ),
          })
        );
      },
      [
        dispatch,
        handleClose,
        handleReloadDataTable,
        initial_form_values.room_pk,
      ]
    );

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
              <Formik
                initialValues={initial_form_values}
                validationSchema={formSchema}
                onSubmit={handleFormSubmit}
              >
                {({ values, errors, touched, setFieldValue, submitCount }) => (
                  <Form
                    id="form-edit-room"
                    style={{
                      backgroundColor: `#fff`,
                      borderRadius: 10,
                      padding: `1em 3em`,
                    }}
                    noValidate
                  >
                    <Grid container justify="center" spacing={3}>
                      <Grid xs={12} item>
                        <FormikInputField
                          name="room_desc"
                          label="Room Description"
                          placeholder="Enter room description"
                          variant="outlined"
                          InputLabelProps={{ shrink: true }}
                          fullWidth
                          required
                        />
                      </Grid>
                      <Grid xs={12} item>
                        <FormikInputField
                          label="Notes/Notice"
                          name="notes"
                          placeholder="Write some notes here..."
                          variant="outlined"
                          InputLabelProps={{ shrink: true }}
                          fullWidth
                          multiline={true}
                          rows={6}
                        />
                      </Grid>
                    </Grid>
                  </Form>
                )}
              </Formik>
            </div>
          }
          actions={
            <>
              <Button
                form="form-edit-room"
                type="submit"
                color="primary"
                variant="contained"
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

export default EditRoomDialog;
