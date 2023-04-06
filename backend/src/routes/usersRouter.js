const express = require("express");
const bcrypt = require("bcrypt");
const { User } = require("../models/user.js");
const { Composition } = require("../models/composition.js");
const { UsersCompositions } = require("../models/userscompositions.js");
const { isAuthenticated } = require("../middleware/auth.js");
const {
  loginSchema,
  userSchema,
} = require("../middleware/schemas/userSchema.js");
const isRequestValid = require("../middleware/validator.js");
const sgMail = require("@sendgrid/mail");

const userRouter = express.Router();
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

userRouter.post("/signup", isRequestValid(userSchema), async (req, res) => {
  const userExists = await User.findOne({
    where: { username: req.body.username },
  });
  if (userExists) {
    return res.status(422).json({ error: "Username already exists" });
  }

  const emailExists = await User.findOne({ where: { email: req.body.email } });
  if (emailExists) {
    return res.status(422).json({ error: "Email already exists" });
  }

  const saltRounds = 10;
  const salt = bcrypt.genSaltSync(saltRounds);
  const hashedPassword = bcrypt.hashSync(req.body.password, salt);
  try {
    const user = await User.create({
      ...req.body,
      password: hashedPassword,
    });
    //Try to send an email
    const msg = {
      to: req.body.email,
      from: process.env.SENDGRID_EMAIL_ADDR,
      subject: "Signup Confirmation to Creative Sounds and Music",
      text: "Excited to start making some tunes with you!",
    };
    sgMail
      .send(msg)
      .then(() => {})
      .catch(console.error("failed email"));
    req.session.user = user;
    return res.json({ user: user.username });
  } catch (e) {
    return res.status(422).json({ error: e.message });
  }
});

userRouter.post("/login", isRequestValid(loginSchema), async (req, res) => {
  const user = await User.findOne({ where: { username: req.body.username } });
  if (!user)
    return res.status(401).json({ error: "Incorrect username or password" });

  const areCredentialsValid = bcrypt.compareSync(
    req.body.password,
    user.password
  );

  if (areCredentialsValid) {
    req.session.user = user;
    return res.status(200).json({ user: user.username });
  } else {
    return res.status(401).json({ error: "Incorrect username or password" });
  }
});

userRouter.get("/signout", isAuthenticated, (req, res) => {
  req.session.destroy();
  return res.status(200).json({ message: "Signed out" });
});

userRouter.get("/compositions", isAuthenticated, async (req, res) => {
  try {
    const { rows, count } = await UsersCompositions.findAndCountAll({
      where: { UserId: +req.session.user.id },
      attributes: ["CompositionId"],
      include: {
        model: Composition,
      },
    });
    // Room id's should be the composition id
    const compositions = rows.map((row) => row.Composition);
    return res.status(200).json({ compositions: compositions, count });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

userRouter.get("/me", isAuthenticated, async (req, res) => {
  try {
    const user = await User.findByPk(req.session.user.id);
    return res.status(200).json({
      username: user.username,
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

module.exports = { userRouter };
