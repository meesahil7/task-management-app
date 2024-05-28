import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Checkbox, Form, Input, Spin, message } from "antd";
import styles from "./login.module.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import { useAuthContext } from "../../context/AuthContext";

const Login = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const { setAuthUser } = useAuthContext();
  const navigate = useNavigate();
  const onFinish = (values) => {
    const { email, password } = values;
    setIsLoading(true);
    try {
      axios
        .post("https://task-management-app-mnqk.onrender.com/auth/login", {
          email,
          password,
        })
        .then((res) => {
          messageApi.open({
            type: "success",
            content: "Login successful",
            duration: 2,
          });
          setAuthUser(res.data.token);
          Cookies.set("quleepAuth", res.data.token);

          if (res.data.token) navigate("/");
        })
        .catch((err) => {
          return messageApi.open({
            type: "error",
            content: err.response.data.error,
            duration: 3,
          });
        });
      setIsLoading(false);
    } catch (e) {
      console.log(e);
      setIsLoading(false);
    }
  };
  return (
    <div className={styles.container}>
      {contextHolder}
      <Spin spinning={isLoading} fullscreen></Spin>
      <div className={styles.form}>
        <h2>Login</h2>
        <Form
          name="normal_login"
          className="login-form"
          initialValues={{
            remember: true,
          }}
          onFinish={onFinish}
        >
          <Form.Item
            name="email"
            rules={[
              {
                required: true,
                message: "Please input your Username!",
              },
            ]}
          >
            <Input
              prefix={<UserOutlined className="site-form-item-icon" />}
              placeholder="Email"
            />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[
              {
                required: true,
                message: "Please input your Password!",
              },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined className="site-form-item-icon" />}
              type="password"
              placeholder="Password"
            />
          </Form.Item>
          <Form.Item>
            <Form.Item name="remember" valuePropName="checked" noStyle>
              <Checkbox>Remember me</Checkbox>
            </Form.Item>
          </Form.Item>
          <Form.Item style={{ display: "flex", gap: "30px" }}>
            <Button
              type="primary"
              htmlType="submit"
              className="login-form-button"
            >
              Log in
            </Button>
            <span> Or</span>{" "}
            <Button type="link" onClick={() => navigate("/signup")}>
              Register now
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};
export default Login;
