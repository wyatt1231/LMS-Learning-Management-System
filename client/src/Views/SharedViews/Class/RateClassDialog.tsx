import { Button, Grid } from "@material-ui/core";
import { Rating } from "@material-ui/lab";
import { Form, Formik } from "formik";
import React, { FC, memo, useCallback } from "react";
import { useDispatch } from "react-redux";
import * as yup from "yup";
import FormDialog from "../../../Component/FormDialog/FormDialog";
import { ClassRatingModel } from "../../../Services/Models/ClassRatingModel";
interface IRateClassDialog {
  class_pk: number;
  open: boolean;
  handleClose: () => void;
}

const formSchema = yup.object({
  rate_val: yup.number().required().moreThan(0).label("Rating"),
});

export const RateClassDialog: FC<IRateClassDialog> = memo(
  ({ class_pk, open, handleClose }) => {
    const dispatch = useDispatch();

    const handleFormSubmit = useCallback(
      async (form_values: ClassRatingModel) => {
        const payload: ClassRatingModel = {
          rate_val: form_values.rate_val,
          class_pk: class_pk,
        };

        console.log(`payload`, payload);
        // dispatch(
        //   setGeneralPrompt({
        //     open: true,
        //     continue_callback: () =>
        //       dispatch(
        //         ClassActions.approveClass(form_values, (msg: string) => {
        //           dispatch(setSelectedClassAction(form_values.class_pk));
        //           handleClose();
        //         })
        //       ),
        //   })
        // );
      },
      [class_pk]
    );

    return (
      <>
        <FormDialog
          open={open}
          title="How much stars do you want to give in this class?"
          handleClose={() => handleClose()}
          minWidth={500}
          maxWidth="xs"
          body={
            <div>
              <Formik
                initialValues={{
                  rate_val: 0,
                }}
                validationSchema={formSchema}
                validateOnChange={false}
                validateOnBlur={false}
                onSubmit={handleFormSubmit}
              >
                {({ setFieldValue, errors, values, touched }) => (
                  <Form
                    id="form-edit-class-status"
                    style={{
                      backgroundColor: `#fff`,
                      borderRadius: 10,
                      padding: `1em 3em`,
                    }}
                  >
                    <Grid container justify="center" spacing={3}>
                      <Grid item>
                        {(() => {
                          const name = "rate_val";
                          const errorText =
                            errors[name] && touched[name] ? errors[name] : "";
                          const handleChange = (e: any) => {
                            setFieldValue(name, e.target.value);
                          };
                          return (
                            <Rating
                              size="large"
                              name={name}
                              value={values[name]}
                              onChange={handleChange}
                              precision={1}
                              // error={!!errorText}
                              // helperText={errorText}
                            />
                          );
                        })()}
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
                type="submit"
                form="form-edit-class-status"
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

export default RateClassDialog;
