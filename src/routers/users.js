const express = require("express");
const router = new express.Router();
const User = require("../models/user");
const auth = require("../middleware/auth");
const multer = require("multer");
// const { sendWelcomeEmail } = require("../emails/account");

router.post("/users", async (request, response) => {
  const user = new User(request.body);
  try {
    await user.save();
    // sendWelcomeEmail(user.email, user.name);
    const token = await user.generateAuthToken();
    response.status(201).json({
      status: "success",
      user,
      token,
    });
  } catch (error) {
    response.status(400).json({
      status: "error",
      error,
    });
  }
});

router.post("/users/login", async (request, response) => {
  try {
    const user = await User.findByCredentials(
      request.body.email,
      request.body.password
    );

    const token = await user.generateAuthToken();

    response.status(200).json({
      status: "success",
      // user: user.getPublicProfile(),
      user,
      token,
    });
  } catch (error) {
    console.log(error);
    response.status(400).json({
      status: "error",
      error,
    });
  }
});

router.post("/users/logout", auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((token) => {
      return token !== req.token;
    });

    await req.user.save();
    res.send();
  } catch (error) {
    res.status(400).send();
  }
});

router.post("/users/logoutAll", auth, async (req, res) => {
  try {
    req.users.tokens = [];
    await req.user.save();
    res.send();
  } catch (error) {
    res.status(400).send();
  }
});

router.get("/users/me", auth, async (request, response) => {
  response.status(201).json({
    status: "success",
    user: request.user,
  });
});

router.patch("/users/me", auth, async (request, response) => {
  const updates = Object.keys(request.body);
  try {
    // const user = await User.findById(_id);
    const user = request.user;
    updates.forEach((update) => (user[update] = request.body[update]));

    await user.save();
    // const user = await User.findByIdAndUpdate(_id, request.body, {
    //   new: true,
    //   runValidators: true,
    // });
    // if (!user) {
    //   throw new Error("User not Found");
    // }
    response.status(201).json({
      status: "success",
      user,
    });
  } catch (error) {
    console.log(error);
    response.status(404).json({
      status: "error",
      error,
    });
  }
});

router.delete("/users/me", auth, async (req, res) => {
  // const _id = req.params.id;
  // const _id = req.user._id;
  try {
    // const user = await User.findByIdAndDelete(_id);
    // if (!user) {
    //   throw new Error("User not Found");
    // }

    await req.user.remove();

    res.status(201).json({
      status: "success",
      user: req.user,
    });
  } catch (error) {
    res.status(404).json({
      status: "error",
      error,
    });
  }
});

const upload = multer({
  // dest: "avatars", to save locally image but the data gets deleted once app is deployed again so use db
  limit: {
    fileSize: 1000000,
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      return cb(new Error("Please upload an image"));
    }
    cb(undefined, true);
  },
});

router.get("/users/:id/avatar", auth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user || !user.avatar) {
      throw new Error();
    }

    res.set("Content-Type", "image/png");
    res.send(user.avatar);
  } catch (error) {
    res.status(400).send();
  }
});

router.post(
  "/users/me/avatar",
  auth,
  upload.single("avatar"),
  async (req, res) => {
    const buffer = await sharp(req.file.buffer)
      .resize({ width: 250, height: 250 })
      .png()
      .toBuffer();

    req.user.avatar = buffer;
    await req.user.save();
    res.send();
  },
  (error, req, res, next) => {
    res.status(400).send({ error: error.message });
  }
);

router.delete(
  "/users/me/avatar",
  auth,
  async (req, res) => {
    req.user.avatar = undefined;
    await req.user.save();
    res.send();
  },
  (error, req, res, next) => {
    res.status(400).send({ error: error.message });
  }
);

module.exports = router;
// router.get("/users/:id", async (request, response) => {
//   const _id = request.params.id;
//   try {
//     const user = await User.findById(_id);
//     if (!user) {
//       throw new Error("User not Found");
//     }
//     response.status(201).json({
//       status: "success",
//       user,
//     });
//   } catch (error) {
//     response.status(404).json({
//       status: "error",
//       error,
//     });
//   }
// });
