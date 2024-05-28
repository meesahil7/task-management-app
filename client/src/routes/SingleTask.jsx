import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Cookies from "js-cookie";
import axios from "axios";
import { Button, Spin } from "antd";

const SingleTask = () => {
  const [task, setTask] = useState({});
  const [token, setToken] = useState(Cookies.get("quleepAuth") || null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const { id } = useParams();

  useEffect(() => {
    setToken(Cookies.get("quleepAuth"));
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

  console.log(task);
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        marginTop: "5%",
      }}
    >
      <Spin spinning={isLoading} fullscreen></Spin>
      <h2 style={{ textDecoration: "underline" }}>Task Details</h2>
      {task && (
        <div style={{ textAlign: "left" }}>
          <p>Title : {task.title}</p>
          <p>Description : {task.description}</p>
          <p>Status : {task.status}</p>
          <p>Due Date : {task.dueDate}</p>
          <Button type="primary" onClick={() => navigate(`/task/edit/${id}`)}>
            Edit Task
          </Button>
        </div>
      )}
    </div>
  );
};

export default SingleTask;
