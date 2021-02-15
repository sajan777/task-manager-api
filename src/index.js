const express = require("express");
require("./db/mongoose");
const { request } = require("express");

// Routers
const userRouter = require("./routers/users");
const taskRouter = require("./routers/tasks");

const app = express();
const port = process.env.PORT;

// app.use((req, res, next) => {

//   next();
// });

// File upload using express
// const multer = require("multer");
// const upload = multer({
//   dest: "images",
//   limit: {
//     fileSize: 1000000,
//   },
//   fileFilter(req, file, cb) {
//     if (file.originalName.match(/\.(doc|docx)$/)) {
//       return cb(new Error("File must be doc File"));
//     }
//     cb(undefined, true); // accept upload

//     // cb(undefined,false) // reject upload
//   },
// });
// app.post(
//   "/upload",
//   upload.single("upload"),
//   (req, res) => {
//     res.send();
//   },
//   (error, req, res, next) => {
//     res.status(400).send({ error: error.message });
//   }
// );

// json middleware
app.use(express.json());

// use Routers
app.use(userRouter);
app.use(taskRouter);

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

// const Task = require("./models/task");
// const User = require("./models/user");
// const main = async () => {
//   // find the user by ownerId
//   const user = await User.findById("602027418479122c74652f01");
//   await user.populate("tasks").execPopulate();
//   console.log(user.tasks);

//   // find the owner by taskID
//   // const task = await Task.findById("60202ccd5940b787f850bd20");
//   // await task.populate("owner").execPopulate();
//   // console.log(task.owner);
// };
// main();
