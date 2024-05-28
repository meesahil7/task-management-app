const express = require("express");
const {
  addTask,
  getTasks,
  getSingleTask,
  updateTask,
  deleteTask,
} = require("../controllers/task.controller");

const taskRouter = express.Router();

taskRouter.post("/tasks", addTask);

taskRouter.get("/tasks", getTasks);

taskRouter.get("/tasks/:id", getSingleTask);

taskRouter.put("/tasks/:id", updateTask);

taskRouter.delete("/tasks/:id", deleteTask);

module.exports = { taskRouter };
