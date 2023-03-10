const express = require("express");
const bcrypt = require("bcrypt");
const User = require("../models/user.js");
const { validUserSchema } = require("../validators/userValidator.js");
const {
  validCompositionSchema,
} = require("../validators/compositionValidator.js");

export const userRouter = express.Router();

userRouter.post("/signup", (req, res) => {
  validUserSchema.validate(req.body, (err, value) => {
    if (err) return res.status(400).json({ error: err.message });

    const saltRounds = 10;
    const salt = bcrypt.genSaltSync(saltRounds);
    const password = bcrypt.hashSync(req.body.password, salt);
    value.password = password;

    const user = new User(value);
    user.save((err) => {
      if (err) return handleError(err);
    });

    return res.status(200).json({ user: user.username });
  });
});

userRouter.post("/login", (req, res) => {
  validUserSchema.validate(req.body, (err) => {
    if (err) return res.status(400).json({ error: err.message });
  });

  user.findById({ username: req.body.username }, (err, user) => {
    if (err) return handleError(err);

    const areCredentialsValid = bcrypt.compareSync(
      req.body.password,
      user.password
    );
    if (areCredentialsValid) {
      req.session.user = user;
      return res.status(200).json({ user: user.username });
    } else {
      return res.status(400).json({ error: "Invalid password" });
    }
  });
});

userRouter.get("/signout", (req, res) => {
  req.session.destroy();
  res.status(200).json({ message: "Signed out" });
});
