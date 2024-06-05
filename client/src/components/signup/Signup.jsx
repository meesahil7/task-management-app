import { Formik, Form, Field, ErrorMessage } from "formik";
import { useState } from "react";
import styles from "./signup.module.css";
import { Button, Spin, message } from "antd";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function validateEmail(value) {
  let error;
  if (!value) {
    error = "Required";
  } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)) {
    error = "Invalid email address";
  }
  return error;
}

function validatePassword(value) {
  let error;
  if (!value) {
    error = "Required";
  } else if (!/(?=.*[A-Za-z])/.test(value)) {
    error = "At least one letter";
  } else if (!/(?=.*\d)/.test(value)) {
    error = "At least one number";
  } else if (!/(?=.*[@$!%*#?&])/.test(value)) {
    error = "At least one special character";
  } else if (value.length < 8) {
    error = "Minimum eight characters";
  }
  return error;
}

const Signup = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [passwordType, setPasswordType] = useState(true);
  const [messageApi, contextHolder] = message.useMessage();
  const navigate = useNavigate();

  const handleSubmit = (value) => {
    const { password, confirmPassword } = value;
    if (password !== confirmPassword)
      return messageApi.open({
        type: "error",
        content: "Password and confirm password do not match",
        duration: 3,
      });
    setIsLoading(true);
    try {
      axios
        .post(
          "https://task-management-app-mnqk.onrender.com/auth/signup",
          value
        )
        .then(() => {
          messageApi
            .open({
              type: "success",
              content: "User is registered successfully",
              duration: 3,
            })
            .then(() => navigate("/login"));
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
      <Formik
        initialValues={{
          fullName: "",
          email: "",
          password: "",
          confirmPassword: "",
        }}
        onSubmit={handleSubmit}
      >
        {() => (
          <Form className={styles.form}>
            <h2>Sign Up</h2>
            <Field
              name="fullName"
              type="text"
              className={styles.email}
              placeholder="Full Name"
            />
            <Field
              name="email"
              type="email"
              className={styles.email}
              validate={validateEmail}
              placeholder="Email"
            />
            <ErrorMessage
              name="email"
              component="div"
              className={styles.errorMsg}
            />
            <Field
              name="password"
              type={passwordType ? "password" : "text"}
              className={styles.password}
              validate={validatePassword}
              placeholder="Password"
            />
            <ErrorMessage
              name="password"
              component="div"
              className={styles.errorMsg}
            />
            <Field
              name="confirmPassword"
              type="password"
              className={styles.password}
              placeholder="Confirm Password"
            />
            <div className={styles.passwordDiv}>
              <input
                type="checkbox"
                onChange={() => setPasswordType((prev) => !prev)}
              />
              <p>Show Password</p>
            </div>
            <Spin spinning={isLoading} fullscreen={true}></Spin>
            <button type="submit" className={styles.submit}>
              Sign Up
            </button>
            <p>
              Already have an account?{" "}
              <Button type="link" onClick={() => navigate("/login")}>
                Login
              </Button>
            </p>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default Signup;
