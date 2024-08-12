import React, { useEffect, useState } from "react";
import { Button, Divider, Form, Input, message, notification } from "antd";
import { emailRegex, mobileRegex } from "../../Constants";
import { GoogleLogin, useGoogleLogin } from "@react-oauth/google";
import useApi from "../../hooks/useApi";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { usePost } from "../../hooks/usePost";
import {
  albionDarKThemeLogo,
  albionFavLogoNew,
  albionOgLogo,
  googleIcon
} from "../../assets";
import { useDispatch } from "react-redux";
import { updateUserData } from "../../redux/slice/userSlice";

const Login = () => {
  const { postData, response, isLoading } = usePost();
  const {postData : googlePost , response : googlePostResponse , isLoading : googleLoginLoading} = usePost();
  const { post, data, error } = useApi();
  const navigate = useNavigate();
  const [givenInput, setGivenInput] = useState();
  const [googleUser, setGoogleUser] = useState([]);
  const [password, setPassword] = useState();
  const dispatch = useDispatch();
  const [otp, setOTP] = useState();
  const [loginStep, setLoginStep] = useState({
    otpSent: false,
    otpVerified: false,
    loginWithPassword: false,
  });

  useEffect(() => {
    if (response) {
      localStorage.setItem("token", response.token);
      navigate("/dashboard");
    }
  }, [response]);

  const { Item } = Form;

  useEffect(() => {
    if(googlePostResponse){
      message.success("Google Login Successful");
      localStorage.setItem("token", googlePostResponse.token);
      navigate('/dashboard');
    }
  }, [googlePostResponse])
  

  async function googleLogin(apiResponse){
    try {
      const response = await googlePost('/auth/google_login' , {
        "email" : apiResponse?.data?.email
      })
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    async function googleUserLogin() {
      try {
        const response = await axios.get(
          `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${googleUser.access_token}`,
          {
            headers: {
              Authorization: `Bearer ${googleUser.access_token}`,
              Accept: "application/json",
            },
          }
        );
        googleLogin(response);
      } catch (error) {
        console.log(error)
      }
    }
    if (googleUser?.access_token) {
      googleUserLogin();
    }
  }, [googleUser]);

  useEffect(() => {
    if (response) {
      const { data, token, message } = response;
      localStorage.setItem("token", token);
      dispatch(updateUserData(data));
      notification.success({
        message,
      });
      navigate("/dashboard");
    }
  }, [response]);

  const handleSubmit = () => {
    async function verifyOTP() {
      await postData("/auth/verify_otp", {
        mobile_no: givenInput,
        otp: otp,
      });
    }
    verifyOTP();
  };

  const handleLoginWithPassword = () => {
    async function loginWithPassword() {
      try {
        await postData("/auth/login", {
          email: givenInput,
          password: password,
        });
      } catch (error) {
        notification.error({
          message: "User or Password is incorrect",
        });
      }
    }
    loginWithPassword();
  };

  function handleLoginSubmit() {
    if (!loginStep.otpSent) {
      setLoginStep((prev) => ({
        ...prev,
        otpSent: true,
      }));
    } else {
      setLoginStep((prev) => ({
        ...prev,
        otpVerified: true,
      }));
    }
  }

  function handleGoBack() {
    setLoginStep((prev) => ({
      ...prev,
      otpSent: false,
    }));
  }

  async function handleRequestOTP() {
    let payload = givenInput.includes("@")
      ? { email: givenInput }
      : { mobile_no: givenInput };
    try {
      const response = await post("/auth/request_otp", payload);
      setLoginStep((prevState) => ({ ...prevState, otpSent: true }));
    } catch (error) {
      notification.error({
        message: error.message,
      });
    }
  }
  
  const login = useGoogleLogin({
    onSuccess: (codeResponse) => setGoogleUser(codeResponse),
    onError: (error) => console.log("Login Failed:", error),
  });

  return (
    <section className="login-main-container">
      <img src={albionFavLogoNew} />
      <section className="login-container">
        <div className="login-header-section">
          {loginStep.otpSent && (
            <i class="fi fi-tr-left" title="Go Back" onClick={handleGoBack}></i>
          )}
          <h1>Login</h1>
        </div>
        <Form
          onFinish={
            loginStep.loginWithPassword
              ? handleLoginWithPassword
              : loginStep?.otpSent
              ? handleSubmit
              : handleRequestOTP
          }
          layout="vertical"
          className="login-form"
        >
          {loginStep.loginWithPassword ? (
            <>
              <Item
                label="Enter Email / Mobile Number"
                rules={[
                  {
                    validator: (_, value) => {
                      if (
                        !(emailRegex.test(value) || mobileRegex.test(value))
                      ) {
                        return Promise.reject(
                          new Error("Please Enter Valid Input!")
                        );
                      }
                      return Promise.resolve();
                    },
                    required: true,
                  },
                ]}
                name="givenInput"
              >
                <Input
                  value={givenInput}
                  onChange={(e) => setGivenInput(e.target.value)}
                />
              </Item>
              <Item
                name={"password"}
                rules={[
                  {
                    required: true,
                    message: "Please Enter Password",
                  },
                ]}
              >
                <Input.Password
                  value={"password"}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </Item>
            </>
          ) : loginStep.otpSent ? (
            <>
              <Item
                label="Enter OTP"
                rules={[
                  {
                    required: true,
                    message: "Please Enter Valid OTP",
                  },
                ]}
                name={"otp"}
              >
                <Input.OTP
                  value={otp}
                  autoFocus
                  length={4}
                  onChange={(value) => setOTP(value)}
                />
              </Item>
            </>
          ) : (
            <Item
              label="Enter Email / Mobile Number"
              rules={[
                {
                  validator: (_, value) => {
                    if (!(emailRegex.test(value) || mobileRegex.test(value))) {
                      return Promise.reject(
                        new Error("Please Enter Valid Input!")
                      );
                    }
                    return Promise.resolve();
                  },
                  required: true,
                },
              ]}
              name="givenInput"
            >
              <Input
                value={givenInput}
                onChange={(e) => setGivenInput(e.target.value)}
              />
            </Item>
          )}
          <Item>
            <Button htmlType="submit" loading={isLoading}>
              {loginStep.loginWithPassword
                ? "Log In"
                : loginStep.otpSent
                ? "Verify"
                : "Get OTP"}
            </Button>
          </Item>
          <center>
            Login with{" "}
            <a
              onClick={() => {
                setLoginStep((prev) => ({
                  ...prev,
                  loginWithPassword: !loginStep.loginWithPassword,
                }));
              }}
            >
              {loginStep.loginWithPassword ? "OTP" : "Password"}
            </a>
          </center>
        </Form>
        <Divider>OR</Divider>
        <div className="google-login-area">
          <div className="google-login-sec" onClick={login}>
            <img
              src={googleIcon}
              alt="Albion Dark Theme Logo"
              className="dark-theme-logo"
            />
            <p>
              Login With Google
            </p>
          </div>
          {/* <div className="quick-logins">
            <i class="fi fi-brands-google" onClick={login}></i>
            <i class="fi fi-brands-facebook"></i>
            <i class="fi fi-brands-linkedin"></i>
          </div> */}
          <p>
            Don't Have An Account? <a href="/register">Register Here</a>
          </p>
        </div>
      </section>
    </section>
  );
};

export default Login;
