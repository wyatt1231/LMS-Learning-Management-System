import { Button, Grid } from "@material-ui/core";
import { Form, Formik } from "formik";
import React, { FC, memo, useCallback } from "react";
import { useDispatch } from "react-redux";
import * as yup from "yup";
import FormDialog from "../../Component/FormDialog/FormDialog";
import FormikInputField from "../../Component/Formik/FormikInputField";
import { validatePassword } from "../../Helpers/helpGetRegexValidators";
import { setGeneralPrompt } from "../../Services/Actions/PageActions";
import UserActions from "../../Services/Actions/UserActions";
import { UserModel } from "../../Services/Models/UserModel";

interface IChangePasswordDialog {
  open: boolean;
  handleClose: () => void;
}

const initial_values = {
  old_password: "",
  password: "",
  new_password: "",
};

const formSchema = yup.object({
  old_password: yup.string().required().max(50).label("Old Password"),
  password: validatePassword("Password"),
  confirm_password: yup
    .string()
    .test("Password must match", "Password must match", function (value) {
      const { password } = this.parent;
      console.log(`value`, value, password, password === value);

      return password === value;
    }),
});

export const ChangePasswordDialog: FC<IChangePasswordDialog> = memo(
  ({ open, handleClose }) => {
    const dispatch = useDispatch();

    const handleFormSubmit = useCallback(
      async (payload: UserModel) => {
        dispatch(
          setGeneralPrompt({
            open: true,
            continue_callback: () =>
              dispatch(
                UserActions.changeAdminPassword(payload, (msg: string) => {
                  dispatch(UserActions.getUserLogs());
                  handleClose();
                })
              ),
          })
        );
      },
      [dispatch, handleClose]
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
                initialValues={initial_values}
                validationSchema={formSchema}
                onSubmit={handleFormSubmit}
                validateOnChange={false}
                validateOnBlur={false}
              >
                {({ values, errors, touched, setFieldValue, submitCount }) => (
                  <Form
                    id="form-change_pass"
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
                          label="Enter your old password"
                          name="old_password"
                          variant="outlined"
                          InputLabelProps={{ shrink: true }}
                          fullWidth
                          type="password"
                        />
                      </Grid>

                      <Grid xs={12} item>
                        <FormikInputField
                          label="Enter your new password"
                          name="password"
                          type="password"
                          variant="outlined"
                          InputLabelProps={{ shrink: true }}
                          fullWidth
                        />
                      </Grid>

                      <Grid xs={12} item>
                        <FormikInputField
                          label="Re-enter your new password"
                          name="confirm_password"
                          type="password"
                          variant="outlined"
                          InputLabelProps={{ shrink: true }}
                          fullWidth
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
                form="form-change_pass"
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

export default ChangePasswordDialog;
