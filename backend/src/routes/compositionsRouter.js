const express = require("express");
const { Composition } = require("../models/composition.js");
const { User } = require("../models/user.js");
const { UsersCompositions } = require("../models/userscompositions.js");
const { isAuthenticated } = require("../middleware/auth.js");
const compositionSchema = require("../middleware/schemas/compositionSchema.js");
const isRequestValid = require("../middleware/validator.js");
const { sequelize } = require("../datasource.js");
const sgMail = require("@sendgrid/mail");

const compositionRouter = express.Router();

// Create a new composition
compositionRouter.post(
  "/",
  isRequestValid(compositionSchema),
  isAuthenticated,
  async (req, res) => {
    try {
      const composition = await Composition.create({
        ...req.body,
        owner: req.session.user.username,
      });
      await composition.addUser(req.session.user.id, {
        through: "UserComposition",
      });

      return res.status(200).json({ composition });
    } catch (e) {
      return res.status(422).json({ error: e.message });
    }
  }
);

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
compositionRouter.patch(
  "/:id",
  isRequestValid(compositionSchema),
  isAuthenticated,
  async (req, res) => {
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
  }
);

// Update the composition's shared
compositionRouter.post(
  "/collaborators/:id",
  isAuthenticated,
  async (req, res) => {
    const user = await User.findOne({
      where: { email: req.body.email },
    });
    if (!user) {
      return res.status(404).json({ error: "No user with that email." });
    }
    const comp = await Composition.findOne({
      where: { pageUuid: req.params.id },
    });
    if (!comp) {
      return res.status(404).json({ error: "Composition not found" });
    }
    try {
      const newusercomp = await UsersCompositions.findOrCreate({
        where: {
          CompositionId: comp.id,
          UserId: user.id,
        },
      });
      if (!newusercomp) {
        return res.status(500).json({ error: "Creation failed" });
      }
      //send email.
      const origin = process.env.PUBLIC_URL
        ? process.env.PUBLIC_URL
        : "http://localhost:3000";
      //Try to send an email
      const msg = {
        to: req.body.email,
        from: process.env.SENDGRID_EMAIL_ADDR,
        subject: "Invite to collaborate on CSM.",
        text: `A new composition has been shared with you! View it here: ${origin}/compose/${req.params.id}`,
      };
      sgMail
        .send(msg)
        .then(() => {})
        .catch(console.error("failed email"));
      return res.status(200).json({ message: "Composition updated" });
    } catch (e) {
      return res.status(422).json({ error: e.message });
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

module.exports = { compositionRouter };
