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

// Get a composition by id
compositionRouter.get("/:id", isAuthenticated, async (req, res) => {
  // only retrieve composition if it is in the user's collaborations
  const composition = await UsersCompositions.findOne({
    where: {
      UserId: req.session.user.id,
      CompositionId: req.params.id,
    },
    include: Composition,
  });
  if (!composition)
    return res.status(404).json({ error: "Composition not found" });

  return res.status(200).json({ composition: composition.Composition });
});

// Delete a composition by id
compositionRouter.delete("/:id", isAuthenticated, async (req, res) => {
  const composition = await Composition.findOne({
    where: { id: req.params.id },
    include: {
      model: User,
      on: { username: Composition.owner },
      where: {
        id: req.session.user.id,
      },
      attributes: ["id", "username"],
    },
  });
  if (!composition)
    return res.status(404).json({ error: "Composition not found" });

  await composition.destroy();
  return res.status(200).json({ message: "Composition deleted" });
});

// Update a composition's title
compositionRouter.patch("/:id", isAuthenticated, async (req, res) => {
  validCompositionSchema.validate(req.body, (err) => {
    if (err) return res.status(400).json({ error: err.message });
  });

  try {
    const [recordsChanged] = await Composition.update(
      { title: req.body.title },
      { where: { id: req.params.id, owner: req.session.user.username } }
    );
    if (recordsChanged === 0)
      return res.status(404).json({ error: "Composition not found" });

    return res.status(200).json({ message: "Composition updated" });
  } catch (e) {
    return res.status(422).json({ error: e.message });
  }
});

// TODO: post or put request?
compositionRouter.post(
  "/collaborators/:id",
  isAuthenticated,
  async (req, res) => {
    try {
      const [_, recordCreated] = await UsersCompositions.findOrCreate({
        where: {
          UserId: req.body.userId,
          CompositionId: req.params.id,
        },
      });
      // TODO: how to handle when user already has access to the composition
      if (!recordCreated)
        return res
          .status(200)
          .json({ message: "User already has access to composition" });

      const composition = await Composition.findOne({
        where: { id: req.params.id },
      });
      return res.status(200).json({ composition: composition });
    } catch (error) {
      return res.status(422).json({ error: error.message });
    }
  }
);

compositionRouter.delete(
  "/collaborators/:id",
  isAuthenticated,
  async (req, res) => {
    try {
      const collaboration = await UsersCompositions.findOne({
        where: {
          UserId: req.body.userId,
          CompositionId: req.params.id,
        },
      });

      if (!collaboration) {
        return res.status(404).json({ error: "Collaboration not found" });
      } else {
        await collaboration.destroy();
        return res.status(200).json({ message: "Collaboration deleted" });
      }
    } catch (error) {
      return res.status(422).json({ error: error.message });
    }
  }
);
