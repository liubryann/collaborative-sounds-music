const { AudioFile } = require("../models/audiofile.js");
const { User } = require("../models/user.js");
const express = require("express");
const { isAuthenticated } = require("../middleware/auth.js");
const multer = require("multer");
const path = require("path");

const audioRouter = express.Router();
const upload = multer({ dest: "uploads/" });

//Add audio file
audioRouter.post(
    "/",
    isAuthenticated,
    upload.single("audio"),
    async (req, res) => {
        const audiofile = await AudioFile.create({
            name: req.body.name,
            audio: req.file,
            UserId: req.session.user,
        });
        if (image === null) {
            return res.status(400).json({ error: "Invalid entries." });
        }
        return res.json({ audiofile });
    }
);

//Get the audio file of :id
audioRouter.get("/:id", isAuthenticated, async (req, res) => {
    const audiofile = await AudioFile.findByPk(req.params.id);
    if (audiofile === null) {
        return res
            .status(404)
            .json({ error: "Audio id: " + req.params.id + " does not exist." });
    }
    res.setHeader("Content-type", audiofile.audio.mimetype);
    res.sendFile(audiofile.audio.path, { root: path.resolve() });
});

//Delete audio of :id
audioRouter.delete("/:id", isAuthenticated, async (req, res) => {
    //Delete Image
    const audiofile = await AudioFile.findByPk(req.params.id);
    if (audiofile === null) {
        return res
            .status(404)
            .json({ error: "Audio id:" + req.params.id + " does not exist." });
    }
    //only delete owned image
    if (audiofile.UserId === req.session.user.id) {
        await audiofile.destroy();
    } else {
        return res.status(401).json({ error: "Not authorized to delete" });
    }
    return res.json(audiofile);
});

module.exports = { audioRouter };