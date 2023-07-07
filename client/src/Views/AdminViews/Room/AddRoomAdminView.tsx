import { Button, Container, Grid } from "@material-ui/core";
import { Form, Formik, FormikProps } from "formik";
import React, {
  FC,
  memo,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import * as yup from "yup";
import FormikInputField from "../../../Component/Formik/FormikInputField";
import SuccessDialog from "../../../Component/SuccessDialog";
import {
  setGeneralPrompt,
  setPageLinks,
} from "../../../Services/Actions/PageActions";
import { addRoomAction } from "../../../Services/Actions/RoomActions";
import { RoomModel } from "../../../Services/Models/RoomModel";

interface AddRoomAdminViewInterface {}

const initFormValues: RoomModel = {
  room_desc: "",
  notes: "",
};

const formSchema = yup.object({
  room_desc: yup.string().required().max(255).label("Room Description"),
});

export const AddRoomAdminView: FC<AddRoomAdminViewInterface> = memo(() => {
  const dispatch = useDispatch();
  const history = useHistory();

  const formRef = useRef<FormikProps<RoomModel> | null>(null);

  const [successDialog, setSuccessDialog] = useState({
    open: false,
    message: "",
  });

  const handleFormSubmit = useCallback(
    async (formValues: RoomModel) => {
      dispatch(
        setGeneralPrompt({
          open: true,
          continue_callback: () =>
            dispatch(
              addRoomAction(formValues, (msg: string) => {
                setSuccessDialog({
                  message: msg,
                  open: true,
                });
              })
            ),
        })
      );
    },
    [dispatch]
  );

  useEffect(() => {
    let mounted = true;

    const settingPageLinks = () => {
      dispatch(
        setPageLinks([
          {
            link: "/admin/room",
            title: "Rooms",
          },
          {
            link: window.location.pathname,
            title: "Add Room",
          },
        ])
      );
    };

    mounted && settingPageLinks();
    return () => {
      mounted = false;
    };
  }, [dispatch]);

  return (
    <Container maxWidth="sm">
      <Formik
        initialValues={initFormValues}
        validationSchema={formSchema}
        validateOnChange={false}
        validateOnBlur={false}
        onSubmit={handleFormSubmit}
        innerRef={formRef}
      >
        {({ values, errors, touched, setFieldValue }) => (
          <Form
            className="clinic-adding-form"
            style={{
              backgroundColor: `#fff`,
              borderRadius: 10,
              padding: `1em 2em`,
            }}
          >
            <div className="box-ctnr">
              <div className="box-header">
                <div className="header-text">Fill-up the room details</div>
              </div>
              <div className="box-body">
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
              </div>
            </div>

            <div style={{ marginTop: "1em" }}>
              <Grid container justify={"flex-end"} spacing={3}>
                <Grid item>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    size="large"
                    disableElevation
                  >
                    Save Room
                  </Button>
                </Grid>
                <Grid item>
                  <Button
                    type="button"
                    color="secondary"
                    size="large"
                    disableElevation
                    onClick={() => {
                      history.push(`/admin/room`);
                    }}
                  >
                    Cancel
                  </Button>
                </Grid>
              </Grid>
            </div>
            <SuccessDialog {...successDialog}>
              <Button
                color="primary"
                disableElevation={false}
                onClick={() => {
                  formRef.current.handleReset();
                  setSuccessDialog({
                    open: false,
                    message: "",
                  });
                }}
              >
                Add another record
              </Button>
              <Button
                color="primary"
                disableElevation={false}
                onClick={() => {
                  history.push(`/admin/room`);
                }}
              >
                View all records
              </Button>
            </SuccessDialog>
          </Form>
        )}
      </Formik>
    </Container>
  );
});

export default AddRoomAdminView;
