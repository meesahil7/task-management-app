import styles from "./taskForm.module.css";
import { Button, Spin, message } from "antd";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Cookies from "js-cookie";
import axios from "axios";

const initialState = {
  title: "",
  description: "",
  status: "",
  dueDate: "",
};

const TaskForm = () => {
  const [task, setTask] = useState(initialState);
  const [token, setToken] = useState(Cookies.get("quleepAuth") || null);
  const [isLoading, setIsLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const navigate = useNavigate();

  const { id } = useParams();

  const handleAdd = () => {
    const { title, description } = task;
    if (!title || !description) {
      return messageApi.open({
        type: "error",
        content: "title & description are required",
        duration: 3,
      });
    }
    setIsLoading(true);
    try {
      axios
        .post(`http://localhost:8080/tasks`, task, {
          headers: { Authorization: token },
        })
        .then(() => {
          messageApi.open({
            type: "success",
            content: "task added successfully",
            duration: 3,
          });
          setTask(initialState);
        })
        .catch(() =>
          messageApi.open({
            type: "error",
            content: "something went wrong",
            duration: 3,
          })
        );
      setIsLoading(false);
    } catch (e) {
      console.log(e);
      messageApi.open({
        type: "error",
        content: "something went wrong",
        duration: 3,
      });
      setIsLoading(false);
    }
  };

  const handleUpdate = () => {
    const { title, description } = task;
    if (!title || !description) {
      return messageApi.open({
        type: "error",
        content: "title & description are required",
        duration: 3,
      });
    }
    setIsLoading(true);
    try {
      axios
        .put(`http://localhost:8080/tasks/${id}`, task, {
          headers: { Authorization: token },
        })
        .then(() => {
          messageApi.open({
            type: "success",
            content: "task updated successfully",
            duration: 3,
          });
          navigate("/");
        })
        .catch(() =>
          messageApi.open({
            type: "error",
            content: "something went wrong",
            duration: 3,
          })
        );
      setIsLoading(false);
    } catch (e) {
      console.log(e);
      messageApi.open({
        type: "error",
        content: "something went wrong",
        duration: 3,
      });
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setToken(Cookies.get("quleepAuth"));
    if (!id) return;
    setIsLoading(true);
    try {
      axios
        .get(`http://localhost:8080/tasks/${id}`, {
          headers: { Authorization: token },
        })
        .then((res) => {
          setTask(res.data.task[0]);
        })
        .catch((err) => console.log(err));
      setIsLoading(false);
    } catch (err) {
      console.log(err);
      setIsLoading(false);
    }
  }, [id, token]);

  // console.log(task);
  return (
    <div className={styles.container}>
      <h2>Add / Edit Task</h2>
      <Button type="link" onClick={() => navigate("/")}>
        Go to homepage
      </Button>
      <Spin spinning={isLoading} fullscreen></Spin>
      {contextHolder}
      <div className={styles.formDiv}>
        <div>
          <label htmlFor="">Title : </label>
          <input
            type="text"
            value={task && task.title}
            onChange={(e) => setTask({ ...task, title: e.target.value })}
          />
        </div>
        <div>
          <label htmlFor="">Description : </label>
          <input
            type="text"
            value={task && task.description}
            onChange={(e) => setTask({ ...task, description: e.target.value })}
          />
        </div>
        <div>
          <label htmlFor="">Status : </label>
          <select
            name=""
            id=""
            value={task && task.status}
            onChange={(e) => setTask({ ...task, status: e.target.value })}
          >
            <option value="">-- Select Status --</option>
            <option value="to-do">To do</option>
            <option value="in-progress">In Progress</option>
            <option value="done">Done</option>
          </select>
        </div>
        <div>
          <label htmlFor="">Due Date : </label>
          <input
            type="date"
            value={task && new Date(task.dueDate).toLocaleDateString("en-CA")}
            onChange={(e) => setTask({ ...task, dueDate: e.target.value })}
          />
        </div>
        <Button type="primary" onClick={id ? handleUpdate : handleAdd}>
          {id ? "Update Task" : "Add Task"}
        </Button>
      </div>
    </div>
  );
};

export default TaskForm;
