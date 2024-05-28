import { Button, Popconfirm, Space, Spin, Table, message } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { Link, useNavigate } from "react-router-dom";
import styles from "./tasks.module.css";

const Tasks = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [taskData, setTaskData] = useState([]);
  const [messageApi, contextHolder] = message.useMessage();
  const [token, setToken] = useState(Cookies.get("quleepAuth") || null);
  const navigate = useNavigate();

  const columns = [
    { title: "Title", dataIndex: "title", key: "title" },
    { title: "Description", dataIndex: "description", key: "description" },
    { title: "Status", dataIndex: "status", key: "status" },
    { title: "Due Date", dataIndex: "dueDate", key: "dueDate" },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <Link to={`task/${record._id}`}>View</Link>
          <Link to={`/task/edit/${record._id}`}>Edit</Link>
          <Popconfirm
            placement="leftTop"
            title="Are you sure to delete this task?"
            description="Delete the task"
            okText="Delete"
            onConfirm={() => handleDeleteTask(record._id)}
          >
            <Button type="link">Delete</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const handleDeleteTask = (id) => {
    if (!id)
      return messageApi.open({
        type: "error",
        content: "something went wrong",
        duration: 3,
      });
    setIsLoading(true);
    try {
      axios
        .delete(`http://localhost:8080/tasks/${id}`, {
          headers: { Authorization: token },
        })
        .then(() => {
          messageApi.open({
            type: "success",
            content: "task deleted successfully",
            duration: 3,
          });
          const newData = taskData.filter((task) => task._id !== id);
          setTaskData(newData);
        })
        .catch(() => {
          return messageApi.open({
            type: "error",
            content: "something went wrong",
            duration: 3,
          });
        });
      setIsLoading(false);
    } catch (err) {
      console.log(err);
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
    setIsLoading(true);
    try {
      axios
        .get("http://localhost:8080/tasks", {
          headers: { Authorization: token },
        })
        .then((res) => {
          // console.log(res.data.tasks);
          const tasks = res.data.tasks.map(
            (task) =>
              (task = {
                ...task,
                dueDate: new Date(task.dueDate).toLocaleDateString("en-CA"),
              })
          );
          setTaskData(tasks);
        })
        .catch((err) => {
          console.log(err);
        });
      setIsLoading(false);
    } catch (err) {
      console.log(err);
      setIsLoading(false);
    }
  }, [token]);

  // console.log(taskData);
  return (
    <div className={styles.container}>
      {contextHolder}
      <h1 className={styles.title}>Task App</h1>
      <Spin spinning={isLoading} fullscreen></Spin>
      {taskData && taskData.length ? (
        <>
          <Button type="primary" onClick={() => navigate(`/task/add`)}>
            Add new task
          </Button>
          <Table
            className={styles.table}
            columns={columns}
            dataSource={taskData}
            pagination={{
              pageSize: 4,
            }}
            rowKey="_id"
          />
        </>
      ) : (
        <>
          <h2>No task found!</h2>{" "}
          <Button type="primary" onClick={() => navigate(`/task/add`)}>
            Add new task
          </Button>
        </>
      )}
      ;
    </div>
  );
};
export default Tasks;
