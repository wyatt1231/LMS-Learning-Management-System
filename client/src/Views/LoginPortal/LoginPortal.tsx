import { Avatar, Button } from "@material-ui/core";
import { useTheme } from "@material-ui/styles";
import clsx from "clsx";
import { Form, Formik, FormikHelpers } from "formik";
import React, { FC, memo, useCallback, useState } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import app_logo from "../../Assets/Images/Logo/school_logo.jpg";
import LoadingButton from "../../Component/LoadingButton";
import { APP_NAME } from "../../Helpers/AppConfig";
import importImagesFromFolder from "../../Helpers/importImagesFromFolder";
import UseInterval from "../../Hooks/UseInterval";
import { ILoginPortalAuthFormValues } from "../../Interfaces/LoginPortalInterface";
import { SetCurrentUserAction } from "../../Services/Actions/UserActions";
import { LoginApi } from "../../Services/Api/UserApi";
import FieldPassword from "./FieldPassword";
import FieldUsername from "./FieldUsername";
import { LoginStyles, StyledImageBackground } from "./styles";

interface ILoginPortal {}

const authFormValues: ILoginPortalAuthFormValues = {
  username: "",
  password: "",
};

const images: Array<any> = importImagesFromFolder(
  require.context(
    "../../Assets/Images/Login/",
    true,
    /\.(png|jpg|jpe?g|svg|gif)$/
  )
);

const delaySec = 5000;

export const LoginPortal: FC<ILoginPortal> = memo(() => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const [currentBackground, setCurrentBackground] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [authError, setAuthError] = useState("");
  const history = useHistory();
  const handleChange = useCallback(() => {
    setCurrentBackground((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  }, []);

  const handleTogglePassword = useCallback(() => {
    setShowPassword((prevState) => !prevState);
  }, []);

  UseInterval(handleChange, delaySec);

  const handleSubmit = useCallback(
    async (
      values: ILoginPortalAuthFormValues,
      formikHelpers: FormikHelpers<ILoginPortalAuthFormValues>
    ) => {
      setIsAuthenticating(true);
      const response = await LoginApi(values);
      setIsAuthenticating(false);
      if (response.success) {
        localStorage.setItem(
          APP_NAME,
          JSON.stringify({
            access_token: response.data.token,
          })
        );
        dispatch(SetCurrentUserAction());
      } else {
        if (typeof response.message === "string") {
          setAuthError(response.message);
        }
        formikHelpers.resetForm();
      }
    },
    []
  );

  return (
    <LoginStyles theme={theme}>
      <div style={{ gridArea: "login" }} className="login-container">
        <div className="slider-ctnr">
          {images.map((imgSrc: any, index: number) => (
            <StyledImageBackground
              src={imgSrc}
              key={index}
              className={clsx("slides", {
                active: index === currentBackground,
              })}
            >
              <h1 className="app-name">{APP_NAME}</h1>
            </StyledImageBackground>
          ))}
        </div>
        <div className="form-ctnr">
          <section className="header">
            <img className="brand-logo" src={app_logo} alt="" />

            <h2 className="brand-name">{process.env.REACT_APP_CLIENT}</h2>
          </section>

          <section className="body">
            <small className="body-title">
              You can sign into your account here
            </small>

            {!!authError && <div className="error">{authError}</div>}

            <Formik initialValues={authFormValues} onSubmit={handleSubmit}>
              <Form className="form">
                <FieldUsername />
                <FieldPassword
                  showPassword={showPassword}
                  handleTogglePassword={handleTogglePassword}
                />

                {/* <NavLink to="/login" className="forgetpass">
                  <div className="forget-text">
                    Let us help you if you <span>forgot your password?</span>
                  </div>
                </NavLink> */}
                <div className="buttons">
                  <LoadingButton
                    type="submit"
                    className="submit-btn"
                    variant="contained"
                    // disableElevation
                    size="large"
                    color="primary"
                    loading={isAuthenticating}
                    fullWidth={true}
                  >
                    Log in
                  </LoadingButton>
                  <Button
                    type="button"
                    variant="contained"
                    size="large"
                    color="primary"
                    disableElevation
                    onClick={() => {
                      history.push(`/student-registration`);
                    }}
                  >
                    Create Student Account
                  </Button>
                </div>
              </Form>
            </Formik>
          </section>
          <section className="footer">
            <div className="title">Developed & Maintained By</div>
            {/* <Avatar className="tuo_logo" src={app_logo} /> */}
            <div className="tuo-name">{process?.env.REACT_APP_PROVIDER}</div>
          </section>
        </div>
      </div>
    </LoginStyles>
  );
});

export default LoginPortal;
