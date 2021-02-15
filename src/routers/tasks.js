const express = require("express");
const router = new express.Router();
const Task = require("../models/task");
const auth = require("../middleware/auth");

router.post("/tasks", auth, async (request, response) => {
  // const task = new Task(request.body);
  const task = new Task({
    ...request.body,
    owner: request.user._id,
  });
  try {
    await task.save();
    response.status(201).json({
      status: "success",
      task,
    });
  } catch (error) {
    response.status(400).json({
      status: "error",
      error,
    });
  }
});

// /tasks?completed=true
// /tasks?limit=10&skip=10
// /tasks?sortBy=createdAt:asc/desc
router.get("/tasks", auth, async (request, response) => {
  try {
    // const tasks = await Task.find({ owner:req.user._id });
    let match = {};
    let limit = parseInt(request.query.limit);
    let skip = parseInt(request.query.skip);
    let sort = {};

    if (request.query.completed) {
      match.completed = request.query.completed === "true";
    }

    if (request.query.sortBy) {
      const [sortField, sortOrder] = request.query.sortBy.split(":");
      sort[sortField] = sortOrder === "desc" ? -1 : 1;
    }

    await request.user
      .populate({
        path: "tasks",
        match,
        options: {
          limit,
          skip,
          sort,
        },
      })
      .execPopulate();

    response.status(201).json({
      status: "success",
      tasks: request.user.tasks,
    });
  } catch (error) {
    console.log(error);
    response.status(400).json({
      status: "error",
      error,
    });
  }
});

router.get("/tasks/:id", auth, async (request, response) => {
  const _id = request.params.id;
  const updates = Object.keys(request.body);
  try {
    // const task = await Task.findById(_id);

    const task = await Task.findOne({ _id, owner: request.user._id });

    updates.forEach((update) => {
      task[update] = request.body[update];
    });

    await task.save();

    if (!task) {
      throw new Error("Task not Found");
    }
    response.status(201).json({
      status: "success",
      task,
    });
  } catch (error) {
    response.status(404).json({
      status: "error",
      error,
    });
  }
});
router.patch("/tasks/:id", auth, async (request, response) => {
  const _id = request.params.id;
  try {
    const task = await Task.findByIdAndUpdate(_id, request.body, {
      new: true,
      runValidators: true,
    });
    if (!task) {
      throw new Error("User not Found");
    }
    response.status(201).json({
      status: "success",
      task,
    });
  } catch (error) {
    response.status(404).json({
      status: "error",
      error,
    });
  }
});

router.delete("/tasks/:id", async (req, res) => {
  const _id = req.params.id;
  try {
    const task = await Task.findByIdAndDelete(_id);
    if (!task) {
      throw new Error("Task not Found");
    }
    res.status(201).json({
      status: "success",
      task,
    });
  } catch (error) {
    res.status(404).json({
      status: "error",
      error,
    });
  }
});

module.exports = router;
