import { Button, Form, Input, InputNumber, message, notification, Space } from "antd";
import React, { useEffect, useState } from "react";
import { emailRegex, mobileRegex } from "../../Constants";
import useApi from "../../hooks/useApi";
import { useDispatch, useSelector } from "react-redux";
import { updateUserData } from "../../redux/slice/userSlice";
import { usePost } from "../../hooks/usePost";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const { postData, response, isLoading } = usePost();
  const { postData : verifyUserPost, response : verifyUserResponse, isLoading : verifyUserLoading } = usePost();
  const { postData : emailVerification, response : emailVerificationResponse, isLoading : emailVerificationLoading } = usePost();
  const { postData : mobileVerification, response : mobileVerificationResponse, isLoading : mobileVerificationLoading } = usePost();
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.user);
  const [otp, setOTP] = useState("")
  const navigate = useNavigate();
  const [registerStep, setRegisterStep] = useState({
    showRegForm: true,
    showEmailVerifyForm: false,
    showMobileVerifyForm: false,
  });
  const [completionStatus, setCompletionStatus] = useState({
    emailVerified: false,
    mobileVerified: false,
  });

  const [formData, setFormData] = useState({
    user_type: "1",
    first_name: "",
    last_name: "",
    email: "",
    mobile_no: "",
  });

  const { Item } = Form;

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

  function handleFormData(field, value) {
    setFormData((prevState) => ({
      ...prevState,
      [field]: value,
    }));
  }

  function handleUpdateStep(falseKey, step, value) {
    setRegisterStep({ ...registerStep, [step]: value, [falseKey]: false });
  }

  console.log(emailVerificationResponse , "emailVerificationResponse")

  useEffect(() => {
    if (emailVerificationResponse?.status) {
      message.open({
        type: "success",
        content: emailVerificationResponse.message,
      });
      handleUpdateStep("showEmailVerifyForm", "showRegForm", true);
      setCompletionStatus((prevState) => ({
        ...prevState,
        emailVerified: true,
      }));
    }
  }, [emailVerificationResponse]);

  useEffect(() => {
    if (mobileVerificationResponse?.status) {
      message.open({
        type: "success",
        content: mobileVerificationResponse.message,
      });
      handleUpdateStep("showMobileVerifyForm", "showRegForm", true);
      setCompletionStatus((prevState) => ({
        ...prevState,
        mobileVerified: true,
      }));
    }
  }, [mobileVerificationResponse]);
  

  const registerUser = () => {
    async function register() {
      try {
        localStorage.removeItem("temp_token");
        await postData("/auth/register", formData);
      } catch (error) {
        console.log(error);
        notification.error({
          message: error.message,
        });
      }
    }
    register();
  };

  const handleEmailVerification = (code) => {
    try {
      emailVerification(
        `/auth/verify-otp`,
        {
          "otp" : otp
        },
        {
          "Authorization": `Bearer ${localStorage.getItem("temp_token")}`,
        }
      )
      
    } catch (error) {
      
    }
  };

  const handleMobileVerification = (code) => {
    try {
      mobileVerification(
        `/auth/verify-otp`,
        {
          "otp" : otp
        },
        {
          "Authorization": `Bearer ${localStorage.getItem("temp_token")}`,
        }
      )
    } catch (error) {
      
    }
  };

  useEffect(() => {
    console.log(verifyUserResponse , "verifyUserResponse")
    if(verifyUserResponse){
      if(verifyUserResponse?.token){
        localStorage.setItem("temp_token" , verifyUserResponse?.token)
      }
    }
  }, [verifyUserResponse])
  

  async function verifyData(key , value , keyToChange){
    try {
      setRegisterStep((prevState) => ({
        ...prevState,
        showRegForm: false,
      }));
      verifyUserPost(`/auth/verify` , {
        [key] : value
      }) 
      handleUpdateStep("showRegForm", keyToChange, true);
    } catch (error) {
      console.log("value")
    }
  }

  return (
    <section className="register-container">
      {registerStep.showRegForm ? (
        <h1>Register</h1>
      ) : registerStep.showEmailVerifyForm ? (
        <div className="verification-text-head">
          <i
            class="fi fi-tr-left"
            onClick={() =>
              handleUpdateStep("showEmailVerifyForm", "showRegForm", true)
            }
          ></i>
          <div>
            <h1>Verify Email</h1>
            <p>Please check your email for the verification link.</p>
          </div>
        </div>
      ) : registerStep.showMobileVerifyForm ? (
        <div className="verification-text-head">
          <i
            class="fi fi-tr-left"
            onClick={() =>
              handleUpdateStep("showMobileVerifyForm", "showRegForm", true)
            }
          ></i>
          <div>
            <h1>Verify Mobile Number</h1>
            <p>Please check your mobile number for the verification code.</p>
          </div>
        </div>
      ) : null}
      <Form className="registerForm" layout="vertical" onFinish={registerUser}>
        {registerStep.showRegForm ? (
          <>
            <Space align="baseline" className="userTypeSelection">
              <Button
                className={`${
                  formData.user_type === "1" ? "activeUserType" : ""
                } userTypeBtn`}
                onClick={() => handleFormData("user_type", "1")}
              >
                <i
                  class="fi fi-ts-customer-service"
                  style={formData.user_type === "1" ? { color: "#8c193f" } : {}}
                ></i>
                DSA
              </Button>
              <Button
                className={`${
                  formData.user_type === "2" ? "activeUserType" : ""
                } userTypeBtn`}
                onClick={() => handleFormData("user_type", "2")}
              >
                <i
                  class="fi fi-tr-review"
                  style={formData.user_type === "2" ? { color: "#8c193f" } : {}}
                ></i>
                Influencer
              </Button>
            </Space>
            <Space align="baseline">
              <Item
                name={"first_name"}
                label="First Name"
                rules={[
                  {
                    required: true,
                    message: "Invalid Input",
                  },
                ]}
              >
                <Input
                  value={formData.first_name}
                  onChange={(e) => handleFormData("first_name", e.target.value)}
                />
              </Item>
              <Item
                name={"last_name"}
                label="Last Name"
                rules={[
                  {
                    required: true,
                    message: "Invalid Input",
                  },
                ]}
              >
                <Input
                  value={formData.last_name}
                  onChange={(e) => handleFormData("last_name", e.target.value)}
                />
              </Item>
            </Space>
            <Item
              name={"email"}
              label="Email"
              rules={[
                {
                  validator: (_, value) => {
                    if (!completionStatus.emailVerified) {
                      return Promise.reject(new Error("Please Verify Email!"));
                    }
                    if (!emailRegex.test(value)) {
                      return Promise.reject(
                        new Error("Please Enter Valid Email!")
                      );
                    }
                    return Promise.resolve();
                  },
                  required: true,
                },
              ]}
            >
              <Input
                value={formData.email}
                onChange={(e) => handleFormData("email", e.target.value)}
                addonAfter={
                  <>
                    {completionStatus.emailVerified ? (
                      <>
                        <i
                          class="fi fi-rr-shield-trust"
                          style={{ color: "#4BB543" }}
                        ></i>
                      </>
                    ) : (
                      <i
                        class="fi fi-rr-paper-plane-top"
                        onClick={() => {
                          verifyData(
                            "email",
                            formData.email,
                            "showEmailVerifyForm"
                          );

                          handleUpdateStep(
                            "showRegForm",
                            "showEmailVerifyForm",
                            true
                          );
                        }}
                      ></i>
                    )}
                  </>
                }
              />
            </Item>
            <Item
              name={"mobile_no"}
              label="Mobile Number"
              rules={[
                {
                  validator: (_, value) => {
                    if (!completionStatus.mobileVerified) {
                      return Promise.reject(
                        new Error("Please Verify Mobile Number!")
                      );
                    }
                    if (!mobileRegex.test(value)) {
                      return Promise.reject(
                        new Error("Please Enter Valid Mobile!")
                      );
                    }
                    return Promise.resolve();
                  },
                  required: true,
                },
              ]}
            >
              <Input
                value={formData.mobile_no}
                onChange={(e) => handleFormData("mobile_no", e.target.value)}
                controls={false}
                addonAfter={
                  <>
                    {completionStatus.mobileVerified ? (
                      <>
                        <i
                          class="fi fi-rr-shield-trust"
                          style={{ color: "#4BB543" }}
                        ></i>
                      </>
                    ) : (
                      <i
                        class="fi fi-rr-paper-plane-top"
                        onClick={() => {
                          setRegisterStep((prevState) => ({
                            ...prevState,
                            showRegForm: false,
                          }));
                          verifyData(
                            "mobile_no",
                            formData.mobile_no,
                            "showMobileVerifyForm"
                          );
                        }}
                      ></i>
                    )}
                  </>
                }
              />
            </Item>
            <Item>
              <Button
                htmlType="submit"
                className="registerUserBtn"
                loading={isLoading}
                // disabled={
                //   !(
                //     completionStatus.emailVerified &&
                //     completionStatus.mobileVerified
                //   )
                // }
              >
                Register
              </Button>
            </Item>
          </>
        ) : registerStep.showEmailVerifyForm ? (
          <div className="verify-form">
            <Item
              rules={[
                {
                  required: true,
                  message: "Please Enter OTP",
                  pattern: /^[0-9]{4}$/,
                },
              ]}
            >
              <Input
                placeholder="Enter OTP sent to your Email"
                autoFocus
                onChange={(e) => setOTP(e.target.value)}
              />
            </Item>
            <Button
              className="verifyEmailBtn"
              onClick={handleEmailVerification}
            >
              Verify Email
            </Button>
          </div>
        ) : (
          <div className="verify-form">
            <Item
              rules={[
                {
                  required: true,
                  message: "Please Enter OTP",
                  pattern: /^[0-9]{4}$/,
                },
              ]}
            >
              <Input
                placeholder="Enter OTP sent to your Mobile Number"
                autoFocus
                onChange={(e) => setOTP(e.target.value)}
              />
            </Item>
            <Button
              className="verifyEmailBtn"
              onClick={handleMobileVerification}
            >
              Verify Mobile
            </Button>
          </div>
        )}
      </Form>
      <p>
        Already a User? <a href="/login">Login Here</a>
      </p>
    </section>
  );
};

export default Register;
