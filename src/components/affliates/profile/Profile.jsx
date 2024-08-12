import { Button, Form, Input, Space, Spin } from "antd";
import React, { useEffect } from "react";
import useApi from "../../../hooks/useApi";
import { SpinLoader } from "../../../common/Common";

const { Item } = Form;

function Profile() {
  const [form] = Form.useForm();
  const { data , loading, error, put, get, post } = useApi();

  useEffect(() => {
    get("/user")
  }, [])
  
  
  useEffect(() => {
    form.setFieldsValue(data);
  }, [form, data]);

  const pwd = {
    new: "",
    confirm: "",
  };

  function handleFormData(key, value) {
    data[key] = value;
  }

  async function handleUserDataEdit() {
    const response = await put('/auth/update' , data)
  }

  async function handleResetPassword() {
    const response = await post('/auth/password' , {
      password : pwd.new
    })
  }

  if (loading) return <SpinLoader/>;

  console.log(data , "data12")

  return (
    <section className="profile-page">
      <div className="intro-section">
        <h3>Profile</h3>
        <p>Control Your Profile Settings.</p>
      </div>
      <div className="profile-form-settings">
        <div className="user-data-edit-form">
          <h4>Profile Details</h4>
          {(data?.data?.first_name || data?.data?.last_name || data?.data?.mobile_no || data?.data?.email) && (
            <div className="profile-detail-update-missing">
              <i class="fi fi-tr-triangle-warning"></i>
              <span>You haven't provided your profile details yet.</span>
            </div>
          )}
          <Form
            onFinish={handleUserDataEdit}
            layout="vertical"
            form={form}
            initialValues={data?.data}
          >
            <Space align="baseline">
              <Item
                name="first_name"
                label="First Name"
                rules={[
                  {
                    required: true,
                    message: "Please Enter First Name",
                  },
                ]}
              >
                <Input
                  value={data?.first_name}
                  onChange={(e) => handleFormData("first_name", e.target.value)}
                />
              </Item>
              <Item
                name={"last_name"}
                label="Last Name"
                rules={[
                  {
                    required: true,
                    message: "Please Enter Last Name",
                  },
                ]}
              >
                <Input
                  value={data?.last_name}
                  onChange={(e) => handleFormData("last_name", e.target.value)}
                />
              </Item>
            </Space>
            <Item
              name={"email"}
              label="Email"
              rules={[
                {
                  required: true,
                  message: "Please Enter Email",
                },
              ]}
            >
              <Input
                value={data?.email}
                onChange={(e) => handleFormData("email", e.target.value)}
              />
            </Item>
            <Item
              name={"mobile_no"}
              label="Mobile Number"
              rules={[
                {
                  required: true,
                  message: "Please Enter Mobile Number",
                },
              ]}
            >
              <Input
                value={data?.mobile_no}
                onChange={(e) => handleFormData("mobile_no", e.target.value)}
              />
            </Item>
            <Item>
              <Button className="profile-page-cta" htmlType="submit">
                Save Changes
              </Button>
            </Item>
          </Form>
        </div>
        <div className="password-reset-form">
          <h4>Update Password</h4>
          <Form layout="vertical" onFinish={handleResetPassword}>
            <Item
              label={"New Password"}
              rules={[
                {
                  required: true,
                  message: "Please Enter New Password",
                },
              ]}
              name={"new"}
            >
              <Input.Password
                value={pwd.new}
                onChange={(e) => (pwd.new = e.target.value)}
              />
            </Item>
            <Item
              label={"Confirm Password"}
              rules={[
                {
                  required: true,
                  message: "Please Enter Confirm Password",
                },
              ]}
              name={"confirm"}
            >
              <Input.Password
                value={pwd.confirm}
                onChange={(e) => (pwd.confirm = e.target.value)}
              />
            </Item>
            <Item>
              <Button className="profile-page-cta" htmlType="submit">
                Reset Password
              </Button>
            </Item>
          </Form>
        </div>
      </div>
    </section>
  );
}

export default Profile;
