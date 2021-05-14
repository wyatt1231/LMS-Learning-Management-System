import { Button, Grid } from "@material-ui/core";
import { Form, Formik } from "formik";
import React, { FC, memo, useCallback } from "react";
import { useDispatch } from "react-redux";
import ClassActions from "../../Services/Actions/ClassActions";
import { setGeneralPrompt } from "../../Services/Actions/PageActions";
import { ClassRequestModel } from "../../Services/Models/ClassRequestModel";
import FormDialog from "../FormDialog/FormDialog";
import FormikInputField from "../Formik/FormikInputField";

interface IAcknowledgeRequestDialog {
  class_req_pk: string | null;
  handleClose: () => void;
}

const initFormValues: ClassRequestModel = {
  admin_remarks: "",
};

export const AcknowledgeRequestDialog: FC<IAcknowledgeRequestDialog> = memo(
  ({ class_req_pk, handleClose }) => {
    const dispatch = useDispatch();

    const handleFormSubmit = useCallback(
      async (form_values: ClassRequestModel) => {
        const payload: ClassRequestModel = {
          ...form_values,
          class_req_pk: parseInt(class_req_pk),
        };

        dispatch(
          setGeneralPrompt({
            open: true,
            continue_callback: () =>
              dispatch(
                ClassActions.acknowledgeRequest(payload, (msg: string) => {
                  dispatch(ClassActions.getClassRequests());
                  handleClose();
                  dispatch(ClassActions.getClassRequests());
                })
              ),
          })
        );
      },
      [class_req_pk, dispatch, handleClose]
    );

    return (
      <>
        <FormDialog
          open={!!class_req_pk}
          handleClose={handleClose}
          title="Class Requesting Form"
          body={
            <div>
              <Formik
                initialValues={initFormValues}
                // validationSchema={formSchema}
                validateOnChange={false}
                validateOnBlur={false}
                onSubmit={handleFormSubmit}
              >
                {() => (
                  <Form
                    id="class-req-form"
                    className="clinic-adding-form"
                    style={{
                      backgroundColor: `#fff`,
                      borderRadius: 10,
                      padding: `1em 2em`,
                    }}
                  >
                    <div className="box-ctnr">
                      <div className="box-body">
                        <Grid container spacing={3}>
                          <Grid xs={12} item>
                            <FormikInputField
                              name="admin_remarks"
                              multiline={true}
                              rows={4}
                              variant="outlined"
                              fullWidth
                              placeholder="Kindly enter the remarks here..."
                              InputLabelProps={{
                                shrink: true,
                              }}
                            />
                          </Grid>
                        </Grid>
                      </div>
                    </div>
                  </Form>
                )}
              </Formik>
            </div>
          }
          actions={
            <>
              <Button
                type="submit"
                form="class-req-form"
                variant="contained"
                color="primary"
              >
                Acknowledge Request
              </Button>
            </>
          }
        />
      </>
    );
  }
);

export default AcknowledgeRequestDialog;
