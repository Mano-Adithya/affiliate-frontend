import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useApi from "../../../hooks/useApi";
import { Button, Form, Input, message, Popconfirm, Spin } from "antd";
import { emailRegex, mobileRegex, nameRegex } from "../../../Constants";
import { usePost } from "../../../hooks/usePost";
import { generatePassword } from "../../../utils/helpers";
import { usePut } from "../../../hooks/usePut";

const EditUser = () => {
  const { Item } = Form;
  const [form] = Form.useForm();
  const { data, get, loading, error } = useApi();
  const [profileInformation, setProfileInformation] = useState({});
  const [generatedPassword, setGeneratedPassword] = useState("");
  const { postData, isLoading, error: updateProfileError } = usePost();
  const { putData, updateResponse, updateLoading, updateError } = usePut();
  const { id } = useParams();
  useEffect(() => {
    get(`/user/list/${id}`);
  }, [id]);

  console.log(data , "data124")

  useEffect(() => {
    if (data != null) {
      let userProfileData = {
        first_name: data?.data?.first_name,
        last_name: data?.data?.last_name,
        email: data?.data?.email,
        mobile_no: data?.data?.mobile_no,
        referral_code: data?.data?.referral_code,
      };
      setProfileInformation(userProfileData);
      form.setFieldsValue(userProfileData);
    }
  }, [data, form]);

  useEffect(() => {
    if(updateResponse){
      message.open({
        type : "success",
        content : updateResponse.message
      })
    }
  }, [updateResponse])
  

  const handleSaveProfile = () => {
    async function saveProfile() {
      postData();
    }
    saveProfile();
  };

  if (loading) return <Spin />;

  function handleProfileChange(key, value) {
    setProfileInformation((prevState) => ({
      ...prevState,
      [key]: value,
    }));
  }

  async function generatePasswordRandom() {
    const pwd = generatePassword(20);
    setGeneratedPassword(pwd);
  }

  async function handlePasswordReset() {}
  
  async function handleUserBlock(id){
    await putData(`/auth/block/${id}`);
    await get(`/user/list/${id}`);
  }

  return (
    <section className="user-edit-page-container">
      <div className="user-edit-area">
        <div className="user-edit-hero">
          <h2>User ID - {id}</h2>
          <div className="user-edit-action-btns">
            <Popconfirm
              title={data?.data?.status ? "Block User" : "UnBlock User"}
              description={`Are you sure you want to ${data?.data?.status ? "block" : "unblock"} this user`}
              cancelText="Cancel"
              okText={data?.data?.status ? "Block" : "UnBlock"}
              okType={"dashed"}
              onConfirm={() => handleUserBlock(id)}
            >
              <Button className={`${data?.data?.status ? "block-user-ab" : "unblock-user-ab"}`}>
                {data?.data?.status ? (
                  <i class="fi fi-ts-road-barrier"></i>
                ) : (
                  <i class="fi fi-ss-exclamation"></i>
                )}
                {data?.data?.status ? "Block User" : "Unblock User"}
              </Button>
            </Popconfirm>
            <Popconfirm
              title="Delete User"
              description="Are you sure you want to delete this user"
              cancelText="Cancel"
              okText="YES"
              okType="danger"
            >
              <Button className="delete-user-ab">
                <i class="fi fi-rr-trash"></i>
                Delete User
              </Button>
            </Popconfirm>
          </div>
        </div>
        <div className="first-row">
          <div className="personal-information-edit">
            <h2>Personal Information</h2>
            <Form
              layout="vertical"
              onFinish={handleSaveProfile}
              form={form}
              initialValues={profileInformation}
            >
              <Item
                label="First Name"
                rules={[
                  {
                    validator: (_, value) => {
                      if (!nameRegex.test(value)) {
                        return new Promise.reject(
                          new Error("Please Enter Valid Email")
                        );
                      }
                      return Promise.resolve();
                    },
                    message: "Please Enter Valid First Name",
                  },
                ]}
                name={"first_name"}
              >
                <Input
                  value={profileInformation?.first_name}
                  prefix={<i class="fi fi-tr-id-card-clip-alt"></i>}
                  onChange={(e) =>
                    handleProfileChange("first_name", e.target.value)
                  }
                />
              </Item>
              <Item
                label="Last Name"
                rules={[
                  {
                    validator: (_, value) => {
                      if (!nameRegex.test(value)) {
                        return new Promise.reject(
                          new Error("Please Enter Valid Email")
                        );
                      }
                      return Promise.resolve();
                    },
                    message: "Please Enter Valid Last Name",
                  },
                ]}
                name={"last_name"}
              >
                <Input
                  value={profileInformation?.last_name}
                  prefix={<i class="fi fi-tr-id-card-clip-alt"></i>}
                  onChange={(e) =>
                    handleProfileChange("last_name", e.target.value)
                  }
                />
              </Item>
              <Item
                label="Email"
                rules={[
                  {
                    validator: (_, value) => {
                      if (!emailRegex.test(value)) {
                        return new Promise.reject(
                          new Error("Please Enter Valid Email")
                        );
                      }
                      return Promise.resolve();
                    },
                    message: "Please Enter Valid Email",
                  },
                ]}
                name={"email"}
              >
                <Input
                  value={profileInformation?.email}
                  prefix={<i class="fi fi-tr-circle-envelope"></i>}
                  onChange={(e) => handleProfileChange("email", e.target.value)}
                />
              </Item>
              <Item
                label="Mobile Number"
                rules={[
                  {
                    validator: (_, value) => {
                      if (!mobileRegex.test(value)) {
                        return new Promise.reject(
                          new Error("Please Enter Valid Mobile Number")
                        );
                      }
                      return Promise.resolve();
                    },
                    message: "Please Enter Valid Mobile Number",
                  },
                ]}
                name={"mobile_no"}
              >
                <Input
                  value={profileInformation?.mobile_no}
                  prefix={<i class="fi fi-tr-reservation-smartphone"></i>}
                  onChange={(e) =>
                    handleProfileChange("mobile_no", e.target.value)
                  }
                  maxLength={10}
                />
              </Item>
              <Item>
                <Button
                  htmlType="submit"
                  className="saveInformationBtn"
                  prefix={<i class="fi fi-tr-floppy-disks"></i>}
                >
                  Save Information
                </Button>
              </Item>
            </Form>
          </div>
          <div className="password-reset-edit">
            <Form>
              <Form.Item>
                <Input.Password
                  placeholder="New Password"
                  readOnly
                  value={generatedPassword}
                />
              </Form.Item>
              <Button
                onClick={generatePasswordRandom}
                className="generatePasswordBtn"
              >
                Generate Password
              </Button>
              <Form.Item>
                <Button className="resetPasswordBtn">Reset Password</Button>
              </Form.Item>
            </Form>
            <div className="wallet-and-referrals">
              <h3>User Referral Code & Wallet Earnings</h3>
              <div className="referral-code">
                Referral Code - {profileInformation.referral_code}
              </div>
              <div className="total-earnings">
                <div className="total-this-month">
                  <p>Earning This Month</p>
                  <h2>&#x20B9; {profileInformation.total_earnings ?? 0}</h2>
                </div>
                <div className="earnings-total">
                  <p>Total Earnings</p>
                  <h2>&#x20B9; {profileInformation.this_month_earnings ?? 0} </h2>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EditUser;
