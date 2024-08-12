import { Button, Form, Input, message } from "antd";
import React, { useEffect, useState } from "react";
import { usePost } from "../../hooks/usePost";
import { albionDarKThemeLogo } from "../../assets";
import { useNavigate } from "react-router-dom";

const AdminLogin = () => {
  const { Item } = Form;
  const { postData, response, isLoading, error } = usePost();
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  useEffect(() => {
    if (response) {
      message.open({
        type: "success",
        content: response.message,
      });
      localStorage.setItem("token", response.token);
      navigate('/admin/dashboard')
    }
  }, [response]);

  function handleAdminLogin(name, value) {
    setFormData({ ...formData, [name]: value });
  }

  const handleLogin = () => {
    async function validateAdminLogin() {
      await postData("/auth/admin/login", formData);
    }
    validateAdminLogin();
  };

  return (
    <section className="admin-login-container">
      <div className="admin-login-page">
        <div className="albion-admin">
          <img src={albionDarKThemeLogo} />
          <sup>Admin</sup>
        </div>
        <Form
          layout="vertical"
          onFinish={handleLogin}
          className="admin-login-form"
        >
          <Item
            rules={[
              {
                required: true,
                message: "Please Enter Email",
              },
            ]}
            name={"email"}
          >
            <Input
              onChange={(e) => handleAdminLogin("email", e.target.value)}
              placeholder="Enter Email"
            />
          </Item>
          <Item
            rules={[
              {
                required: true,
                message: "Please Enter Password",
              },
            ]}
            name={"password"}
          >
            <Input.Password
              onChange={(e) => handleAdminLogin("password", e.target.value)}
              placeholder="Enter Password"
            />
          </Item>
          <Item>
            <Button htmlType="submit" className="adminLoginBtn" loading={isLoading}>
              Login
            </Button>
          </Item>
        </Form>
      </div>
    </section>
  );
};

export default AdminLogin;
