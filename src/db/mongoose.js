const mongoose = require("mongoose");
const validator = require("validator");

const connectionURL = process.env.MONGO_DB;

mongoose.connect(
  connectionURL,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  },
  (err, client) => {
    if (err) {
      console.log("err");
    }
    console.log("connected");
  }
);

// const user1 = new User({
//   name: "Pike",
//   age: 21,
//   email: "pike@gmail.com",
//   password: "test12345",
// });

// user1
//   .save()
//   .then((res) => {
//     console.log(res);
//   })
//   .catch((err) => {
//     console.log(err);
//   });

// const task1 = new Tasks({
//   description: "game",
//   completed: true,
// });

// task1
//   .save()
//   .then((res) => {
//     console.log(res);
//   })
//   .catch((err) => {
//     console.log(err);
//   });
