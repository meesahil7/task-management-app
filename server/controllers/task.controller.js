const mongoose = require("mongoose");
const { Task } = require("../models/task.model");

const addTask = async (req, res) => {
  try {
    const { title, description, status, dueDate } = req.body;
    const task = await Task.create({
      title,
      description,
      status,
      dueDate,
      userId: req.body.userId,
    });
    res.send({ message: "task-created-successfully", task });
  } catch (err) {
    console.log({ message: "error-in-addtask-controller", error: err.message }),
      res.status(500).json({ error: "internal-server-error" });
  }
};

const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ userId: req.body.userId });
    res.send({ message: "tasks-fetched-successfully", tasks });
  } catch (err) {
    console.log({
      message: "error-in-getTasks-controller",
      error: err.message,
    }),
      res.status(500).json({ error: "internal-server-error" });
  }
};

const getSingleTask = async (req, res) => {
  try {
    const { id } = req.params;
    const isValidId = mongoose.isValidObjectId(id);
    if (!isValidId) return res.status(400).json({ error: "task-not-found" });
    const task = await Task.find({
      $and: [{ _id: id }, { userId: req.body.userId }],
    });
    if (!task.length)
      return res.status(401).json({ message: "unauthorized-action" });
    return res.status(200).json({ message: "task-fetched", task });
  } catch (err) {
    console.log({
      message: "error-in-getSingleTask-controller",
      error: err.message,
    }),
      res.status(500).json({ error: "internal-server-error" });
  }
};

const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const isValidId = mongoose.isValidObjectId(id);
    if (!isValidId)
      return res.status(400).json({ error: "cannot-update-task" });
    const { title, description, status, dueDate } = req.body;
    const updatedTask = await Task.findOneAndUpdate(
      { $and: [{ _id: id }, { userId: req.body.userId }] },
      {
        title,
        description,
        status,
        dueDate,
      },
      { new: true }
    );
    if (!updatedTask)
      return res.status(401).json({ message: "unauthorized-action" });
    res.status(200).json({ message: "task-updated-successfully", updatedTask });
  } catch (err) {
    console.log({
      message: "error-in-updateTask-controller",
      error: err.message,
    }),
      res.status(500).json({ error: "internal-server-error" });
  }
};

const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    const isValidId = mongoose.isValidObjectId(id);
    if (!isValidId)
      return res.status(400).json({ error: "cannot-delete-task" });
    const task = await Task.findOneAndDelete({
      $and: [{ _id: id }, { userId: req.body.userId }],
    });
    if (!task) return res.status(401).json({ message: "unauthorized-action" });
    res.status(200).json({ message: "task-deleted-successfully" });
  } catch (err) {
    console.log({
      message: "error-in-updateTask-controller",
      error: err.message,
    }),
      res.status(500).json({ error: "internal-server-error" });
  }
};

module.exports = { addTask, getTasks, getSingleTask, updateTask, deleteTask };
