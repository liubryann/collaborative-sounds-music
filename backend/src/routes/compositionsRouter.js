import express from "express";
import { Composition } from "../models/composition.js";
import { User } from "../models/user.js";
import { UsersCompositions } from "../models/userscompositions.js";
import { validCompositionSchema } from "../validators/compositionValidator.js";
import { isAuthenticated } from "../middleware/auth.js";

export const compositionRouter = express.Router();

// Create a new composition
compositionRouter.post("/", isAuthenticated, async (req, res, next) => {
  let { value, err } = validCompositionSchema.validate(req.body);
  if (err) return res.status(400).json({ error: err.message });

  try {
    const composition = await Composition.create({
      ...value,
      owner: req.session.user.username,
    });
    await composition.addUser(req.session.user.id, {
      through: "UserComposition",
    });

    return res.status(200).json({ composition: composition.title });
  } catch (e) {
    return res.status(422).json({ error: e.message });
  }
});

// Get all compositions for a user
compositionRouter.get("/:userId", isAuthenticated, async (req, res) => {
  if (req.session.user.id !== +req.params.userId)
    return res.status(401).json({ error: "Unauthorized" });

  const compositions = await UsersCompositions.findAll({
    where: { UserId: +req.params.userId },
    include: {
      model: Composition,
    },
  });
  return res
    .status(200)
    .json({ compositions: compositions, count: compositions.length });
});

// Get a composition by id
compositionRouter.get("/:id", isAuthenticated, async (req, res) => {
  // only retrieve composition if it is in the user's collaborations
  const exists = await UsersCompositions.findOne({
    where: {
      UserId: req.session.user.id,
      CompositionId: req.params.id,
    },
  });
  if (!exists) return res.status(404).json({ error: "Composition not found" });

  const composition = await Composition.findByPk(req.params.id);
  if (!composition)
    return res.status(404).json({ error: "Composition not found" });

  return res.status(200).json({ composition: composition });
});

// Delete a composition
compositionRouter.delete("/:id", isAuthenticated, async (req, res) => {
  const exists = await Composition.findOne({
    where: {
      id: req.params.id,
    },
    include: {
      model: User,
      where: { id: req.session.user.id },
    },
  });
  if (!exists) return res.status(404).json({ error: "Composition not found" });

  const composition = await Composition.findByPk(req.params.id);
  if (!composition)
    return res.status(404).json({ error: "Composition not found" });

  await composition.destroy();
  return res.status(200).json({ message: "Composition deleted" });
});

// Update a composition's title
compositionRouter.patch("/:id", isAuthenticated, async (req, res) => {
  const exists = await UsersCompositions.findOne({
    where: {
      UserId: req.session.user.id,
      CompositionId: req.params.id,
    },
  });
  if (!exists) return res.status(404).json({ error: "Composition not found" });

  const composition = await Composition.findByPk(req.params.id);
  if (!composition)
    return res.status(404).json({ error: "Composition not found" });

  let { value, err } = validCompositionSchema.validate(req.body);
  if (err) return res.status(400).json({ error: err.message });

  await composition.update(value);
  return res.status(200).json({ message: "Composition updated" });
});
