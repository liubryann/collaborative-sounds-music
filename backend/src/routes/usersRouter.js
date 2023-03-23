const express = require("express");
const bcrypt = require("bcrypt");
const { User } = require("../models/user.js");
const { Composition } = require("../models/composition.js");
const { UsersCompositions } = require("../models/userscompositions.js");
const { isAuthenticated } = require("../middleware/auth.js");
const { validUserSchema } = require("../validators/userValidator.js");

const userRouter = express.Router();

userRouter.post("/signup", async (req, res) => {
  let { value, err } = validUserSchema.validate(req.body);
  if (err) return res.status(400).json({ error: err.message });

  const saltRounds = 10;
  const salt = bcrypt.genSaltSync(saltRounds);
  const password = bcrypt.hashSync(req.body.password, salt);

  try {
    const user = await User.create({
      ...value,
      password: password,
    });
    return res.json({ user: user.username });
  } catch (e) {
    return res.status(422).json({ error: e.message });
  }
});

userRouter.post("/login", async (req, res) => {
  validUserSchema.validate(req.body, (err) => {
    if (err) return res.status(400).json({ error: err.message });
  });

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

userRouter.get("/:userId/compositions", isAuthenticated, async (req, res) => {
  if (req.session.user.id !== +req.params.userId)
    return res.status(403).json({ error: "Unauthorized" });

  try {
    const { rows, count } = await UsersCompositions.findAndCountAll({
      where: { UserId: +req.params.userId },
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

module.exports = { userRouter };
